from algopy import Account, ARC4Contract, BoxMap, Global, GlobalState, Txn, UInt64
from algopy.arc4 import String, abimethod
from algopy.arc4 import UInt64 as AUInt64


class VotingApp(ARC4Contract):
    def __init__(self) -> None:
        # Admin + proposal id
        self.admin = GlobalState(Account)
        self.next_pid = GlobalState(UInt64)

        # Track active members and a global count
        self.members = BoxMap(
            Account, UInt64, key_prefix="member"
        )  # 1=active, 0=inactive
        self.member_count = GlobalState(UInt64)  # number of active members

        # Proposals and tallies
        self.proposals = BoxMap(UInt64, String, key_prefix="prop")
        self.yes_votes = BoxMap(UInt64, UInt64, key_prefix="yes")
        self.no_votes = BoxMap(UInt64, UInt64, key_prefix="no")
        self.status = BoxMap(
            UInt64, UInt64, key_prefix="stat"
        )  # 1=Active, 2=Passed, 3=Failed

        # Deadline + required/voted counters (NO per-address snapshot)
        self.end_round = BoxMap(UInt64, UInt64, key_prefix="end")  # when voting ends
        self.required_n = BoxMap(
            UInt64, UInt64, key_prefix="reqn"
        )  # snapshot of member_count
        self.voted_n = BoxMap(
            UInt64, UInt64, key_prefix="votedn"
        )  # number of unique voters recorded

        # Vote receipts to enforce one vote per member
        self.vote_receipt = BoxMap(
            tuple[UInt64, Account], UInt64, key_prefix="rcpt"
        )  # 1 if already voted

        # (Optional) accepted candidate per proposal
        self.accepted = BoxMap(UInt64, Account, key_prefix="acc")

    @abimethod(create="require")
    def create(self, admin: Account) -> None:
        self.admin.value = admin
        self.next_pid.value = UInt64(1)
        self.member_count.value = UInt64(0)

    @abimethod()
    def add_member(self, acct: Account) -> None:
        assert Txn.sender == self.admin.value, "Only admin can add"
        prev, has = self.members.maybe(acct)
        if not has or prev == UInt64(0):
            self.members[acct] = UInt64(1)
            self.member_count.value = self.member_count.value + UInt64(1)

    @abimethod()
    def remove_member(self, acct: Account) -> None:
        assert Txn.sender == self.admin.value, "Only admin can remove"
        prev, has = self.members.maybe(acct)
        if has and prev == UInt64(1):
            self.members[acct] = UInt64(0)
            # avoid underflow if someone calls twice
            if self.member_count.value > UInt64(0):
                self.member_count.value = self.member_count.value - UInt64(1)

    @abimethod()
    def is_member(self, acct: Account) -> AUInt64:
        v, has = self.members.maybe(acct)
        return AUInt64(v if has else UInt64(0))

    @abimethod()
    def create_proposal(self, description: String, end_round: UInt64) -> UInt64:
        # Only admin creates; snapshot required_n from current active members
        assert Txn.sender == self.admin.value, "Only admin"
        pid = self.next_pid.value
        self.next_pid.value = self.next_pid.value + UInt64(1)

        self.proposals[pid] = description
        self.yes_votes[pid] = UInt64(0)
        self.no_votes[pid] = UInt64(0)
        self.status[pid] = UInt64(1)  # Active
        self.end_round[pid] = end_round
        self.required_n[pid] = self.member_count.value  # <-- SNAPSHOT here
        self.voted_n[pid] = UInt64(0)
        return pid

    @abimethod(readonly=True)
    def get_proposal_details(
        self, pid: UInt64
    ) -> tuple[String, UInt64, UInt64, UInt64]:
        desc, has_desc = self.proposals.maybe(pid)
        assert has_desc, "Proposal not found"

        yes = self.yes_votes.get(pid, default=UInt64(0))
        no = self.no_votes.get(pid, default=UInt64(0))
        st = self.status.get(pid, default=UInt64(0))  # or assert existence via maybe()

        return (desc, yes, no, st)

    @abimethod()
    def vote(self, pid: UInt64, choice: UInt64) -> None:
        # Must be an active member at time of vote
        mflag, mok = self.members.maybe(Txn.sender)
        assert mok and mflag == UInt64(1), "Not a member"

        # Must be active proposal and within deadline
        st, ok = self.status.maybe(pid)
        assert ok and st == UInt64(1), "Not active"

        # Optional: enforce voting only before or at end round
        end = self.end_round[pid]
        assert Global.round <= end, "Voting window closed"

        # Enforce one vote per account per proposal
        rcpt, has_rcpt = self.vote_receipt.maybe((pid, Txn.sender))
        assert not has_rcpt, "Already voted"
        self.vote_receipt[(pid, Txn.sender)] = UInt64(1)

        # Count this voter towards voted_n
        self.voted_n[pid] = self.voted_n[pid] + UInt64(1)

        # Tally
        if choice == UInt64(1):
            self.yes_votes[pid] = self.yes_votes[pid] + UInt64(1)
        else:
            self.no_votes[pid] = self.no_votes[pid] + UInt64(1)

    @abimethod()
    def finalize(self, pid: UInt64) -> None:
        st, ok = self.status.maybe(pid)
        assert ok and st == UInt64(1), "Not active"

        rn = self.required_n[pid]  # how many must vote
        vn = self.voted_n[pid]  # how many already voted
        end = self.end_round[pid]  # deadline

        # Allow finalize if everyone voted OR deadline reached
        assert (vn == rn) or (Global.round >= end), "Too early"

        yes = self.yes_votes[pid]
        no = self.no_votes[pid]
        self.status[pid] = UInt64(2) if yes > no else UInt64(3)

    @abimethod()
    def record_accept(self, pid: UInt64, candidate: Account) -> None:
        assert Txn.sender == self.admin.value, "Only admin can record"
        st, ok = self.status.maybe(pid)
        assert ok and st == UInt64(2), "Proposal not passed"
        self.accepted[pid] = candidate
        # Optionally auto-add accepted candidate as member:
        prev, has = self.members.maybe(candidate)
        if not has or prev == UInt64(0):
            self.members[candidate] = UInt64(1)
            self.member_count.value = self.member_count.value + UInt64(1)
