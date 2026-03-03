import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine
from app import models
from app.routers import dashboard, inventory

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SwasthiQ Pharmacy API")

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(inventory.router)

@app.get("/")
def root():
    return {"message": "SwasthiQ Pharmacy API is running"}
