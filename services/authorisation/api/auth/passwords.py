from passlib.context import CryptContext


def verify_password(password: str, hashed_password: str, context: CryptContext) -> bool:
    try:
        return context.verify(secret=password, hash=hashed_password)  # type: ignore
    except Exception:
        return False


def hash_password(password: str, context: CryptContext) -> str:
    return context.hash(secret=password)  # type: ignore
