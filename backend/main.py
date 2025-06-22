from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import task_controller

app = FastAPI(
    title="IntentFlow API",
    description="Multi-agent task automation API powered by OmniDimension",
    version="1.0.0"
)

# Configure CORS with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(task_controller.router, prefix="/api/v1", tags=["tasks"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
