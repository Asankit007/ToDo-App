import time
import jwt
from fastapi import HTTPException

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

# 1 day = 86400 seconds
EXPIRE_SECONDS = 60 * 60 * 24  


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = int(time.time()) + EXPIRE_SECONDS
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
