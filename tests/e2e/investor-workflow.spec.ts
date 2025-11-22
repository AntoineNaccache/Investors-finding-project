import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for Investor Finding Workflow
 * Tests the complete user journey from file upload to investor matching
 */

test.describe('Investor Finding Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Sign in (if authentication is required)
    // await page.click('[data-testid="sign-in-button"]');
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password');
    // await page.click('button[type="submit"]');
  });

  test('should upload startup documents successfully', async ({ page }) => {
    // Click on file upload button
    await page.click('[data-testid="upload-button"]');

    // Upload a test file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/sample-pitch-deck.pdf');

    // Wait for upload confirmation
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible({
      timeout: 10000,
    });

    // Verify file appears in the list
    await expect(page.locator('text=sample-pitch-deck.pdf')).toBeVisible();
  });

  test('should display matched investors after processing', async ({ page }) => {
    // Simulate file upload and processing
    await page.click('[data-testid="upload-button"]');
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/startup-data.csv');

    // Wait for processing
    await expect(page.locator('text=Processing your documents')).toBeVisible();
    await expect(page.locator('text=Processing your documents')).not.toBeVisible({
      timeout: 30000,
    });

    // Verify investors are displayed
    await expect(page.locator('[data-testid="investor-card"]')).toHaveCount(15, {
      timeout: 10000,
    });

    // Check that match scores are shown
    await expect(page.locator('[data-testid="match-score"]').first()).toBeVisible();
  });

  test('should show LinkedIn connection path', async ({ page }) => {
    // Navigate to investors page (assuming there are matched investors)
    await page.goto('http://localhost:3000/investors');

    // Click on first investor card
    await page.click('[data-testid="investor-card"]', { position: { x: 0, y: 0 } });

    // Click "Show Connection Path" button
    await page.click('text=Show Connection Path');

    // Verify network graph is displayed
    await expect(page.locator('[data-testid="network-graph"]')).toBeVisible({
      timeout: 5000,
    });

    // Verify nodes are present
    await expect(page.locator('[data-testid="graph-node"]')).toHaveCount(3, {
      timeout: 5000,
    });

    // Check connection details panel
    await expect(page.locator('[data-testid="connection-details"]')).toBeVisible();
  });

  test('should save investors to Notion', async ({ page }) => {
    // Go to matched investors
    await page.goto('http://localhost:3000/investors');

    // Select first investor
    await page.click('[data-testid="investor-card"]');

    // Click "Save to Notion" button
    await page.click('text=Save to Notion');

    // Verify success notification
    await expect(page.locator('text=Saved to Notion successfully')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should filter investors by criteria', async ({ page }) => {
    await page.goto('http://localhost:3000/investors');

    // Apply stage filter
    await page.click('[data-testid="stage-filter"]');
    await page.click('text=Series A');

    // Verify filtered results
    await expect(page.locator('[data-testid="investor-card"]')).toHaveCount(5, {
      timeout: 3000,
    });

    // Apply industry filter
    await page.click('[data-testid="industry-filter"]');
    await page.click('text=Enterprise SaaS');

    // Verify further filtered results
    await expect(page.locator('[data-testid="investor-card"]')).toHaveCount(3, {
      timeout: 3000,
    });
  });

  test('should export matched investors', async ({ page }) => {
    await page.goto('http://localhost:3000/investors');

    // Click export button
    await page.click('[data-testid="export-button"]');

    // Select export format
    await page.click('text=Export as CSV');

    // Wait for download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Download'),
    ]);

    // Verify download filename
    expect(download.suggestedFilename()).toContain('investors');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

test.describe('Chat Interface', () => {
  test('should send message with file attachment', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click attachment button
    await page.click('[data-testid="attachment-button"]');

    // Upload file
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/business-plan.pdf');

    // Type message
    await page.fill('[data-testid="chat-input"]', 'Find investors for my SaaS startup');

    // Send message
    await page.click('[data-testid="send-button"]');

    // Wait for AI response
    await expect(page.locator('[data-testid="ai-message"]').last()).toBeVisible({
      timeout: 15000,
    });
  });

  test('should use @mention for tool invocation', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Type @ in input
    await page.fill('[data-testid="chat-input"]', '@');

    // Verify autocomplete appears
    await expect(page.locator('[data-testid="mention-suggestions"]')).toBeVisible();

    // Select a tool
    await page.click('text=match_investors');

    // Send message
    await page.fill('[data-testid="chat-input"]', '@match_investors enterprise SaaS series A');
    await page.click('[data-testid="send-button"]');

    // Verify tool execution
    await expect(page.locator('[data-testid="tool-result"]')).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe('MCP Server Management', () => {
  test('should toggle MCP server on/off', async ({ page }) => {
    await page.goto('http://localhost:3000/mcp');

    // Find LinkedIn MCP server
    const linkedinServer = page.locator('[data-testid="mcp-server-linkedin"]');

    // Toggle off
    await linkedinServer.locator('[data-testid="mcp-toggle"]').click();
    await expect(linkedinServer.locator('text=Disconnected')).toBeVisible();

    // Toggle on
    await linkedinServer.locator('[data-testid="mcp-toggle"]').click();
    await expect(linkedinServer.locator('text=Connected')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should add new MCP server', async ({ page }) => {
    await page.goto('http://localhost:3000/mcp');

    // Click add server button
    await page.click('text=Add MCP Server');

    // Fill in server details
    await page.fill('[name="serverName"]', 'Test Server');
    await page.fill('[name="serverUrl"]', 'http://localhost:8080');
    await page.selectOption('[name="transport"]', 'http');

    // Submit
    await page.click('button[type="submit"]');

    // Verify server appears in list
    await expect(page.locator('text=Test Server')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should show error for invalid file type', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Try to upload unsupported file
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/video.mp4');

    // Verify error message
    await expect(page.locator('text=Unsupported file type')).toBeVisible();
  });

  test('should show error for network failure', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/chat', route => route.abort());

    await page.goto('http://localhost:3000');

    // Try to send message
    await page.fill('[data-testid="chat-input"]', 'Test message');
    await page.click('[data-testid="send-button"]');

    // Verify error message
    await expect(page.locator('text=Connection error')).toBeVisible({
      timeout: 5000,
    });
  });
});
