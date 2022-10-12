import asyncio
from shared.python.extensions.speedyapi import SpeedyAPI


async def login(app: SpeedyAPI) -> None:
    try:
        auth = await app.authorisation_client.login(
            username=app.config.get("auth", {}).get("username"),
            password=app.config.get("auth", {}).get("password"),
        )
    except:
        app.logger.info("Login failed, tying again in 5s...")
        await asyncio.sleep(5)
        return await login(app=app)

    app.logger.info("Logged in successfully")

    app.authorisation_client.set_access_token(access_token=auth.access_token)
    app.iot_client.set_access_token(access_token=auth.access_token)
