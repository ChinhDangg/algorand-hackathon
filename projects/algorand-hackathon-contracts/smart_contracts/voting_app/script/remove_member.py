import pathlib
import sys

# this file: smart_contracts/voting_app/script/check_member.py
# repo root is 3 levels up
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    RemoveMemberArgs,
    VotingAppFactory,
)

app_id = int(input("App ID: ").strip())
acct = input("Member address to remove: ").strip()

algorand = AlgorandClient.from_environment()
deployer = algorand.account.from_environment("DEPLOYER")

factory = algorand.client.get_typed_app_factory(
    VotingAppFactory, default_sender=deployer.address
)
app = factory.get_app_client_by_id(app_id)

app.send.remove_member(args=RemoveMemberArgs(acct=acct))
print(f"✅ Removed {acct} from members")
