from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi.security import HTTPBearer
from fnmatch import fnmatch
import jwt
from utils.auth import decode_token
from models.models import User
from database.db import AsyncSessionLocal
from sqlalchemy.future import select

PUBLIC_URLS = [
    "/",                 
    "/docs",
    "/redoc", 
    "/openapi.json",
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
            return JSONResponse(
                status_code=401, 
                content={"detail": "Authorization token missing"}
            )

        token = credentials.credentials
        try:
            payload = decode_token(token)
            if payload is None:
                return JSONResponse(
                    status_code=401, 
                    content={"detail": "Invalid or expired token"}
                )
            
            email = payload.get("sub") or payload.get("email")
            if not email:
                return JSONResponse(
                    status_code=401, 
                    content={"detail": "Invalid token payload"}
                )

            async with AsyncSessionLocal() as session:
                result = await session.execute(select(User).where(User.email == email))
                user = result.scalar_one_or_none()
                if user is None:
                    return JSONResponse(
                        status_code=404, 
                        content={"detail": "User not found"}
                    )
                request.state.user_id = user.id
                request.state.user_email = user.email
                request.state.username = user.name
                request.state.user_role = user.role.value 

        except jwt.ExpiredSignatureError:
            return JSONResponse(
                status_code=401, 
                content={"detail": "Token has expired"}
            )
        except jwt.InvalidTokenError:
            return JSONResponse(
                status_code=401, 
                content={"detail": "Invalid token"}
            )
        except Exception as e:
            return JSONResponse(
                status_code=500, 
                content={"detail": f"Authentication error: {str(e)}"}
            )

        return await call_next(request)
