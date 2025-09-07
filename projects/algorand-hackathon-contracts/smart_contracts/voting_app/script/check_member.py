# smart_contracts/voting_app/script/check_member.py
import pathlib
import sys

sys.path.append(
    str(pathlib.Path(__file__).resolve().parents[3])
)  # ensure repo root on PYTHONPATH

from algokit_utils import AlgorandClient

from smart_contracts.artifacts.voting_app.voting_app_client import (
    IsMemberArgs,
    VotingAppFactory,
)

APP_ID = int(input("App ID: ").strip())
CHECK_ADDR = input("Address to check: ").strip()

algorand = AlgorandClient.from_environment()
deployer = algorand.account.from_environment("DEPLOYER")

factory = algorand.client.get_typed_app_factory(
    VotingAppFactory, default_sender=deployer.address
)

# ✅ Correct method
app = factory.get_app_client_by_id(APP_ID)

resp = app.send.is_member(args=IsMemberArgs(acct=CHECK_ADDR))
print(f"{CHECK_ADDR} is_member? {resp.abi_return}")
