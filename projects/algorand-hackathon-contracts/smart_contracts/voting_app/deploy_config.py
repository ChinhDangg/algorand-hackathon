# smart_contracts/voting_app/deploy_config.py
import logging

import algokit_utils

logger = logging.getLogger(__name__)


def deploy() -> None:
    from smart_contracts.artifacts.voting_app.voting_app_client import (
        AddMemberArgs,
        CreateArgs,
        VotingAppFactory,
        VotingAppMethodCallCreateParams,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")

    logger.info(f"Deploying VotingApp as {deployer.address}")

    factory = algorand.client.get_typed_app_factory(
        VotingAppFactory, default_sender=deployer.address
    )

    # Build the *typed* create params (this is what deploy() wants)
    create_params = VotingAppMethodCallCreateParams(
        args=CreateArgs(admin=deployer.address)
        # on_complete defaults to NoOp; that’s correct for ABI create
        # you can also pass schema fields here if needed via the base class
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
        create_params=create_params,
    )

    if result.operation_performed in (
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ):
        # Optional but useful: fund app account for box/storage minimums
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer.address,
                receiver=app_client.app_address,
            )
        )
        app_client.send.add_member(args=AddMemberArgs(acct=deployer.address))
        logger.info("Admin enrolled as first member")

    logger.info(
        f"VotingApp deployed: app_id={app_client.app_id}  address={app_client.app_address}"
    )
