import asyncio
from datetime import datetime, timedelta
from fastapi import WebSocket
from typing import Callable, Awaitable, Optional, Any

from message import WaspRequest, WaspRequestMethod, WaspResponse

WaspConnectionOnMessageCallback = Callable[["WaspConnection", WaspRequest], Awaitable[None]]

DEFAULT_BATCH_PERIOD = timedelta(milliseconds=100)
DEFAULT_BATCH_MAX_ITEMS = 100


class WaspConnection:
    _raw_socket: WebSocket

    id: int
    on_message: WaspConnectionOnMessageCallback
    batch_period: timedelta
    batch_max_items: int
    response_buffer: list[WaspResponse]
    buffer_manager_task: Optional[asyncio.Task[None]]

    listen_requests: dict[str, WaspRequest]

    def __init__(
        self,
        websocket: WebSocket,
        id: int,
        on_message: WaspConnectionOnMessageCallback,
        batch_period: timedelta = DEFAULT_BATCH_PERIOD,
        batch_max_items: int = DEFAULT_BATCH_MAX_ITEMS,
    ) -> None:
        self._raw_socket = websocket
        self.id = id
        self.on_message = on_message
        self.response_buffer = []
        self.batch_period = batch_period
        self.batch_max_items = batch_max_items
        self.listen_requests = {}

        # Start buffer manager
        self.buffer_manager_task = asyncio.create_task(self.buffer_manager())

    async def listen(self) -> None:
        # Accept fastapi websocket
        await self._raw_socket.accept()

        # Wait for a message and call handler when one is received
        while True:
            message = await self._raw_socket.receive_text()
            request = WaspRequest.parse_raw(message)

            if request.method == WaspRequestMethod.LISTEN:
                self.listen_requests[request.uri] = request

            await self.on_message(self, request)

    # Calls underlying websocket to send text message
    async def _send(self, message: str) -> None:
        await self._raw_socket.send_text(message)

    # Serialises response object list for use by the buffer manager
    async def _send_responses(self, responses: list[WaspResponse]) -> None:
        await self._send(f"[{','.join(response.json() for response in responses)}]")

    # Adds message to response queue
    async def queue_response(self, response: WaspResponse) -> None:
        self.response_buffer.append(response)

    # Adds message to response queue if connection is listening for it
    async def queue_response_if_listening(self, response: WaspResponse) -> None:
        listen_request: Optional[WaspRequest] = None

        # Find a listen request that is equal to or a parent of the uri
        for request in self.listen_requests.values():
            if response.request.uri.startswith(request.uri):
                listen_request = request
                break

        # Queue response if request found
        if listen_request is not None:
            await self.queue_response(
                WaspResponse(
                    request=listen_request,
                    data=response.data,
                    status=response.status,
                    meta=response.meta,
                )
            )

    async def buffer_manager(self) -> None:
        while True:
            # Note start time to keep batch period consistent
            start = datetime.utcnow()
            next = start + self.batch_period

            item_count = 0
            if self.response_buffer:
                responses: list[dict[str, Any]] = []

                while self.response_buffer and item_count < self.batch_max_items:
                    batch_space = self.batch_max_items - item_count
                    response = self.response_buffer.pop(0)

                    if batch_space <= len(response.data):
                        # Send full response
                        responses.append(response)
                        item_count += len(response.data)
                    else:
                        # Split response into items to send to fill batch max items and items to
                        # send in next batch
                        response_to_send = WaspResponse(
                            request=response.request,
                            data=response.data[:batch_space],
                            status=response.status,
                            meta=response.meta,
                        )
                        response_to_defer = WaspResponse(
                            request=response.request,
                            data=response.data[batch_space:],
                            status=response.status,
                            meta=response.meta,
                        )

                        responses.append(response_to_send)
                        item_count += len(response_to_send.data)
                        self.response_buffer.insert(0, response_to_defer)

                await self._send_responses(responses)

            # Sleep until next batching period
            await asyncio.sleep((next - datetime.utcnow()).total_seconds())
