# scripts/view_status.py
import pathlib
import sys

sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    GetProposalDetailsArgs,  # <-- import the Args type
    VotingAppFactory,
)


def main():
    app_id = int(input("App ID: ").strip())
    pid = int(input("Proposal ID: ").strip())

    algorand = AlgorandClient.from_environment()
    dep = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=dep.address
    )
    app = factory.get_app_client_by_id(app_id)

    # readonly ABI method -> still under `.send` in this client version
    resp = app.send.get_proposal_details(args=GetProposalDetailsArgs(pid=pid))
    desc, yes, no, status = resp.abi_return
    print(f"Proposal: {desc}, YES={yes}, NO={no}, status={status}")

    current = algorand.client.algod.status().get("last-round")
    print(f"current_round={current}")


if __name__ == "__main__":
    main()
