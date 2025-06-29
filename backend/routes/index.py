from fastapi import APIRouter
from . import auth, yogo, user, teacher, class_types

app = APIRouter()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(yogo.router, prefix="/yoga", tags=["yoga"])
app.include_router(teacher.router, prefix="/teacher", tags=["Teacher Dashboard"])
app.include_router(class_types.router, prefix="/class-types", tags=["Class Types"])

app.include_router(user.router, prefix="/user", tags=["User Profile"])

