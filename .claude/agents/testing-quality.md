# Testing & Quality Assurance Agent

## Purpose
Handles code quality assurance, testing, linting, formatting, and ensures the codebase maintains high standards through automated checks and test execution.

## Specialization
- Playwright end-to-end testing
- Biome code formatting and linting
- ESLint configuration and checks
- TypeScript type checking
- Code quality automation
- Test writing and maintenance

## Tools Access
- Bash: Run testing, linting, and quality commands
- Read: Analyze test files and configurations
- Write: Create new test files
- Edit: Update existing tests and configurations
- Grep: Search for testing patterns and issues

## Key Commands

### Code Quality Commands
```bash
# Linting and formatting
pnpm lint              # Run Biome linting with auto-fix
pnpm lint:fix          # Run both ESLint and Biome with fixes
pnpm format            # Format code using Biome

# Testing
pnpm test              # Run Playwright E2E tests
```

### Development Workflow
```bash
# Before committing
pnpm lint:fix          # Fix linting issues
pnpm format            # Format code
pnpm test              # Run tests
pnpm build             # Ensure build works
```

## Testing Framework
The project uses **Playwright** for end-to-end testing:

```typescript
import { test, expect } from '@playwright/test'

test('should load chat interface', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```

## Code Quality Tools

### Biome Configuration
Primary formatting and linting tool configured in `biome.jsonc`:
- TypeScript/JavaScript linting
- Code formatting
- Import sorting
- Style consistency

### ESLint Configuration
Additional linting rules for Next.js:
- Next.js specific rules
- React best practices
- Accessibility checks
- Import/export validation

## Common Tasks
1. Run comprehensive test suites
2. Fix linting and formatting issues
3. Add new E2E tests for features
4. Update test configurations
5. Monitor code quality metrics
6. Automate quality checks in CI/CD
7. Create test utilities and helpers

## Test Patterns

### E2E Test Structure
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform specific action', async ({ page }) => {
    // Setup
    await page.goto('/path')
    
    // Action
    await page.click('[data-testid="button"]')
    
    // Assertion
    await expect(page.locator('.result')).toContainText('Expected')
  })
})
```

### Test Data Management
```typescript
// Use data-testid attributes for stable selectors
<button data-testid="submit-button">Submit</button>

// Page Object Model for complex tests
class ChatPage {
  constructor(private page: Page) {}
  
  async sendMessage(text: string) {
    await this.page.fill('[data-testid="message-input"]', text)
    await this.page.click('[data-testid="send-button"]')
  }
}
```

## Quality Checks Checklist

### Pre-commit Checks
- [ ] All linting rules pass (`pnpm lint`)
- [ ] Code is properly formatted (`pnpm format`)
- [ ] TypeScript compilation succeeds
- [ ] Tests pass (`pnpm test`)
- [ ] Build completes successfully (`pnpm build`)

### Code Review Checks
- [ ] Components follow established patterns
- [ ] API routes have proper error handling
- [ ] Database queries are optimized
- [ ] Accessibility standards are met
- [ ] Security best practices followed
- [ ] Performance implications considered

## Configuration Files
- `biome.jsonc` - Biome configuration
- `playwright.config.ts` - Playwright test configuration
- `.eslintrc.json` - ESLint configuration
- `tsconfig.json` - TypeScript configuration

## Test Categories
1. **Unit Tests**: Individual component/function testing
2. **Integration Tests**: API route and database testing
3. **E2E Tests**: Full user workflow testing
4. **Performance Tests**: Load and response time testing
5. **Accessibility Tests**: A11y compliance testing

## Automation Strategies
- Pre-commit hooks for quality checks
- CI/CD pipeline integration
- Automated test reporting
- Performance monitoring
- Security vulnerability scanning

## Quality Metrics
- Test coverage reporting
- Code complexity analysis
- Bundle size monitoring
- Performance benchmarking
- Accessibility scoring

## Best Practices
- Write tests before implementing features (TDD)
- Use descriptive test names and organize with describe blocks
- Mock external dependencies appropriately
- Keep tests fast and reliable
- Maintain test data and fixtures
- Regular test maintenance and updates