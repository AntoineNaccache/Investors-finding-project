import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';

// This file is an example orchestration script that shows how to use an
// E2B "sandbox" with remote MCPs (Exa, Notion). It also detects local
// MCP servers available in the repository and prints integration notes.

async function runGroqExaExample() {
  try {
    console.log('Preparing E2B/AI research example...');

    // --- Detect available MCP servers in the repo ---
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const repoRoot = path.resolve(__dirname);
    const possibleServers = [
      path.join(repoRoot, '..', 'custom-mcp-server', 'index.ts'),
      path.join(repoRoot, '..', 'backend', 'mcp-servers', 'custom', 'index.ts'),
      path.join(repoRoot, 'weather_tools', 'server.py'),
    ];

    const found: string[] = [];
    for (const p of possibleServers) {
      if (fs.existsSync(p)) found.push(path.relative(repoRoot, p));
    }

    if (found.length === 0) {
      console.log('No local MCP servers detected in the repository.');
    } else {
      console.log('Detected local MCP server entry files:');
      for (const f of found) console.log(`  - ${f}`);
      console.log('\nTo run these MCP servers:');
      console.log('  - For TypeScript MCPs run them with `ts-node` or compile+node.');
      console.log('  - For Python MCPs run them with your Python interpreter (e.g. `python server.py`).');
      console.log('\nOnce running, update your environment to point at the MCP transport (stdio/http) as configured.');
    }

    // --- Example: high-level sandbox creation (pseudo-code) ---
    // The original example attempted to create an E2B Sandbox and call
    // remote MCPs (Exa, Notion) through an OpenAI/Groq client. That code
    // depended on external packages and credentials. Below we provide a
    // safe, non-destructive skeleton and guidance instead of executing
    // the calls directly.

    console.log('\nExample integration steps (manual):');
    console.log('  1. Ensure EXA_API_KEY, NOTION_API_KEY (if used), GROQ_API_KEY are set.');
    console.log('  2. Start any local MCP servers detected above.');
    console.log('  3. Create the E2B sandbox with the MCPs you want to use, e.g.');
    console.log("     Sandbox.create({ mcp: { exa: { apiKey: process.env.EXA_API_KEY }, notion: { internalIntegrationToken: process.env.NOTION_API_KEY } } })");
    console.log('  4. Use your OpenAI/Groq client to send a chat completion that invokes MCP tools.');

    console.log('\nFinished preparing integration notes.');

    // Auto-start helper: spawn detected MCP servers (TypeScript and Python)
    async function startDetectedServers(opts?: { useTsNode?: boolean; pythonCmd?: string; keepAlive?: boolean; }) {
      const { useTsNode = true, pythonCmd = 'python', keepAlive = true } = opts || {};

      const serversToStart: { file: string; type: 'ts' | 'py' }[] = [];
      for (const p of possibleServers) {
        if (fs.existsSync(p)) {
          if (p.endsWith('.ts')) serversToStart.push({ file: p, type: 'ts' });
          else if (p.endsWith('.py')) serversToStart.push({ file: p, type: 'py' });
        }
      }

      if (serversToStart.length === 0) {
        console.log('No servers available to start.');
        return { procs: [] as ChildProcess[], stop: async () => {} };
      }

      console.log(`Starting ${serversToStart.length} MCP server(s)...`);

      const procs: ChildProcess[] = [];
      for (const s of serversToStart) {
        try {
          if (s.type === 'ts') {
            const cmd = 'pnpm';
            const args = ['dlx', 'ts-node', s.file];
            console.log(`Spawning: ${cmd} ${args.join(' ')}`);
            const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
            procs.push(p);
          } else if (s.type === 'py') {
            const cmd = pythonCmd;
            const args = [s.file];
            console.log(`Spawning: ${cmd} ${args.join(' ')}`);
            const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
            procs.push(p);
          }
        } catch (err) {
          console.error('Failed to spawn server for', s.file, err);
        }
      }

      async function stopAll() {
        console.log('Stopping all spawned MCP server processes...');
        for (const p of procs) {
          try {
            if (!p.killed) p.kill();
          } catch (err) {
            console.warn('Error while killing process', err);
          }
        }
      }

      if (!keepAlive) {
        // Give servers a short startup time, then stop them
        await new Promise((res) => setTimeout(res, 5000));
        await stopAll();
      } else {
        console.log('Servers started and left running. Stop with Ctrl+C or call the returned stop() function.');
      }

      return { procs, stop: stopAll };
    }

    // Auto-start when requested via environment variable
    if (process.env.AUTO_START_MCP_SERVERS === '1') {
      startDetectedServers({ useTsNode: true, pythonCmd: process.env.PYTHON_CMD || 'python', keepAlive: true }).catch((e) => {
        console.error('Error while auto-starting MCP servers:', e);
      });
    } else {
      console.log('\nTo auto-start detected MCP servers, set `AUTO_START_MCP_SERVERS=1` and re-run this script.');
    }
  } catch (err) {
    console.error('Error while preparing the MCP integration example:', err);
    process.exitCode = 1;
  }
}

// Run the helper
runGroqExaExample();
