from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, tasks, extract

app = FastAPI()

# 🔥 CORS MUST COME FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://taskscribe.vercel.app",  # your Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# THEN include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(extract.router, prefix="/extract", tags=["extract"])
