# Testing Infrastructure

This directory contains the testing infrastructure for the continuous translation action.

## Test Types

### Unit Tests (`unit-tests.genai.mts`)
- **Offline** - No external API dependencies
- Tests core utility functions like `isTranslatable`, `isUri`, `hasMarker`
- Tests mock implementations for caching and filesystem operations
- Tests frontmatter field definitions
- Run with: `npm run test:unit`

### Extended Tests (`extended-tests.genai.mts`)
- **Offline** - No external API dependencies  
- Tests edge cases and complex scenarios
- Tests markdown parsing patterns
- Tests cache stress scenarios
- Tests real-world content patterns
- Run with: `npm run test:extended`

### Integration Tests (`test:genai`)
- **Online** - Requires GitHub authentication
- Tests end-to-end translation functionality
- Uses actual AI models for translation
- Run with: `npm run test:genai` (requires `GITHUB_TOKEN`)

### Test Runner (`test-runner.genai.mts`)
- Checks authentication status
- Provides guidance on which tests can run
- Run with: `npm run test:runner`

## Test Utilities (`src/test-utils.mts`)
- Extracted utility functions for testing
- Mock implementations for external dependencies
- Test data generators
- Helper functions for creating test scenarios

## Running Tests

```bash
# Run basic unit tests (always works offline)
npm run test

# Run all offline tests
npm run test:all

# Run extended tests only
npm run test:extended

# Check test runner status
npm run test:runner

# Run integration tests (requires GitHub auth)
npm run test:genai
```

## Test Coverage

The tests cover:
- ✅ Text translatability detection
- ✅ URL detection and handling  
- ✅ Translation marker processing
- ✅ Cache operations
- ✅ File system operations
- ✅ Frontmatter field validation
- ✅ Markdown content generation
- ✅ Edge cases and error scenarios
- ✅ Real-world content patterns

## Authentication Setup

For integration tests, you need GitHub authentication:

```bash
# Option 1: GitHub CLI
gh auth login

# Option 2: Environment variable
export GITHUB_TOKEN="your_token_here"
```

The token needs `models: read` permission for GitHub Models access.