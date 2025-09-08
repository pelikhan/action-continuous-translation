script({
  title: "Unit Tests for Translator Utilities",
  description: "Unit tests for core utility functions in the translator",
  tests: [
    {
      files: "test/markdown.md",
      keywords: ["test", "utilities"],
    },
  ],
});

// Import the utility functions we want to test
// Since this is a GenAI script, we'll extract and test the utility functions

// Test isTranslatable function
function testIsTranslatable() {
  const IGNORE_RX = /^\s*[0-9-"'`=+\/~_.,:;<>\]\[{}\(\)…\s]+\s*$/;
  const isUri = (str: string): URL => {
    try {
      return new URL(str);
    } catch {
      return undefined;
    }
  };
  
  const isTranslatable = (text: string) =>
    !IGNORE_RX.test(text) && !isUri(text) && !!text.replaceAll(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, "");

  // Test cases
  const testCases = [
    { input: "Hello world", expected: true, description: "Normal text" },
    { input: "123", expected: false, description: "Only numbers" },
    { input: "...", expected: false, description: "Only punctuation" },
    { input: "https://example.com", expected: false, description: "URL" },
    { input: "", expected: false, description: "Empty string" },
    { input: "   ", expected: false, description: "Only whitespace" },
    { input: "Hello 123", expected: true, description: "Mixed text and numbers" },
    { input: "Hello, world!", expected: true, description: "Text with punctuation" },
    { input: "[()]", expected: false, description: "Only brackets" },
    { input: "Code example", expected: true, description: "Simple sentence" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = isTranslatable(testCase.input);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: "${testCase.input}" -> ${result}`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: "${testCase.input}" -> ${result}, expected ${testCase.expected}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test hasMarker function
function testHasMarker() {
  const MARKER_START = "┌";
  const MARKER_END = "└";
  
  const hasMarker = (text: string) => {
    return text.includes(MARKER_START) && text.includes(MARKER_END);
  };

  const testCases = [
    { input: "┌T001┐Hello└T001┘", expected: true, description: "Valid marker format" },
    { input: "Hello world", expected: false, description: "No markers" },
    { input: "┌T001┐Hello", expected: false, description: "Only start marker" },
    { input: "Hello└T001┘", expected: false, description: "Only end marker" },
    { input: "┌T001┐Hello└T002┘", expected: true, description: "Different marker IDs" },
    { input: "", expected: false, description: "Empty string" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = hasMarker(testCase.input);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: "${testCase.input}" -> ${result}`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: "${testCase.input}" -> ${result}, expected ${testCase.expected}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test isUri function
function testIsUri() {
  const isUri = (str: string): URL => {
    try {
      return new URL(str);
    } catch {
      return undefined;
    }
  };

  const testCases = [
    { input: "https://example.com", expected: true, description: "Valid HTTPS URL" },
    { input: "http://example.com", expected: true, description: "Valid HTTP URL" },
    { input: "ftp://files.example.com", expected: true, description: "Valid FTP URL" },
    { input: "mailto:test@example.com", expected: true, description: "Valid mailto URL" },
    { input: "not-a-url", expected: false, description: "Invalid URL" },
    { input: "", expected: false, description: "Empty string" },
    { input: "hello world", expected: false, description: "Regular text" },
    { input: "www.example.com", expected: false, description: "URL without protocol" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = !!isUri(testCase.input);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: "${testCase.input}" -> ${result}`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: "${testCase.input}" -> ${result}, expected ${testCase.expected}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test filename template processing
function testFilenameTemplate() {
  // Simulate the parsers.jinja function behavior
  const jinjaSimulate = (template: string, vars: Record<string, string>) => {
    return template
      .replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] || match);
  };

  const testCases = [
    {
      template: "{{dirname}}/{{basename}}.{{lang}}{{extname}}",
      vars: { dirname: "docs", basename: "README", lang: "fr", extname: ".md" },
      expected: "docs/README.fr.md",
      description: "Standard template"
    },
    {
      template: "translations/{{lang}}/{{basename}}{{extname}}",
      vars: { dirname: ".", basename: "index", lang: "es", extname: ".html" },
      expected: "translations/es/index.html",
      description: "Custom translations directory"
    },
    {
      template: "{{basename}}-{{lang}}{{extname}}",
      vars: { dirname: "src", basename: "guide", lang: "de", extname: ".mdx" },
      expected: "guide-de.mdx",
      description: "Simple template"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = jinjaSimulate(testCase.template, testCase.vars);
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: template "${testCase.template}" -> "${result}"`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: template "${testCase.template}" -> "${result}", expected "${testCase.expected}"`);
    }
  }

  return { passed, failed, total: testCases.length };
}

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Translator Utilities Unit Tests");
  
  output.heading(2, "Testing isTranslatable function");
  const isTranslatableResults = testIsTranslatable();
  output.itemValue("Passed", isTranslatableResults.passed);
  output.itemValue("Failed", isTranslatableResults.failed);
  output.itemValue("Total", isTranslatableResults.total);
  
  output.heading(2, "Testing hasMarker function");
  const hasMarkerResults = testHasMarker();
  output.itemValue("Passed", hasMarkerResults.passed);
  output.itemValue("Failed", hasMarkerResults.failed);
  output.itemValue("Total", hasMarkerResults.total);
  
  output.heading(2, "Testing isUri function");
  const isUriResults = testIsUri();
  output.itemValue("Passed", isUriResults.passed);
  output.itemValue("Failed", isUriResults.failed);
  output.itemValue("Total", isUriResults.total);
  
  output.heading(2, "Testing filename template processing");
  const templateResults = testFilenameTemplate();
  output.itemValue("Passed", templateResults.passed);
  output.itemValue("Failed", templateResults.failed);
  output.itemValue("Total", templateResults.total);
  
  // Summary
  const totalPassed = isTranslatableResults.passed + hasMarkerResults.passed + isUriResults.passed + templateResults.passed;
  const totalFailed = isTranslatableResults.failed + hasMarkerResults.failed + isUriResults.failed + templateResults.failed;
  const totalTests = isTranslatableResults.total + hasMarkerResults.total + isUriResults.total + templateResults.total;
  
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