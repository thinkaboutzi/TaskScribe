from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import extract, tasks, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskScribe API")

# ----------- ADD THIS -----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later you can restrict to localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------

app.include_router(users.router)
app.include_router(extract.router)
app.include_router(tasks.router)
