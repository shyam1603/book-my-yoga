from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from middleware.middleware import JWTAuthMiddleware
from routes import index
import uvicorn

load_dotenv()
app = FastAPI(
    title="Book My Yoga API",
    description="A comprehensive yoga booking platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTAuthMiddleware)

@app.get("/")
async def root():
    return {"message": "Welcome to the Book My Yoga API!"}

@app.get("/protected")
async def protected_route(request: Request):
    """Example of a protected route that requires authentication"""
    return {
        "message": "This is a protected route",
        "user_id": request.state.user_id,
        "user_email": request.state.user_email,
        "username": request.state.username,
        "user_role": request.state.user_role
    }

app.include_router(index.app, prefix="/api", tags=["Yoga Booking"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
