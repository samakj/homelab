import asyncio
from asyncio import Task
from typing import Any, Optional
from psutil import net_io_counters, net_if_addrs, net_if_stats
from psutil._common import snicaddr
from socket import AddressFamily


from models.network import (
    Network,
    NetworkRates,
    NetworkBytes,
    NetworkPackets,
    NetworkErrors,
    NetworkDrops,
)


class NetworkStore:
    networks: dict[str, Network]
    task: Task[Any]

    def __init__(self) -> None:
        self.networks = None  # type: ignore
        self.networks = self._get_networks()

    def _get_networks(self) -> dict[str, Network]:
        counters = net_io_counters(pernic=True)
        addrs = net_if_addrs()
        stats = net_if_stats()
        networks: dict[str, Network] = {}

        for name in {*counters.keys(), *addrs.keys(), *stats.keys()}:
            previous: Optional[Network] = (
                self.networks.get(name) if self.networks is not None else None
            )
            counter = counters.get(name)
            addr: Optional[snicaddr] = None

            for _addr in addrs.get(name, []):
                if _addr.family == AddressFamily.AF_INET:
                    addr = _addr

            stat = stats.get(name)

            networks[name] = Network(
                name=name,
                bytes=NetworkBytes(sent=counter.bytes_sent, recieved=counter.bytes_recv)
                if counter is not None
                else None,
                rates=NetworkRates(
                    sent=counter.bytes_sent - previous.bytes.sent,
                    recieved=counter.bytes_recv - previous.bytes.recieved,
                )
                if previous is not None and counter is not None
                else None,
                packets=NetworkPackets(
                    sent=counter.packets_sent,
                    recieved=counter.packets_recv if counter is not None else None,
                ),
                errors=NetworkErrors(inbound=counter.errin, outbound=counter.errout)
                if counter is not None
                else None,
                drops=NetworkDrops(inbound=counter.dropin, outbound=counter.dropout)
                if counter is not None
                else None,
                ip=addr.address if addr is not None else None,
                speed=stat.speed * 10**6 if stat is not None else None,
                max_speed=stat.mtu * 10**6 if stat is not None else None,
            )

        return networks

    def get_networks(self) -> list[Network]:
        return list(self.networks.values())

    async def network_poller(self) -> None:
        while True:
            self.networks = self._get_networks()

            await asyncio.sleep(1)

    async def initialise(self) -> None:
        self.task = asyncio.create_task(self.network_poller())
