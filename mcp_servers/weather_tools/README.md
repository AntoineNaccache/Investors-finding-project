# Weather Tools MCP Server

A Model Context Protocol (MCP) server that provides weather data and alerts through integration with the National Weather Service API.

## Features

- **Weather Alerts**: Get active weather alerts for any US state
- **Forecast Data**: Retrieve detailed weather forecasts for any location using latitude/longitude coordinates

## Tools

### get_alerts
Get weather alerts for a US state.

**Parameters:**
- `state` (str): Two-letter US state code (e.g., CA, NY)

### get_forecast
Get weather forecast for a location.

**Parameters:**
- `latitude` (float): Latitude of the location
- `longitude` (float): Longitude of the location

## Installation

```bash
pip install -r requirements.txt
```

## Usage

Run the MCP server using STDIO transport:

```bash
python server.py
```

## Dependencies

- httpx: For making async HTTP requests to the NWS API
- mcp: Model Context Protocol server library
