from pathlib import Path

from passlib.context import CryptContext

from shared.python.extensions.speedyapi import SpeedyAPI
from shared.python.helpers.load_json_file import load_json_file

app = SpeedyAPI()
app.config = load_json_file(Path(__file__).parent / "config.json")
app.password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
