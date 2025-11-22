MCP Servers orchestrator
=======================

This folder contains helper scripts to detect and run local MCP (Model Context Protocol) servers included in the repo.

Usage
-----

- Start the orchestrator (it will start detected MCP servers, wait briefly, print status, then stop):

```powershell
pnpm mcp:orchestrator
```

- To auto-start servers from `index_super_important.ts`, set the environment variable `AUTO_START_MCP_SERVERS=1` and run that script.

Notes
-----
- TypeScript MCPs are run via `pnpm dlx ts-node <file>` to avoid requiring global installs.
- Python MCPs are run via `python <file>` (customizable via `PYTHON_CMD`).
- The orchestrator streams child processes' stdout/stderr into the current terminal.
