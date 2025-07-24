script({
  title: "Rust Documentation Comment Generator",
  description:
    "Generates comprehensive documentation comments for Rust code including functions, structs, methods, and modules.",
  accept: ".rs",
  branding: {
    color: "orange",
    icon: "file-text",
  },
  parameters: {
    style: {
      type: "string",
      default: "comprehensive",
      description:
        "Documentation style: 'comprehensive', 'minimal', or 'examples'",
    },
    includeExamples: {
      type: "boolean",
      default: true,
      description: "Include usage examples in the documentation",
    },
    includeErrors: {
      type: "boolean",
      default: true,
      description: "Include error documentation for Result types",
    },
    includeSafety: {
      type: "boolean",
      default: true,
      description: "Include safety documentation for unsafe functions",
    },
  },
});

export default async function main() {
  const { style, includeExamples, includeErrors, includeSafety } = env.vars;

  if (!env.files || env.files.length === 0) {
    cancel("No Rust files selected");
  }

  for (const file of env.files) {
    const { filename, content } = file;

    if (!filename.endsWith(".rs")) {
      console.warn(`Skipping non-Rust file: ${filename}`);
      continue;
    }

    env.output.heading(2, `Processing ${filename}`);

    // Generate documentation comments for the Rust code
    const documentedCode = await runPrompt(
      (ctx) => {
        const codeRef = ctx.def("RUST_CODE", content);
        ctx.$`## Role
You are an expert Rust developer and technical writer with deep knowledge of Rust best practices and documentation standards.

## Task
Generate comprehensive documentation comments for the Rust code in ${codeRef}. Follow Rust documentation conventions using triple-slash comments (///).

## Instructions

### Documentation Style
- Use triple-slash comments (///) for documentation
- Follow rustdoc conventions and formatting
- Use standard rustdoc sections like # Examples, # Panics, # Errors, # Safety
- Write clear, concise descriptions that explain purpose and behavior

### Code Analysis
- Identify all public functions, structs, enums, traits, and modules
- For each item, provide:
  - Clear description of purpose and functionality
  - Parameter descriptions with types
  - Return value descriptions
  - ${includeExamples ? "# Examples section with usage examples" : ""}
  - ${includeErrors ? "# Errors section for Result types" : ""}
  - ${includeSafety ? "# Safety section for unsafe code" : ""}
  - # Panics section if the function can panic

### Documentation Guidelines
- Start with a brief one-line summary
- Follow with detailed explanation if needed
- Use proper Markdown formatting within comments
- Include code examples that compile and run
- Document all public APIs thoroughly
- Use proper rustdoc link syntax: [type] or [function]
- Include \`\`\`rust code blocks for examples

### Style: ${style}
${
  style === "comprehensive"
    ? "- Provide detailed documentation for all items\n- Include extensive examples and edge cases\n- Document internal implementation details when relevant"
    : ""
}
${
  style === "minimal"
    ? "- Focus on essential information only\n- Brief descriptions without extensive examples\n- Cover the basic purpose and usage"
    : ""
}
${
  style === "examples"
    ? "- Emphasize practical usage examples\n- Show common use cases and patterns\n- Include both simple and complex examples"
    : ""
}

### Output Format
- Return the complete Rust code with documentation comments added
- Preserve all existing code exactly as provided
- Only add documentation comments, do not modify the code itself
- Ensure proper spacing and formatting
- Place documentation comments immediately before the items they document

Generate well-structured, professional documentation that would be suitable for publication on docs.rs.`;
      },
      {
        model: "gpt-4o",
        temperature: 0.1,
      }
    );

    if (!documentedCode?.text) {
      console.error(`Failed to generate documentation for ${filename}`);
      continue;
    }

    // Write the documented code to a new file
    const outputFilename = filename.replace(/\.rs$/, ".documented.rs");
    await workspace.writeText(outputFilename, documentedCode.text);

    env.output.itemValue("Generated", outputFilename);
    env.output.fence(documentedCode.text, "rust");
  }
}
