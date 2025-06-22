import os
import aiohttp
import asyncio
from typing import Optional, Dict, Any
import json
import asyncio

class OmniDimensionClient:
    _instance: Optional['OmniDimensionClient'] = None
    _api_key: Optional[str] = None
    _base_url: str = "https://api.omnidimension.ai/v1"
    _dev_mode: bool = False

    def __init__(self):
        if OmniDimensionClient._instance is not None:
            raise Exception("Use get_instance() instead")
        
        api_key = os.environ.get('OMNIDIM_API_KEY')
        if not api_key:
            print("Warning: OMNIDIM_API_KEY not set, using development mode")
            self._dev_mode = True
            self._api_key = "dev_mode"
        else:
            self._api_key = api_key
            
        OmniDimensionClient._instance = self

    @classmethod
    def get_instance(cls) -> 'OmniDimensionClient':
        if cls._instance is None:
            cls._instance = OmniDimensionClient()
        return cls._instance

    async def _make_request(self, method: str, endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        if self._dev_mode:
            # Simulate API responses in development mode
            await asyncio.sleep(1)  # Simulate network delay
            if endpoint.startswith('/agents'):
                return {
                    "agent_id": "dev_agent_123",
                    "task_id": "dev_task_456",
                    "status": "initiated"
                }
            elif endpoint.startswith('/tasks'):
                return {
                    "task_id": endpoint.split('/')[-1],
                    "status": "in_progress",
                    "progress": 50,
                    "logs": {
                        "entries": [
                            {
                                "timestamp": "2025-06-23T10:00:00Z",
                                "message": "Processing natural language instruction",
                                "level": "info"
                            }
                        ]
                    },
                    "last_update": "2025-06-23T10:00:00Z"
                }
            return {"status": "success"}

        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json"
        }
        url = f"{self._base_url}/{endpoint.lstrip('/')}"
        
        async with aiohttp.ClientSession() as session:
            async with session.request(method, url, headers=headers, json=data) as response:
                response.raise_for_status()
                return await response.json()

    async def create_agent(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return await self._make_request("POST", "/agents", data)

    async def execute_agent(self, agent_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return await self._make_request("POST", f"/agents/{agent_id}/execute", data)

    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        return await self._make_request("GET", f"/tasks/{task_id}")

    async def get_task_logs(self, task_id: str) -> Dict[str, Any]:
        return await self._make_request("GET", f"/tasks/{task_id}/logs")
