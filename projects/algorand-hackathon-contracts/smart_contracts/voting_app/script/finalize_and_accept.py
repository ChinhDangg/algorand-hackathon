# scripts/finalize_and_accept.py

import pathlib
import sys

sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    FinalizeArgs,
    GetProposalDetailsArgs,
    IsMemberArgs,
    RecordAcceptArgs,
    VotingAppFactory,
)


def main():
    app_id = int(input("App ID: ").strip())
    pid = int(input("Proposal ID: ").strip())
    candidate_addr = input("Candidate address to accept if PASSED: ").strip()

    algorand = AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")  # admin / default sender

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=deployer.address
    )
    app = factory.get_app_client_by_id(app_id)

    # 1) Finalize
    try:
        app.send.finalize(args=FinalizeArgs(pid=pid))
        print("✅ finalize called")
    except Exception as e:
        print(
            "🛑 finalize failed (maybe too early: not all voted and deadline not reached)."
        )
        print(f"Reason: {e}")
        return

    # 2) Read outcome
    try:
        details = app.send.get_proposal_details(
            args=GetProposalDetailsArgs(pid=pid)
        ).abi_return
    except Exception as e:
        print("🛑 Could not fetch proposal details after finalize.")
        print(f"Reason: {e}")
        return

    desc, yes, no, status = details
    print(
        f"ℹ️ Proposal[{pid}] '{desc}' → YES={yes} NO={no} status={status} (1=Active,2=Passed,3=Failed)"
    )

    # 3) If Passed, accept candidate
    if int(status) == 2:
        try:
            app.send.record_accept(
                args=RecordAcceptArgs(pid=pid, candidate=candidate_addr)
            )
            print(
                f"🎉 Proposal PASSED — candidate {candidate_addr} recorded & made member."
            )
        except Exception as e:
            print("🛑 record_accept failed (must be admin and status must be 2).")
            print(f"Reason: {e}")
            return

        # 4) Optional: confirm membership flag
        try:
            is_mem = app.send.is_member(
                args=IsMemberArgs(acct=candidate_addr)
            ).abi_return
            print(
                f"🔎 Post-check: is_member({candidate_addr}) = {is_mem} (1=active, 0=not)"
            )
        except Exception as e:
            print(f"⚠️ Could not confirm membership: {e}")
    else:
        print("⚖️ Proposal did not pass — no acceptance performed.")


if __name__ == "__main__":
    main()
