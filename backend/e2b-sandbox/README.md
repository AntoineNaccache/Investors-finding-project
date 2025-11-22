# E2B Secure Sandbox

E2B (Execute2BeBorn) provides secure, isolated execution environments for handling sensitive investor and founder data.

## Purpose

The E2B sandbox ensures:
- **Data Privacy**: Isolated execution for sensitive operations
- **Security**: Protected investor database access
- **Compliance**: GDPR-compliant data handling
- **Sandboxing**: Isolated file processing and analysis

## Directory Structure

```
e2b-sandbox/
├── investor-db/       # Investor database handlers
├── founder-data/      # Founder data processors
└── README.md          # This file
```

## Use Cases

### 1. Investor Database Operations
- Secure queries to investor database
- Protected investor profile access
- Investment criteria matching
- Portfolio company analysis

### 2. Founder Data Processing
- Confidential startup document parsing
- Financial data extraction
- Business plan analysis
- Team information processing

### 3. File Processing
- PDF parsing (pitch decks, business plans)
- Excel processing (financials, projections)
- PowerPoint analysis (presentations)
- Text extraction and analysis

## Configuration

### Environment Variables

```bash
E2B_API_KEY=your_e2b_api_key_here
```

### API Key Setup

1. Get your E2B API key from https://e2b.dev
2. Add to `.env` file:
   ```
   E2B_API_KEY=e2b_xxxxxxxxxxxxxxxxxxxxx
   ```

## Integration

### With MCP Servers

E2B is accessible through MCP protocol:

```typescript
// Example MCP tool using E2B
{
  name: "process_investor_data",
  description: "Securely process investor database queries",
  handler: async (params) => {
    const sandbox = await e2b.create();
    const result = await sandbox.execute(query);
    return result;
  }
}
```

### With Frontend

Frontend uploads files → MCP Server → E2B Sandbox → Processing → Results

## Development

### Running E2B Sandbox Locally

```bash
# Install E2B SDK
npm install @e2b/sdk

# Test connection
npx e2b sandbox create
```

### Example: Process Investor Data

```typescript
import { Sandbox } from '@e2b/sdk';

async function processInvestorData(query: string) {
  const sandbox = await Sandbox.create();

  // Execute secure query
  const result = await sandbox.runCode(`
    import pandas as pd
    investors = pd.read_csv('investors.csv')
    result = investors.query('${query}')
    print(result.to_json())
  `);

  await sandbox.close();
  return result.stdout;
}
```

## Security Best Practices

1. **Never expose API keys** in frontend code
2. **Always use E2B** for sensitive operations
3. **Validate inputs** before sandbox execution
4. **Limit sandbox lifetime** to prevent resource leaks
5. **Log access** for audit trails

## Monitoring

- Sandbox creation count
- Execution time metrics
- Resource usage
- Error rates
- Security events

## Troubleshooting

### Common Issues

**Sandbox creation fails**
- Check E2B_API_KEY is set correctly
- Verify API key is active
- Check network connectivity

**Timeout errors**
- Increase timeout limits in MCP config
- Optimize processing code
- Consider chunking large operations

**Resource limits**
- Monitor sandbox resource usage
- Clean up sandboxes after use
- Use sandbox pooling for efficiency

## Resources

- [E2B Documentation](https://e2b.dev/docs)
- [E2B SDK Reference](https://github.com/e2b-dev/e2b)
- [Security Best Practices](https://e2b.dev/docs/security)
