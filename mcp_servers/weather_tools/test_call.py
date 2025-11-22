import asyncio
import os
import sys

# Ensure repo root is on PYTHONPATH when running directly
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from mcp_servers.weather_tools import server


async def main():
    print("Testing get_forecast for lat=38.8977 lon=-77.0365 (Washington, DC)...")
    # White House coordinates used as a simple test
    try:
        result = await server.get_forecast(38.8977, -77.0365)
        print("Result (truncated to 2000 chars):\n")
        print(result[:2000])
    except Exception as e:
        print("Error calling get_forecast:", e)


if __name__ == '__main__':
    asyncio.run(main())
