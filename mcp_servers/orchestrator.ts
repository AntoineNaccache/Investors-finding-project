import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';

// Simple orchestrator to start detected MCP servers, verify they're running,
// and stop them on demand. Run with `pnpm mcp:orchestrator` (script added
// to package.json) or `tsx ./mcp_servers/orchestrator.ts`.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const possibleServers = [
  path.join(repoRoot, '..', 'custom-mcp-server', 'index.ts'),
  path.join(repoRoot, '..', 'backend', 'mcp-servers', 'custom', 'index.ts'),
  path.join(repoRoot, 'weather_tools', 'server.py'),
];

type ServerToStart = { file: string; type: 'ts' | 'py' };

function discoverServers(): ServerToStart[] {
  const list: ServerToStart[] = [];
  for (const p of possibleServers) {
    if (fs.existsSync(p)) {
      if (p.endsWith('.ts')) list.push({ file: p, type: 'ts' });
      else if (p.endsWith('.py')) list.push({ file: p, type: 'py' });
    }
  }
  return list;
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function startDetectedServers(opts?: { pythonCmd?: string }) {
  const pythonCmd = opts?.pythonCmd || process.env.PYTHON_CMD || 'python';
  const servers = discoverServers();

  if (servers.length === 0) {
    console.log('No MCP servers detected to start.');
    return { procs: [] as ChildProcess[], stop: async () => {} };
  }

  console.log(`Found ${servers.length} MCP server(s) to start:`);
  for (const s of servers) console.log('  -', path.relative(repoRoot, s.file));

  const procs: ChildProcess[] = [];

  for (const s of servers) {
    try {
      if (s.type === 'ts') {
        // Use pnpm dlx ts-node to ensure ts-node is available without global install
        const cmd = 'pnpm';
        const args = ['dlx', 'ts-node', s.file];
        console.log(`Starting TypeScript MCP: ${cmd} ${args.join(' ')}`);
        const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
        procs.push(p);
      } else if (s.type === 'py') {
        const cmd = pythonCmd;
        const args = [s.file];
        console.log(`Starting Python MCP: ${cmd} ${args.join(' ')}`);
        const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
        procs.push(p);
      }
    } catch (err) {
      console.error('Failed to spawn', s.file, err);
    }
  }

  // Wait a short time for processes to initialize
  await sleep(3000);

  console.log('\nProcess status:');
  for (const p of procs) {
    const alive = p.exitCode === null && !p.killed && !!p.pid;
    console.log(`  - pid=${p.pid} alive=${alive}`);
  }

  async function stopAll() {
    console.log('\nStopping all spawned MCP server processes...');
    for (const p of procs) {
      try {
        if (!p.killed) p.kill();
      } catch (err) {
        console.warn('Error while killing process', err);
      }
    }
  }

  // Handle Ctrl+C
  const onSig = async () => {
    await stopAll();
    process.exit(0);
  };
  process.on('SIGINT', onSig);
  process.on('SIGTERM', onSig);

  return { procs, stop: stopAll };
}

// If run directly, start, wait 10s, then stop automatically.
if (import.meta.url.endsWith(path.basename(process.argv[1]) || '')) {
  (async () => {
    const orchestrator = await startDetectedServers({});
    if (orchestrator.procs.length === 0) return;
    console.log('\nLetting servers run for 10 seconds...');
    await sleep(10000);
    await orchestrator.stop();
    console.log('Orchestrator finished.');
  })().catch((e) => {
    console.error('Orchestrator error:', e);
    process.exit(1);
  });
}
