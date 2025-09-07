# scripts/create_proposal.py

import pathlib
import sys

# this file: smart_contracts/voting_app/script/check_member.py
# repo root is 3 levels up
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    CreateProposalArgs,
    VotingAppFactory,
)


def main():
    app_id = int(input("App ID: ").strip())
    desc = input("Proposal description: ").strip() or "All must vote example"

    minutes = float(input("Deadline in minutes (default 1.0): ") or "1.0")

    algorand = AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=deployer.address
    )
    app = factory.get_app_client_by_id(app_id)

    # convert minutes -> rounds (≈ 15 rounds per minute on TestNet/MainNet; ~15–20 on LocalNet; adjust if you like)
    status = algorand.client.algod.status()
    current_round = status.get("last-round")
    rounds_per_min = 15  # tweak for your network speed
    end_round = int(current_round + minutes * rounds_per_min)

    pid = app.send.create_proposal(
        args=CreateProposalArgs(description=desc, end_round=end_round)
    ).abi_return

    print(
        f"✅ Created proposal pid={pid} end_round={end_round} (current={current_round})"
    )


if __name__ == "__main__":
    main()
