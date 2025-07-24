script({
  title: "Go Comment Generator",
  description: "Generates comprehensive documentation comments for Go code following Go conventions",
  accept: ".go",
  branding: {
    color: "blue",
    icon: "code",
  },
  disableChatPreview: true,
  parameters: {
    style: {
      type: "string",
      default: "godoc",
      description: "Documentation style to use (godoc, detailed, minimal)",
    },
    includeExamples: {
      type: "boolean",
      default: false,
      description: "Whether to include example usage in comments",
    },
    includeTypes: {
      type: "boolean", 
      default: true,
      description: "Whether to document types and structs",
    },
    includeFunctions: {
      type: "boolean",
      default: true, 
      description: "Whether to document functions and methods",
    },
    includeInterfaces: {
      type: "boolean",
      default: true,
      description: "Whether to document interfaces",
    },
    overwriteExisting: {
      type: "boolean",
      default: false,
      description: "Whether to overwrite existing comments",
    },
    dryRun: {
      type: "boolean",
      default: false,
      description: "Preview changes without modifying files",
    },
  },
  tests: [
    {
      files: "test/example.go",
      keywords: ["User", "func", "type", "interface"],
    },
  ],
});

export default async function main() {
  const {
    style = "godoc",
    includeExamples = false,
    includeTypes = true,
    includeFunctions = true,
    includeInterfaces = true,
    overwriteExisting = false,
    dryRun = false,
  } = env.vars;

  // Process each Go file
  for (const file of env.files) {
    const { filename, content } = file;
    
    console.log(`Processing ${filename}...`);
    
    // Skip if file is empty or too large
    if (!content || content.length > 50000) {
      console.log(`Skipping ${filename}: ${!content ? 'empty' : 'too large'}`);
      continue;
    }

    // Quick analysis of Go constructs
    const constructs = {
      functions: (content.match(/^func\s+\w+/gm) || []).length,
      types: (content.match(/^type\s+\w+/gm) || []).length,
      interfaces: (content.match(/^type\s+\w+\s+interface/gm) || []).length,
      structs: (content.match(/^type\s+\w+\s+struct/gm) || []).length,
    };
    
    console.log(`   Found: ${constructs.functions} functions, ${constructs.types} types (${constructs.structs} structs, ${constructs.interfaces} interfaces)`);

    if (constructs.functions === 0 && constructs.types === 0) {
      console.log(`   No documentable constructs found, skipping`);
      continue;
    }

    try {
      // Generate comments for the Go file
      const result = await runPrompt(
        async (ctx) => {
          const codeRef = ctx.def("GO_CODE", content, {
            language: "go",
            lineNumbers: true,
          });

          ctx.$`You are an expert Go developer with deep knowledge of Go documentation conventions and best practices.

## Task
Your task is to analyze the Go code in ${codeRef} and add comprehensive documentation comments following Go conventions.

## Go Documentation Standards
- Package comments should be complete sentences that start with "Package"
- Function comments should start with the function name and be complete sentences
- Type comments should start with the type name and describe what it represents
- Interface comments should describe the contract and behavior
- Use godoc format: comments should be directly above the declaration with no blank line
- Comments should be concise but complete
- Avoid obvious comments - focus on explaining WHY and HOW, not just WHAT

## Instructions
- Follow Go documentation conventions (godoc style)
- Add comments for: ${includeTypes ? 'types/structs, ' : ''}${includeFunctions ? 'functions/methods, ' : ''}${includeInterfaces ? 'interfaces, ' : ''}constants, variables
- ${overwriteExisting ? 'Replace existing comments with better ones' : 'Only add comments where none exist'}
- ${includeExamples ? 'Include usage examples in comments where helpful' : 'Focus on clear descriptions without examples'}
- Ensure comments are complete sentences starting with the declared name
- Keep comments concise but informative
- Comment style: ${style}

## Output Format
Return the complete Go file with added documentation comments. Preserve all existing code structure and formatting.
Only add the comments - do not modify the actual Go code logic.

## Example Comment Formats:

For functions:
\`\`\`go
// ProcessUser processes a user record and returns any validation errors.
// It validates the user data and updates the database accordingly.
func ProcessUser(user *User) error {
\`\`\`

For types:
\`\`\`go
// User represents a system user with authentication and profile information.
type User struct {
\`\`\`

For interfaces:
\`\`\`go
// UserService defines the contract for user management operations.
// Implementations should handle user CRUD operations and validation.
type UserService interface {
\`\`\`

Now analyze and add appropriate comments to the provided Go code.`;
        },
        {
          label: `comment generation for ${filename}`,
          cache: true,
          model: "github:openai/gpt-4o",
          maxTokens: 4000,
        }
      );

      if (!result || !result.text) {
        console.error(`Failed to generate comments for ${filename}: No result returned`);
        continue;
      }

      const { text: commentedCode, usage } = result;

      // Write the commented code back to the file or show preview
      if (dryRun) {
        console.log(`\n📋 Preview for ${filename}:`);
        console.log("=" .repeat(50));
        console.log(commentedCode);
        console.log("=" .repeat(50));
      } else {
        await workspace.writeText(filename, commentedCode);
        console.log(`✅ Added comments to ${filename}`);
      }
      
      if (usage) {
        console.log(`   Tokens used: ${usage.total || 0} (prompt: ${usage.prompt || 0}, completion: ${usage.completion || 0})`);
      }
      
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }

  console.log("Go comment generation completed!");
}