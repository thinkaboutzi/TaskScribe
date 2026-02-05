from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, tasks, extract

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://taskscribe-mrayushbajpai.vercel.app",
        "https://taskscribe-1iszyc1yy-mrayushbajpais-projects.vercel.app/"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{path:path}")
async def options_handler(path: str, request: Request):
    return Response(status_code=200)

app.include_router(users.router, tags=["users"])
app.include_router(tasks.router, tags=["tasks"])
app.include_router(extract.router, tags=["extract"])
