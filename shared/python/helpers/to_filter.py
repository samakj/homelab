from typing import List, Union

FilterTypes = Union[int, str]


def to_filter(value: FilterTypes) -> str:
    if isinstance(value, int):
        return f"{value}"
    if isinstance(value, str):
        return f"'{value}'"
    return value


def to_array_filter(value: Union[FilterTypes, List[FilterTypes]]) -> str:
    if not isinstance(value, list):
        value = [value]
    return f"ARRAY[{', '.join([to_filter(item) for item in value])}]"
