script({
  title: "C++ Comment Generator",
  description: "Automatically generates documentation comments for C++ code using AI",
  accept: ".cpp,.c,.h,.hpp,.cc,.cxx",
  branding: {
    color: "blue",
    icon: "code",
  },
  disableChatPreview: true,
  parameters: {
    commentStyle: {
      type: "string",
      default: "doxygen",
      description: "Comment style to use (doxygen, javadoc, or block)",
    },
    includePrivate: {
      type: "boolean", 
      default: false,
      description: "Whether to generate comments for private members",
    },
    overwrite: {
      type: "boolean",
      default: false,
      description: "Whether to overwrite existing comments",
    },
  },
});

const commentStyle = env.vars.commentStyle || "doxygen";
const includePrivate = env.vars.includePrivate === "true";
const overwrite = env.vars.overwrite === "true";

export default async function main() {
  const files = env.files.filter(f => 
    /\.(cpp|c|h|hpp|cc|cxx)$/i.test(f.filename)
  );

  if (!files.length) {
    cancel("No C++ files found to process");
  }

  console.log(`Processing ${files.length} C++ file(s)...`);
  console.log(`Comment style: ${commentStyle}`);
  console.log(`Include private members: ${includePrivate}`);
  console.log(`Overwrite existing comments: ${overwrite}`);

  for (const file of files) {
    const { filename, content } = file;
    console.log(`\nProcessing: ${filename}`);

    // Analyze the C++ code structure
    const analysis = await analyzeCppCode(content);
    if (!analysis.needsComments) {
      console.log(`  Skipping ${filename} - no uncommented code found`);
      continue;
    }

    // Generate comments for the code
    const commentedCode = await generateComments(content, analysis);
    
    // Write the updated file
    await workspace.writeText(filename, commentedCode);
    console.log(`  Updated ${filename} with generated comments`);
  }
}

async function analyzeCppCode(code: string) {
  const { text: analysis } = await runPrompt(
    (ctx) => {
      const codeRef = ctx.def("CODE", code);
      ctx.$`## Task
Analyze the provided C++ code and identify all functions, classes, methods, and other constructs that need documentation comments.

## Code to Analyze
\`\`\`cpp
${codeRef}
\`\`\`

## Instructions
- Identify all functions, classes, methods, constructors, destructors
- Check if they already have documentation comments
- Note the visibility (public, private, protected)
- Determine parameter types and return types
- Identify any template parameters
- Look for complex logic that needs explanation

## Output Format
Respond with a JSON object containing:
- needsComments: boolean (true if any uncommented constructs found)
- constructs: array of objects with:
  - type: "function" | "class" | "method" | "constructor" | "destructor" | "template"
  - name: string
  - line: number (approximate)
  - visibility: "public" | "private" | "protected" | "global"
  - hasComment: boolean
  - parameters: array of parameter info
  - returnType: string
  - isTemplate: boolean
  - templateParams: array of template parameter names

Only include constructs that need comments (based on overwrite setting).`;
    },
    {
      label: "C++ Code Analysis",
      throwOnError: true,
      model: "github:openai/gpt-4o-mini",
    }
  );

  try {
    return JSON.parse(analysis);
  } catch (e) {
    console.error("Failed to parse analysis:", e);
    return { needsComments: false, constructs: [] };
  }
}

async function generateComments(code: string, analysis: any) {
  const { text: commentedCode } = await runPrompt(
    (ctx) => {
      const codeRef = ctx.def("CODE", code);
      const analysisRef = ctx.def("ANALYSIS", JSON.stringify(analysis, null, 2));
      const commentStyleRef = ctx.def("COMMENT_STYLE", commentStyle);
      const includePrivateStr = includePrivate.toString();
      const overwriteStr = overwrite.toString();
      
      ctx.$`## Task
Generate appropriate documentation comments for the C++ code based on the analysis.

## Original Code
\`\`\`cpp
${codeRef}
\`\`\`

## Analysis
\`\`\`json
${analysisRef}
\`\`\`

## Comment Style: ${commentStyleRef}

## Instructions
- Use ${commentStyle} style comments:
  ${commentStyle === "doxygen" ? `
  - Use /** */ for multi-line comments
  - Use @param for parameters
  - Use @return for return values
  - Use @brief for brief descriptions
  - Use @class for classes
  ` : commentStyle === "javadoc" ? `
  - Use /** */ for multi-line comments  
  - Use @param for parameters
  - Use @return for return values
  - Use standard Javadoc tags
  ` : `
  - Use /* */ for block comments
  - Use clear descriptive text
  - Describe purpose and behavior
  `}
- Add comments for all constructs identified in the analysis that need them
- ${includePrivateStr === "true" ? "Include private members" : "Skip private members unless explicitly requested"}
- ${overwriteStr === "true" ? "Replace existing comments" : "Only add comments where none exist"}
- Preserve all original code structure and functionality
- Make comments clear, concise, and helpful
- Include parameter descriptions and return value descriptions
- For classes, describe the overall purpose and usage
- For complex functions, explain the algorithm or approach
- For templates, document template parameters

## Output
Return the complete updated C++ code with all appropriate comments added.
Do not include any explanation text, just the code.`;
    },
    {
      label: "C++ Comment Generation",
      throwOnError: true,
      model: "github:openai/gpt-4o",
    }
  );

  return commentedCode;
}