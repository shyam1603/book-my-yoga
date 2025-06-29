from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi.security import HTTPBearer
from fnmatch import fnmatch
from jose import JWTError
from utils.auth import decode_token
from models.models import User
from database.db import DB 
from sqlalchemy.future import select

PUBLIC_URLS = [
    "/",                 
    "/api/auth/**",          
]

auth_scheme = HTTPBearer(auto_error=False)

def is_public_path(path: str) -> bool:
    return any(fnmatch(path, pattern) for pattern in PUBLIC_URLS)

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        if is_public_path(path):
            return await call_next(request)

        credentials = await auth_scheme(request)
        if credentials is None:
            return JSONResponse(status_code=401, content={"detail": "Authorization token missing"})

        token = credentials.credentials
        try:
            payload = decode_token(token)
            email = payload.get("sub")
            if not email:
                return JSONResponse(status_code=401, content={"detail": "Invalid token payload"})

            async with DB() as session:
                result = await session.execute(select(User).where(User.email == email))
                user = result.scalar_one_or_none()
                if user is None:
                    return JSONResponse(status_code=404, content={"detail": "User not found"})

                request.state.user = user
        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})

        return await call_next(request)