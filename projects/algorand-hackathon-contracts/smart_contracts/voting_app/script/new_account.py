import pathlib
import sys

# this file: smart_contracts/voting_app/script/check_member.py
# repo root is 3 levels up
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))

# scripts/workflow.py

from algokit_utils import AlgorandClient

algorand = AlgorandClient.from_environment()
member = algorand.account.from_environment("MEMBER")

print(member.address)
