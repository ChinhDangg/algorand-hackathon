# scripts/cast_vote.py

import pathlib
import sys

# this file: smart_contracts/voting_app/script/check_member.py
# repo root is 3 levels up
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    VoteArgs,
    VotingAppFactory,
)


def parse_choice(s: str) -> int:
    s = s.strip().lower()
    if s in ("yes", "y", "1"):
        return 1
    if s in ("no", "n", "0"):
        return 0
    raise SystemExit("❌ Use yes/no (y/n/1/0)")


def main():
    app_id = int(input("App ID: ").strip())
    pid = int(input("Proposal ID: ").strip())
    who = input("Vote as (DEPLOYER/MEMBER): ").strip().upper()
    choice = parse_choice(input("Your vote (yes/no): "))

    if who not in ("DEPLOYER", "MEMBER"):
        raise SystemExit("❌ choose DEPLOYER or MEMBER")

    algorand = AlgorandClient.from_environment()
    acct = algorand.account.from_environment(
        who
    )  # requires DEPLOYER_MNEMONIC / MEMBER_MNEMONIC (or KMD wallets)

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=acct.address
    )
    app = factory.get_app_client_by_id(app_id)

    app.send.vote(args=VoteArgs(pid=pid, choice=choice))
    print(f"✅ {who} voted {'YES' if choice==1 else 'NO'} on pid={pid}")


if __name__ == "__main__":
    main()
