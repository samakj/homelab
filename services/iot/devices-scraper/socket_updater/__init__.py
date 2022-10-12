import asyncio


from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.json import serialise_json
from routes.watch import WatchlistResponse


async def socket_updater(app: SpeedyAPI) -> None:
    while True:
        try:
            await app.websockets.broadcast_to_scope(
                "devices.watch",
                serialise_json(
                    {
                        "action": "UPDATE",
                        "resource": "devices",
                        "devices": WatchlistResponse(
                            measurements={
                                deviceId: websocket.meta
                                for deviceId, websocket in app.measurements_scraper.websockets.items()
                            },
                            logs={},
                        ),
                    }
                ),
            )
        except asyncio.CancelledError:
            break
        except Exception as error:
            app.logger.exception(error)

        await asyncio.sleep(1)
