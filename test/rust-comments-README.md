# Rust Comment Generation Script

This directory contains the `rust-comments.genai.mts` script for generating comprehensive documentation comments for Rust code.

## Features

- **Comprehensive Documentation**: Generates detailed documentation comments following Rust conventions
- **Multiple Styles**: Support for comprehensive, minimal, and example-focused documentation styles
- **Rust Standards**: Follows rustdoc conventions with proper formatting and sections
- **Error Handling**: Documents Result types with proper error sections
- **Safety Documentation**: Includes safety documentation for unsafe functions
- **Examples**: Generates practical usage examples for all public APIs

## Usage

Run the script on any Rust file:

```bash
npm run dev:rust-comments
# or
npx genaiscript run rust-comments test/sample.rs
```

## Parameters

- `style`: Documentation style (`comprehensive`, `minimal`, `examples`) - default: `comprehensive`
- `includeExamples`: Include usage examples (boolean) - default: `true`
- `includeErrors`: Include error documentation for Result types (boolean) - default: `true`
- `includeSafety`: Include safety documentation for unsafe functions (boolean) - default: `true`

## Test Files

- `sample.rs`: Basic calculator and utility functions
- `sample.documented.rs`: Example output showing comprehensive documentation
- `complex.rs`: More complex Rust code with enums, traits, generics, and unsafe code

## Output

The script generates a new file with the `.documented.rs` extension containing the original code with comprehensive documentation comments added.

## Documentation Standards

The generated documentation follows Rust documentation conventions:

- Triple-slash comments (`///`) for item documentation
- Standard rustdoc sections: `# Examples`, `# Errors`, `# Panics`, `# Safety`
- Proper Markdown formatting within comments
- Link syntax for cross-references
- Compilable code examples