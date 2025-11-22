# Testing Guide

Comprehensive testing documentation for the Investors Finding Project.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)

## Testing Stack

### Unit & Integration Testing
- **Framework**: [Vitest](https://vitest.dev/)
- **Features**: Fast, Vite-powered, compatible with Jest API
- **Location**: `tests/unit/`

### End-to-End Testing
- **Framework**: [Playwright](https://playwright.dev/)
- **Features**: Cross-browser testing, auto-waiting, screenshots
- **Location**: `tests/e2e/`

### Additional Tools
- **TypeScript**: Type-safe tests
- **Testing Library**: DOM testing utilities (if needed)
- **MSW**: API mocking (Mock Service Worker)

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test deepflow-matching.test.ts
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
pnpm playwright:install

# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e investor-workflow.spec.ts

# Run in specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### All Tests

```bash
# Run linting, type checking, and all tests
pnpm check
```

## Unit Tests

### Structure

```
tests/unit/
├── deepflow-matching.test.ts    # Investor matching algorithm
├── file-processing.test.ts       # Document parsing
├── mcp-integration.test.ts       # MCP server tests
└── utils.test.ts                 # Utility functions
```

### Example Unit Test

```typescript
import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '@/lib/deepflow/matching';

describe('Investor Matching', () => {
  it('should calculate correct match score', () => {
    const startup = {
      industry: 'SaaS',
      stage: 'Series A',
      seeking: 5000000,
    };

    const investor = {
      focus: ['SaaS', 'Enterprise'],
      stage: ['Series A'],
      range: [3000000, 10000000],
    };

    const score = calculateMatchScore(startup, investor);

    expect(score).toBeGreaterThan(80);
  });
});
```

## E2E Tests

### Structure

```
tests/e2e/
├── investor-workflow.spec.ts    # Complete investor finding flow
├── chat-interface.spec.ts       # Chatbot interactions
├── mcp-management.spec.ts       # MCP server UI
└── auth.spec.ts                 # Authentication flows
```

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('should upload and process startup documents', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Upload file
  await page.locator('input[type="file"]')
    .setInputFiles('tests/fixtures/pitch-deck.pdf');

  // Wait for processing
  await expect(page.locator('text=Processing complete')).toBeVisible({
    timeout: 10000,
  });

  // Verify results
  await expect(page.locator('[data-testid="investor-card"]'))
    .toHaveCount(15);
});
```

## Writing Tests

### Best Practices

#### 1. Follow AAA Pattern
```typescript
it('should match investors correctly', () => {
  // Arrange
  const startup = { industry: 'FinTech' };
  const investor = { focus: ['FinTech'] };

  // Act
  const score = calculateMatch(startup, investor);

  // Assert
  expect(score).toBeGreaterThan(50);
});
```

#### 2. Use Descriptive Test Names
```typescript
// ✅ Good
it('should return 0 for completely unrelated industries', () => {});

// ❌ Bad
it('test 1', () => {});
```

#### 3. Test Edge Cases
```typescript
describe('File Upload', () => {
  it('should handle empty files');
  it('should handle corrupted files');
  it('should handle files over size limit');
  it('should handle unsupported file types');
});
```

#### 4. Use Test Fixtures
```typescript
import sampleData from '../fixtures/startup-data.json';

it('should process sample data', () => {
  const result = processData(sampleData);
  expect(result).toBeDefined();
});
```

### Testing Investor Finding Features

#### Deepflow Matching Tests
```typescript
describe('Deepflow Matching Engine', () => {
  it('should match by industry');
  it('should match by funding stage');
  it('should match by investment range');
  it('should match by location');
  it('should calculate weighted score');
  it('should filter out poor matches');
});
```

#### File Processing Tests
```typescript
describe('File Processing', () => {
  it('should extract text from PDF');
  it('should parse Excel financials');
  it('should extract PowerPoint content');
  it('should handle CSV data');
  it('should validate file types');
  it('should enforce size limits');
});
```

#### LinkedIn Network Tests
```typescript
describe('LinkedIn Network Analysis', () => {
  it('should find connection paths');
  it('should identify mutual connections');
  it('should calculate shortest path');
  it('should handle disconnected networks');
});
```

### E2E Test Scenarios

#### Complete Workflow Test
```typescript
test('Complete investor finding workflow', async ({ page }) => {
  // 1. Upload documents
  // 2. Wait for processing
  // 3. View matched investors
  // 4. Check connection paths
  // 5. Save to Notion
  // 6. Verify saved data
});
```

#### Error Scenarios
```typescript
test.describe('Error Handling', () => {
  test('should handle invalid file types');
  test('should handle network errors');
  test('should handle API failures');
  test('should show user-friendly error messages');
});
```

## Test Coverage

### Generate Coverage Report

```bash
pnpm test --coverage
```

### Coverage Targets
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### View Coverage Report
```bash
# Open HTML report
open coverage/index.html
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run linting
        run: pnpm lint

      - name: Run type checking
        run: pnpm check-types

      - name: Run unit tests
        run: pnpm test

      - name: Install Playwright
        run: pnpm playwright:install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Unit Tests
```bash
# Run in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs

# Use VS Code debugger
# Add breakpoints and press F5
```

### E2E Tests
```bash
# Run with headed browser
pnpm test:e2e --headed

# Run in debug mode
pnpm test:e2e --debug

# Pause on failure
pnpm test:e2e --pause-on-failure
```

### VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Vitest",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Playwright",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": ["test"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Test Data Management

### Creating Test Fixtures

```bash
# Create fixture files in tests/fixtures/
tests/fixtures/
├── sample-pitch-deck.pdf
├── startup-data.csv
├── business-plan.pdf
└── financials.xlsx
```

### Using Fixtures in Tests

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const fixture = readFileSync(
  join(__dirname, '../fixtures/startup-data.csv'),
  'utf-8'
);
```

## Mocking

### API Mocking

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.post('/api/match-investors', () => {
    return HttpResponse.json([
      { name: 'Investor 1', score: 95 },
      { name: 'Investor 2', score: 87 },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### MCP Server Mocking

```typescript
const mockMcpClient = {
  connect: vi.fn(),
  listTools: vi.fn(() => ['match_investors', 'find_connections']),
  callTool: vi.fn((name, params) => ({ success: true })),
};
```

## Continuous Testing

### Watch Mode

```bash
# Unit tests in watch mode
pnpm test:watch

# E2E tests in UI mode
pnpm test:e2e:ui
```

### Pre-commit Hooks

Tests run automatically before commits via Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm lint:fix && pnpm test"
    }
  }
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Troubleshooting

### Common Issues

**Tests timing out**
```bash
# Increase timeout
test('slow test', async () => {}, { timeout: 30000 });
```

**Flaky E2E tests**
```typescript
// Add explicit waits
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

**Coverage not accurate**
```bash
# Clear cache and re-run
pnpm test --coverage --no-cache
```

## Next Steps

1. Add more unit tests for backend services
2. Expand E2E test coverage
3. Set up visual regression testing
4. Implement performance testing
5. Add contract testing for APIs
