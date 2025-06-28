from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from utils.auth import decode_token
from models.models import User
from database.db import AsyncSessionLocal
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.public_paths = ["/", "/docs", "/openapi.json", "/auth/"]

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if any(path == pub or path.startswith(pub) for pub in self.public_paths):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authorization header missing or invalid"}
            )

        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        if not payload:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token"}
            )

        user_id = payload.get("user_id")
        if not user_id:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid token payload"}
            )

        async with AsyncSessionLocal() as db:
            try:
                result = await db.execute(
                    User.__table__.select().where(User.id == user_id)
                )
                user_row = result.first()
                if not user_row:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "User not found"}
                    )

                user = user_row[0] if isinstance(user_row, tuple) else user_row

                request.state.user_id = user.id
                request.state.user_email = user.email
                request.state.username = user.username
                request.state.user = user

            except Exception as e:
                logger.error(f"Database error in auth middleware: {e}")
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content={"detail": "Internal server error"}
                )

        response = await call_next(request)
        return response