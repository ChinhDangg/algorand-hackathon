# scripts/finalize_proposal.py

import pathlib
import sys

# this file: smart_contracts/voting_app/script/check_member.py
# repo root is 3 levels up
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    FinalizeArgs,
    VotingAppFactory,
)


def main():
    app_id = int(input("App ID: ").strip())
    pid = int(input("Proposal ID: ").strip())

    algorand = AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=deployer.address
    )
    app = factory.get_app_client_by_id(app_id)

    app.send.finalize(args=FinalizeArgs(pid=pid))
    print("✅ finalize called")


if __name__ == "__main__":
    main()
