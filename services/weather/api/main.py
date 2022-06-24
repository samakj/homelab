from pathlib import Path

from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.helpers.load_json_file import load_json_file

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")
