from fastapi import APIRouter
from . import auth, yogo

app = APIRouter()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(yogo.router, prefix="/yoga", tags=["yoga"])
