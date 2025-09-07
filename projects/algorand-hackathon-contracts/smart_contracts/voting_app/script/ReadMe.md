# VotingApp on Algorand

This project implements a simple governance / membership voting smart contract on Algorand using **ARC-4 (algopy)**.  
It supports:

- Admin-controlled membership list
- Creating proposals with descriptions + deadlines
- Enforcing that all members must vote OR the deadline must pass before finalization
- Yes/No tallying
- Accepting new members only if a proposal passes

The contract is built and deployed using **AlgoKit**.

---

## Smart Contract Functions

- `create(admin)` → initialize app, set admin
- `add_member(acct)` → admin adds a member - only for testing purpose only - in real situation it could be voted for new member
- `remove_member(acct)` → admin removes a member
- `create_proposal(description, end_round)` → admin creates proposal; snapshot required voters
- `vote(pid, choice)` → member casts Yes (1) / No (0) vote
- `finalize(pid)` → finalize if everyone voted OR deadline passed
- `record_accept(pid, candidate)` → admin records candidate if proposal passed
- `is_member(acct)` → check if account is active member
- `get_proposal_details(pid)` → readonly getter: returns `(description, yes, no, status)`

---

## Setup

```bash
# clone this repo
git clone <your repo url>
cd algorand-hackathon-contracts

# install dependencies in venv
poetry install  # or python -m pip install -r requirements.txt

# build contract
algokit project run build

# deploy contract
algokit deploy
```

---

---

## Scripts

All scripts live under:

```
smart_contracts/voting_app/script/
```

## Run them from project root with `python`.

### `create_proposal.py`

Used by the **admin (deployer)** to create new proposals.

- Prompts for `app_id`, description, and deadline in minutes.
- Calls `create_proposal` on-chain.
- Prints the new proposal ID (`pid`) and the deadline round.

**Usage:**

```bash
python smart_contracts/voting_app/script/create_proposal.py
```

---

### `cast_vote.py`

Allows a **member or the deployer** to cast their vote.

- Prompts for `app_id`, `pid`, and which account to vote with (`DEPLOYER` or `MEMBER`).
- Prompts for vote choice (yes/no).
- Calls `vote(pid, choice)` on-chain.
- Enforces one vote per member (contract prevents double voting).

**Usage:**

```bash
python smart_contracts/voting_app/script/cast_vote.py
```

---

### `view_status.py`

Retrieves and displays the details of a proposal.

- Prompts for `app_id` and `pid`.
- Calls `get_proposal_details(pid)`.
- Prints description, YES/NO tallies, status, and current blockchain round.
- Status codes: `1=Active`, `2=Passed`, `3=Failed`, `0=Unknown`.

**Usage:**

```bash
python smart_contracts/voting_app/script/view_status.py
```

---

### `finalize_proposal.py`

Finalizes the result of a proposal.

- Prompts for `app_id` and `pid`.
- Calls `finalize(pid)`.
- Can only succeed if:
  - All members voted, OR
  - The deadline round has been reached.

**Usage:**

```bash
python smart_contracts/voting_app/script/finalize_proposal.py
```

---

### `finalize_and_accept.py`

Combines **finalization and acceptance** in one flow.

- Calls `finalize(pid)`.
- Reads `get_proposal_details(pid)` to check outcome.
- If status=Passed → calls `record_accept(pid, candidate)`.
- Prints result and optional membership confirmation.

**Usage:**

```bash
python smart_contracts/voting_app/script/finalize_and_accept.py
```

### `new_account.py`
Is for adding a new account under the MEMBER Wallet for testing existing member or not

### `check_member.py` and `remove_member.py` is for checking and removing an account from being a valid member


**The flow of running the scripts:**

create_proposal.py → cast_vote.py (DEPLOYER + MEMBER) → view_status.py → finalize_proposal.py → accept_candidate.py
                                                                                              ↘
                                                                                              finalize_and_accept.py (combined shortcut)
