script({
  title: "Unit Tests for Frontmatter and Schema Validation",
  description: "Unit tests for frontmatter parsing and schema validation",
  tests: [
    {
      files: "test/example-with-instructions.md",
      keywords: ["test", "frontmatter", "schema"],
    },
  ],
});

// Import schema types (simplified for testing)
interface TranslatorConfiguration {
  instructions?: string;
}

interface FrontmatterWithTranslator {
  translator?: TranslatorConfiguration;
  title?: string;
  description?: string;
  [key: string]: any;
}

// Schema validation functions (simplified)
function validateTranslatorConfiguration(data: any): data is TranslatorConfiguration {
  if (typeof data !== 'object' || data === null) return false;
  
  if (data.instructions !== undefined && typeof data.instructions !== 'string') {
    return false;
  }
  
  return true;
}

function validateFrontmatterWithTranslator(data: any): data is FrontmatterWithTranslator {
  if (typeof data !== 'object' || data === null) return false;
  
  if (data.translator !== undefined && !validateTranslatorConfiguration(data.translator)) {
    return false;
  }
  
  return true;
}

// Test frontmatter parsing
function testFrontmatterParsing() {
  // Simulate YAML parsing (simplified for nested objects)
  const parseYAML = (yamlString: string): any => {
    try {
      const lines = yamlString.split('\n');
      const result: any = {};
      let currentKey = '';
      let currentObject: any = null;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('#')) continue;
        
        if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          const value = valueParts.join(':').trim();
          const keyTrimmed = key.trim();
          
          // Check if it's a nested key (indented)
          if (line.startsWith('  ') && currentObject) {
            if (value.startsWith('>')) {
              currentObject[keyTrimmed] = value.substring(1).trim();
            } else if (value.startsWith('"') && value.endsWith('"')) {
              currentObject[keyTrimmed] = value.slice(1, -1);
            } else {
              currentObject[keyTrimmed] = value;
            }
          } else {
            // Top-level key
            if (value === '' || value === '{}') {
              // Empty object
              currentObject = {};
              result[keyTrimmed] = currentObject;
              currentKey = keyTrimmed;
            } else if (value.startsWith('>')) {
              result[keyTrimmed] = value.substring(1).trim();
              currentObject = null;
            } else if (value.startsWith('"') && value.endsWith('"')) {
              result[keyTrimmed] = value.slice(1, -1);
              currentObject = null;
            } else if (value) {
              result[keyTrimmed] = value;
              currentObject = null;
            } else {
              // Object start
              currentObject = {};
              result[keyTrimmed] = currentObject;
              currentKey = keyTrimmed;
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      throw new Error(`Invalid YAML: ${error.message}`);
    }
  };

  const testCases = [
    {
      input: `title: "Example Document"
description: "A test document"`,
      expected: {
        title: "Example Document",
        description: "A test document"
      },
      description: "Simple frontmatter"
    },
    {
      input: `title: "Example Document with Translation Instructions"
translator:
  instructions: "Use happy tone."`,
      expected: {
        title: "Example Document with Translation Instructions",
        translator: {
          instructions: "Use happy tone."
        }
      },
      description: "Frontmatter with translator config"
    },
    {
      input: `title: Test Document
author: John Doe
tags: test, documentation`,
      expected: {
        title: "Test Document",
        author: "John Doe",
        tags: "test, documentation"
      },
      description: "Multiple fields"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const result = parseYAML(testCase.input);
      if (JSON.stringify(result) === JSON.stringify(testCase.expected)) {
        passed++;
        console.log(`✅ ${testCase.description}: parsed correctly`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: got ${JSON.stringify(result)}, expected ${JSON.stringify(testCase.expected)}`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${testCase.description}: parsing failed: ${error.message}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test schema validation
function testSchemaValidation() {
  const testCases = [
    {
      input: { instructions: "Use formal tone" },
      expected: true,
      description: "Valid translator configuration with instructions"
    },
    {
      input: {},
      expected: true,
      description: "Empty translator configuration"
    },
    {
      input: { instructions: 123 },
      expected: false,
      description: "Invalid instructions type (number)"
    },
    {
      input: null,
      expected: false,
      description: "Null translator configuration"
    },
    {
      input: "string",
      expected: false,
      description: "String instead of object"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = validateTranslatorConfiguration(testCase.input);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: validation result ${result}`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: got ${result}, expected ${testCase.expected}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test frontmatter extraction from markdown
function testFrontmatterExtraction() {
  const extractFrontmatter = (markdown: string): { frontmatter: any; content: string } | null => {
    const lines = markdown.split('\n');
    if (lines[0] !== '---') return null;
    
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        endIndex = i;
        break;
      }
    }
    
    if (endIndex === -1) return null;
    
    const yamlContent = lines.slice(1, endIndex).join('\n');
    const markdownContent = lines.slice(endIndex + 1).join('\n');
    
    // Very basic YAML parser
    const frontmatter: any = {};
    const yamlLines = yamlContent.split('\n');
    
    for (const line of yamlLines) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          frontmatter[key.trim()] = value.slice(1, -1);
        } else {
          frontmatter[key.trim()] = value;
        }
      }
    }
    
    return { frontmatter, content: markdownContent };
  };

  const testCases = [
    {
      input: `---
title: "Test Document"
author: "John Doe"
---

# Test Document

This is the content.`,
      expectedFrontmatter: {
        title: "Test Document",
        author: "John Doe"
      },
      expectedContent: `
# Test Document

This is the content.`,
      description: "Document with frontmatter"
    },
    {
      input: `# No Frontmatter

This document has no frontmatter.`,
      expectedFrontmatter: null,
      expectedContent: null,
      description: "Document without frontmatter"
    },
    {
      input: `---
title: "Incomplete frontmatter

This has no closing delimiter.`,
      expectedFrontmatter: null,
      expectedContent: null,
      description: "Incomplete frontmatter"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = extractFrontmatter(testCase.input);
    
    if (testCase.expectedFrontmatter === null) {
      if (result === null) {
        passed++;
        console.log(`✅ ${testCase.description}: correctly detected no frontmatter`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: expected null but got frontmatter`);
      }
    } else {
      if (result && JSON.stringify(result.frontmatter) === JSON.stringify(testCase.expectedFrontmatter)) {
        passed++;
        console.log(`✅ ${testCase.description}: frontmatter extracted correctly`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: frontmatter extraction failed`);
      }
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test frontmatter field validation
function testFrontmatterFields() {
  const FRONTMATTER_FIELDS = [
    "title",
    "description", 
    "summary",
    "excerpt",
    "alt",
    "caption",
    "text",
    "tagline",
    "content",
    "label",
    "prev",
    "next",
    "badge",
    "og_title",
    "og_description",
  ];

  const hasTranslatableFields = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    
    return FRONTMATTER_FIELDS.some(field => 
      typeof data[field] === 'string' && data[field].trim().length > 0
    );
  };

  const testCases = [
    {
      input: { title: "Hello World", description: "A test document" },
      expected: true,
      description: "Has translatable title and description"
    },
    {
      input: { author: "John Doe", date: "2023-01-01" },
      expected: false,
      description: "No translatable fields"
    },
    {
      input: { title: "", description: "   " },
      expected: false,
      description: "Empty or whitespace-only fields"
    },
    {
      input: { title: "Test", tags: ["test", "doc"] },
      expected: true,
      description: "Has title field"
    },
    {
      input: null,
      expected: false,
      description: "Null input"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = hasTranslatableFields(testCase.input);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: result ${result}`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: got ${result}, expected ${testCase.expected}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Frontmatter and Schema Validation Unit Tests");
  
  output.heading(2, "Testing frontmatter parsing");
  const frontmatterResults = testFrontmatterParsing();
  output.itemValue("Passed", frontmatterResults.passed);
  output.itemValue("Failed", frontmatterResults.failed);
  output.itemValue("Total", frontmatterResults.total);
  
  output.heading(2, "Testing schema validation");
  const schemaResults = testSchemaValidation();
  output.itemValue("Passed", schemaResults.passed);
  output.itemValue("Failed", schemaResults.failed);
  output.itemValue("Total", schemaResults.total);
  
  output.heading(2, "Testing frontmatter extraction");
  const extractionResults = testFrontmatterExtraction();
  output.itemValue("Passed", extractionResults.passed);
  output.itemValue("Failed", extractionResults.failed);
  output.itemValue("Total", extractionResults.total);
  
  output.heading(2, "Testing frontmatter field validation");
  const fieldResults = testFrontmatterFields();
  output.itemValue("Passed", fieldResults.passed);
  output.itemValue("Failed", fieldResults.failed);
  output.itemValue("Total", fieldResults.total);
  
  // Summary
  const totalPassed = frontmatterResults.passed + schemaResults.passed + extractionResults.passed + fieldResults.passed;
  const totalFailed = frontmatterResults.failed + schemaResults.failed + extractionResults.failed + fieldResults.failed;
  const totalTests = frontmatterResults.total + schemaResults.total + extractionResults.total + fieldResults.total;
  
  output.heading(2, "Overall Results");
  output.itemValue("Total Tests", totalTests);
  output.itemValue("Passed", totalPassed);
  output.itemValue("Failed", totalFailed);
  output.itemValue("Success Rate", `${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalFailed > 0) {
    output.error(`${totalFailed} tests failed`);
  } else {
    console.log("All tests passed! ✅");
  }
}