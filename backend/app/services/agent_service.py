from .omnidi_client import OmniDimensionClient
from typing import Dict, Any

class AgentService:
    def __init__(self):
        self.client = OmniDimensionClient.get_instance()

    async def create_task_agent(self, instruction: str) -> Dict[str, Any]:
        # Create a new agent for the task
        agent_data = {
            "name": "IntentFlow Task Agent",
            "description": "Agent for processing natural language task instructions",
            "capabilities": [
                "intent_interpretation",
                "task_execution",
                "status_reporting"
            ],
            "conversation_flow": [
                {
                    "name": "intent_analysis",
                    "description": "Analyze and break down the task instruction",
                    "llm_prompt": f"Analyze this task: {instruction}\nBreak it down into actionable steps."
                },
                {
                    "name": "execution",
                    "description": "Execute the identified actions",
                    "actions": ["api_call", "calendar", "reminder"]
                },
                {
                    "name": "confirmation",
                    "description": "Confirm task completion and provide status",
                    "llm_prompt": "Summarize the execution results and confirm completion."
                }
            ]
        }

        # Create the agent
        agent_response = await self.client.create_agent(agent_data)
        agent_id = agent_response["agent_id"]

        # Execute the agent with the instruction
        execution_response = await self.client.execute_agent(
            agent_id,
            {
                "instruction": instruction,
                "execution_mode": "async"
            }
        )

        return {
            "task_id": execution_response["task_id"],
            "agent_id": agent_id,
            "status": "initiated"
        }

    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        # Retrieve task execution status and logs
        status = await self.client.get_task_status(task_id)
        logs = await self.client.get_task_logs(task_id)

        return {
            "task_id": task_id,
            "status": status["status"],
            "progress": status.get("progress", 0),
            "logs": logs["entries"],
            "last_update": status.get("last_update")
        }
