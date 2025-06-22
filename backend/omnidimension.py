import os
from omnidimension import Client

# Initialize the OmniDimension client
api_key = os.environ.get('OMNIDIM_API_KEY', 'your_api_key_here')
client = Client(api_key)

# List all agents
agents = client.agent.list()
print(agents)

# Create an integration from a JSON configuration
integration_data = {
    "name": "My API Integration",
    "description": "Integration with external service",
    "url": "http://api.example.com/provider",
    "method": "GET",
    "headers": [
        {"key": "Authorization", "value": "Bearer token123"}
    ],
    "integration_type": "custom_api",
    "query_params": [
        {
            "key": "user_id",
            "description": "User identifier",
            "type": "string",
            "required": True,
            "isLLMGenerated": False
        }
    ]
}
response = client.integrations.create_integration_from_json(integration_data)
print(response)