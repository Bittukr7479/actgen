from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..services.agent_service import AgentService

router = APIRouter()
agent_service = AgentService()

class TaskRequest(BaseModel):
    instruction: str

class TaskResponse(BaseModel):
    task_id: str
    status: str
    agent_id: str

@router.post("/task", response_model=TaskResponse)
async def create_task(req: TaskRequest) -> Dict[str, Any]:
    try:
        result = await agent_service.create_task_agent(req.instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/task/{task_id}")
async def get_task_status(task_id: str) -> Dict[str, Any]:
    try:
        return await agent_service.get_task_status(task_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Task not found: {str(e)}")
