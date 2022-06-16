import json
from pathlib import Path
from typing import Any, Union


def load_json_file(path: Union[Path, str]) -> Any:
    with open(path) as file:
        return json.loads(file.read())


def flattern_dict(obj: dict[str, Any], prefix: str = "") -> dict[str, Any]:
    prefix = f"{prefix}." if prefix else ""
    flatterned: dict[str, Any] = {}

    for key, value in obj.items():
        if isinstance(value, dict):
            flatterned = {**flatterned, **flattern_dict(value, f"{prefix}{key}")}
        else:
            flatterned[f"{prefix}{key}"] = value

    return flatterned
