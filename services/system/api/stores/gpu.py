import asyncio
import subprocess
from asyncio import Task
from typing import Any, Iterable
from xml.etree import ElementTree

from models.gpu import GPU


def decode_percentage(percentage: str) -> float:
    percentage = percentage.replace(" ", "")

    if percentage.endswith("%"):
        percentage = percentage.replace("%", "")
        return float(percentage) / 100

    raise NotImplementedError(f"Couldn't decode percentage: {percentage}")


def decode_frequency(frequency: str) -> float:
    frequency = frequency.replace(" ", "")

    if frequency.endswith("KHz"):
        frequency = frequency.replace("MHz", "")
        return float(frequency) * 10**3
    if frequency.endswith("MHz"):
        frequency = frequency.replace("MHz", "")
        return float(frequency) * 10**6
    if frequency.endswith("GHz"):
        frequency = frequency.replace("GHz", "")
        return float(frequency) * 10**9
    if frequency.endswith("KHz"):
        frequency = frequency.replace("Hz", "")
        return float(frequency)

    raise NotImplementedError(f"Couldn't decode frequency: {frequency}")


def decode_power(power: str) -> float:
    power = power.replace(" ", "")

    if power.endswith("W"):
        power = power.replace("W", "")
        return float(power)

    raise NotImplementedError(f"Couldn't decode power: {power}")


def decode_temperature(temperature: str) -> float:
    temperature = temperature.replace(" ", "")

    if temperature.endswith("C"):
        temperature = temperature.replace("C", "")
        return float(temperature)

    raise NotImplementedError(f"Couldn't decode temperature: {temperature}")


def decode_data_size(size: str) -> float:
    size = size.replace(" ", "")

    if size.endswith("KiB"):
        size = size.replace("KiB", "")
        return float(size) * 2**10
    if size.endswith("MiB"):
        size = size.replace("MiB", "")
        return float(size) * 2**20
    if size.endswith("GiB"):
        size = size.replace("GiB", "")
        return float(size) * 2**30

    if size.endswith("KB"):
        size = size.replace("KB", "")
        return float(size) * 10**3
    if size.endswith("MB"):
        size = size.replace("MB", "")
        return float(size) * 10**6
    if size.endswith("GB"):
        size = size.replace("GB", "")
        return float(size) * 10**9

    raise NotImplementedError(f"Couldn't decode size: {size}")


def decode_data_rate(rate: str) -> float:
    rate = rate.replace(" ", "")
    if rate.endswith("/s"):
        rate = rate.replace("/s", "")
        return decode_data_size(rate)

    raise NotImplementedError(f"Couldn't decode rate: {rate}")


def get_gpu_nodes(element: Any) -> Iterable[Any]:
    for child in element:
        if child.tag == "gpu":
            yield child


def get_pci_link_values(element: Any) -> dict[str, Any]:
    link = {}

    for child in element:
        if child.tag == "pcie_gen":
            for _child in child:
                if _child.tag == "max_link_gen":
                    link["max_generation"] = _child.text
                if _child.tag == "current_link_gen":
                    link["generation"] = _child.text
        if child.tag == "link_widths":
            for _child in child:
                if _child.tag == "max_link_width":
                    link["max_width"] = _child.text
                if _child.tag == "current_link_width":
                    link["width"] = _child.text

    return link


def get_pci_values(element: Any) -> dict[str, Any]:
    pci = {}

    for child in element:
        if child.tag == "pci_bus":
            pci["bus"] = child.text
        if child.tag == "pci_device_id":
            pci["device_id"] = child.text
        if child.tag == "pci_gpu_link_info":
            pci["link"] = get_pci_link_values(child)
        if child.tag == "tx_util":
            pci["tx"] = decode_data_rate(child.text)
        if child.tag == "rx_util":
            pci["rx"] = decode_data_rate(child.text)

    return pci


def get_memory_values(element: Any) -> dict[str, Any]:
    memory = {}

    for child in element:
        if child.tag == "total":
            memory["total"] = decode_data_size(child.text)
        if child.tag == "reserved":
            memory["reserved"] = decode_data_size(child.text)
        if child.tag == "used":
            memory["used"] = decode_data_size(child.text)
        if child.tag == "free":
            memory["free"] = decode_data_size(child.text)

    return memory


def get_utilisation_values(element: Any) -> dict[str, Any]:
    utilisation = {}

    for child in element:
        if child.tag == "gpu_util":
            utilisation["gpu"] = decode_percentage(child.text)
        if child.tag == "memory_util":
            utilisation["memory"] = decode_percentage(child.text)
        if child.tag == "encoder_util":
            utilisation["encoder"] = decode_percentage(child.text)
        if child.tag == "decoder_util":
            utilisation["decoder"] = decode_percentage(child.text)

    return utilisation


def get_encoder_values(element: Any) -> dict[str, Any]:
    encoder = {}

    for child in element:
        if child.tag == "average_fps":
            encoder["average_fps"] = child.text
        if child.tag == "average_latency":
            encoder["average_latency"] = child.text

    return encoder


def get_temperature_values(element: Any) -> dict[str, Any]:
    temperature = {
        "thresholds": {},
        "memory": {},
    }

    for child in element:
        if child.tag == "gpu_temp":
            temperature["temperature"] = decode_temperature(child.text)
        if child.tag == "gpu_temp_max_threshold":
            temperature["thresholds"]["max"] = decode_temperature(child.text)
        if child.tag == "gpu_temp_slow_threshold":
            temperature["thresholds"]["slow"] = decode_temperature(child.text)
        if child.tag == "gpu_temp_gpu_threshold":
            temperature["thresholds"]["gpu"] = decode_temperature(child.text)
        if child.tag == "gpu_target_temperature":
            temperature["temperature_target"] = (
                decode_temperature(child.text) if child.text != "N/A" else None
            )
        if child.tag == "memory_temp":
            temperature["memory"]["temperature"] = (
                decode_temperature(child.text) if child.text != "N/A" else None
            )
        if child.tag == "gpu_temp_max_mem_threshold":
            temperature["memory"]["temperature_target"] = (
                decode_temperature(child.text) if child.text != "N/A" else None
            )

    return temperature


def get_power_values(element: Any) -> dict[str, Any]:
    power = {"limits": {}}

    for child in element:
        if child.tag == "power_state":
            power["power_state"] = child.text
        if child.tag == "power_draw":
            power["power"] = decode_power(child.text)
        if child.tag == "power_limit":
            power["limits"]["current"] = child.text if child.text != "N/A" else None
        if child.tag == "default_power_limit":
            power["limits"]["default"] = child.text if child.text != "N/A" else None
        if child.tag == "min_power_limit":
            power["limits"]["min"] = child.text if child.text != "N/A" else None
        if child.tag == "max_power_limit":
            power["limits"]["max"] = child.text if child.text != "N/A" else None

    return power


def get_voltage_values(element: Any) -> dict[str, Any]:
    voltage = {}

    for child in element:
        if child.tag == "graphics_volt":
            voltage["gpu"] = child.text if child.text != "N/A" else None

    return voltage


def get_clock_values(element: Any) -> dict[str, Any]:
    clock = {}

    for child in element:
        if child.tag == "graphics_clock":
            clock["gpu"] = decode_frequency(child.text)
        if child.tag == "sm_clock":
            clock["sm"] = decode_frequency(child.text)
        if child.tag == "memory_clock":
            clock["memory"] = decode_frequency(child.text)
        if child.tag == "video_clock":
            clock["video"] = decode_frequency(child.text)

    return clock


class GPUStore:
    gpus: list[GPU]
    task: Task[Any]

    def __init__(self) -> None:
        self.gpus = self._get_gpus()

    def _get_gpus(self) -> list[GPU]:
        raw = ElementTree.fromstring(subprocess.check_output(["nvidia-smi", "-x", "-q"]))
        gpus = []

        for raw_gpu in get_gpu_nodes(raw):
            gpu = {}
            for child in raw_gpu:

                if child.tag == "product_name":
                    gpu["name"] = child.text
                if child.tag == "product_brand":
                    gpu["product_line"] = child.text
                if child.tag == "product_architecture":
                    gpu["architecture"] = child.text
                if child.tag == "uuid":
                    gpu["uuid"] = child.text
                if child.tag == "pci":
                    gpu["pci"] = get_pci_values(child)
                if child.tag == "fan_speed":
                    gpu["fan_speed"] = None if child.text == "N/A" else child.text
                if child.tag == "performance_state":
                    gpu["performance_state"] = child.text
                if child.tag == "compute_mode":
                    gpu["compute_mode"] = None if child.text == "N/A" else child.text
                if child.tag == "fb_memory_usage":
                    gpu["memory"] = {**gpu.get("memory", {}), **get_memory_values(child)}
                if child.tag == "utilization":
                    util = get_utilisation_values(child)
                    gpu["utilisation"] = util["gpu"]
                    gpu["memory"] = {**gpu.get("memory", {}), "utilisation": util["memory"]}
                    gpu["encoder"] = {**gpu.get("encoder", {}), "utilisation": util["encoder"]}
                    gpu["decoder"] = {**gpu.get("decoder", {}), "utilisation": util["decoder"]}
                if child.tag == "encoder":
                    gpu["encoder"] = {**gpu.get("encoder", {}), **get_encoder_values(child)}
                if child.tag == "temperature":
                    temperatures = get_temperature_values(child)
                    gpu["temperature"] = temperatures["temperature"]
                    gpu["temperature_thresholds"] = {
                        **gpu.get("temperature_thresholds", {}),
                        **temperatures["thresholds"],
                    }
                    gpu["memory"] = {**gpu.get("memory", {}), **temperatures["memory"]}
                if child.tag == "power_readings":
                    power = get_power_values(child)
                    gpu["power"] = power["power"]
                    gpu["power_state"] = power["power_state"]
                    gpu["power_limits"] = power["limits"]
                if child.tag == "voltage":
                    gpu["voltage"] = get_voltage_values(child)["gpu"]
                if child.tag == "clocks":
                    gpu["clocks"] = get_clock_values(child)

            gpus.append(GPU.parse_obj(gpu))

        return gpus

    def get_gpus(self) -> list[GPU]:
        return self.gpus

    async def gpu_poller(self) -> None:
        while True:
            self.gpus = self._get_gpus()

            await asyncio.sleep(1)

    async def initialise(self) -> None:
        self.task = asyncio.create_task(self.gpu_poller())
