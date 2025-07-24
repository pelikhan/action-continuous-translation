# Go Comment Generator

A GenAIScript for automatically generating comprehensive documentation comments for Go code following Go conventions and best practices.

## Features

- 🔍 **Smart Analysis** - Automatically detects Go constructs (functions, types, structs, interfaces)
- 📝 **Godoc Compliant** - Generates comments following Go documentation standards
- 🎯 **Selective Generation** - Configure which types of constructs to document
- 👀 **Dry Run Mode** - Preview changes before applying them
- ⚡ **Batch Processing** - Process multiple Go files at once
- 🔄 **Respect Existing** - Option to preserve existing comments or overwrite them

## Usage

### Basic Usage

```bash
# Generate comments for all Go files in current directory
npx genaiscript run go-comments *.go

# Generate comments for a specific file
npx genaiscript run go-comments main.go

# Preview changes without modifying files (dry run)
npx genaiscript run go-comments main.go --vars dryRun=true
```

### Advanced Configuration

```bash
# Generate detailed comments with examples
npx genaiscript run go-comments *.go --vars includeExamples=true

# Only document functions, skip types
npx genaiscript run go-comments *.go --vars includeTypes=false

# Overwrite existing comments
npx genaiscript run go-comments *.go --vars overwriteExisting=true

# Use minimal comment style
npx genaiscript run go-comments *.go --vars style=minimal
```

## Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `style` | string | `godoc` | Documentation style (`godoc`, `detailed`, `minimal`) |
| `includeExamples` | boolean | `false` | Include usage examples in comments |
| `includeTypes` | boolean | `true` | Document types and structs |
| `includeFunctions` | boolean | `true` | Document functions and methods |
| `includeInterfaces` | boolean | `true` | Document interfaces |
| `overwriteExisting` | boolean | `false` | Overwrite existing comments |
| `dryRun` | boolean | `false` | Preview changes without modifying files |

## Examples

### Before

```go
package main

import "fmt"

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func CreateUser(name string) *User {
    return &User{
        Name: name,
    }
}

func (u *User) GetID() int {
    return u.ID
}
```

### After

```go
// Package main demonstrates user management functionality.
package main

import "fmt"

// User represents a system user with basic profile information.
type User struct {
    ID   int    `json:"id"`   // Unique identifier for the user
    Name string `json:"name"` // Display name of the user
}

// CreateUser creates a new User instance with the specified name.
// It returns a pointer to the newly created User.
func CreateUser(name string) *User {
    return &User{
        Name: name,
    }
}

// GetID returns the unique identifier of the user.
func (u *User) GetID() int {
    return u.ID
}
```

## Comment Standards

The generator follows Go documentation conventions:

- **Package comments** start with "Package" and describe the package purpose
- **Function comments** start with the function name and describe behavior
- **Type comments** start with the type name and explain what it represents
- **Interface comments** describe the contract and expected behavior
- **Method comments** explain the method's purpose and any side effects
- **Field comments** (inline) describe struct field purposes

## Integration with CI/CD

You can integrate the Go comment generator into your GitHub Actions workflow:

```yaml
name: Generate Go Comments
on:
  pull_request:
    paths: ['**/*.go']

jobs:
  comment-generation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install GenAIScript
        run: npm install -g genaiscript
      
      - name: Generate Go Comments
        run: genaiscript run go-comments **/*.go --vars dryRun=false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'docs: add Go documentation comments'
          file_pattern: '**/*.go'
```

## Requirements

- Node.js 18+
- GenAIScript 2.3.9+
- GitHub Models API access (for AI-powered comment generation)

## Authentication

The script requires GitHub Models API access. Set up authentication using one of:

- `GITHUB_TOKEN` environment variable
- `GITHUB_MODELS_TOKEN` environment variable  
- `gh auth login` (GitHub CLI)

## Best Practices

1. **Run in dry-run mode first** to preview changes
2. **Review generated comments** before committing
3. **Use selective parameters** to focus on specific construct types
4. **Combine with linting tools** like `golangci-lint` for comprehensive code quality
5. **Include in code review process** to ensure comment quality

## Troubleshooting

### Authentication Issues
```
GitHub authentication required...
```
**Solution**: Set up GitHub authentication as described in the Requirements section.

### No Constructs Found
```
No documentable constructs found, skipping
```
**Solution**: Ensure your Go files contain functions, types, or interfaces that can be documented.

### Large File Skipped
```
Skipping example.go: too large
```
**Solution**: Files larger than 50KB are skipped for performance. Consider breaking large files into smaller modules.