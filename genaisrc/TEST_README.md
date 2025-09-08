# Unit Tests for Continuous Translation Action

This directory contains comprehensive unit tests for the core functionality of the continuous translation action. These tests are designed to run quickly without external dependencies like API keys or network access.

## Test Suites

### 1. Utility Functions (`translator-utils.test.genai.mts`)
Tests core utility functions used throughout the translator:
- `isTranslatable()` - Text validation logic
- `hasMarker()` - Translation marker detection  
- `isUri()` - URL detection
- Template processing for file names

### 2. Language Model Configuration (`translator-models.test.genai.mts`)
Tests language and model configuration logic:
- Language code validation
- Model configuration resolution
- Error handling for invalid languages
- Language pattern recognition in file paths

### 3. Frontmatter Processing (`translator-frontmatter.test.genai.mts`)
Tests frontmatter parsing and schema validation:
- YAML frontmatter parsing
- Schema validation for translator configurations
- Frontmatter extraction from markdown
- Translatable field identification

### 4. Markdown Processing (`translator-markdown.test.genai.mts`)
Tests markdown AST manipulation and processing:
- Translation marker insertion/removal
- Hash generation for caching
- Starlight path patching for localized content
- Content chunking for translation

## Running Tests

### Run all unit tests:
```bash
npm run test:unit
```

### Run with summary report:
```bash
npm run test:unit:summary
```

### Run individual test suites:
```bash
npx genaiscript run translator-utils.test --no-run-trace
npx genaiscript run translator-models.test --no-run-trace
npx genaiscript run translator-frontmatter.test --no-run-trace
npx genaiscript run translator-markdown.test --no-run-trace
```

## Test Coverage

The unit tests provide comprehensive coverage of:
- ✅ 84 total test cases
- ✅ Core utility functions and text processing
- ✅ Language configuration and validation  
- ✅ Frontmatter parsing and schema validation
- ✅ Markdown AST manipulation
- ✅ Path handling for Starlight integration
- ✅ Error handling and edge cases

## Benefits

- **Fast Execution**: Tests run in seconds without API calls
- **Reliable**: No dependency on external services or authentication  
- **CI/CD Ready**: Can run in any environment without setup
- **Debugging Friendly**: Focused tests make it easy to identify issues
- **Maintainable**: Easy to extend as the codebase evolves

## Integration with Existing Tests

These unit tests complement the existing integration tests:
- **Unit tests**: Fast, isolated testing of individual functions
- **Integration tests**: End-to-end testing with real API calls (requires authentication)

Both types of tests are valuable and serve different purposes in ensuring code quality.