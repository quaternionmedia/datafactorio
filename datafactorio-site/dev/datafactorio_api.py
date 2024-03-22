from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graphbase.src.main import graphdb

# Run the FastAPI app
app = FastAPI()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:1234",  # datafactorio-site
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include the graphdb router in the FastAPI app
app.include_router(graphdb)
