script({
  title: "Unit Tests for Language Model Configuration",
  description: "Unit tests for language configuration and model resolution",
  tests: [
    {
      files: "test/markdown.md",
      keywords: ["test", "models", "language"],
    },
  ],
});

// Mock language configurations for testing
const LANGS = Object.freeze({
  en: { name: "English" },
  fr: { name: "French" },
  es: { name: "Spanish" },
  de: { name: "German" },
  it: { name: "Italian" },
  pt: { name: "Portuguese" },
  "pt-br": { name: "Brazilian Portuguese" },
  ru: { name: "Russian" },
  zh: { name: "Chinese" },
  ja: { name: "Japanese" },
  ko: { name: "Korean" },
  ar: {
    name: "Arabic",
    models: {
      translation: "github:openai/gpt-4o",
    },
  },
  hi: { name: "Hindi" },
  tr: { name: "Turkish" },
  nl: { name: "Dutch" },
  pl: { name: "Polish" },
  sv: { name: "Swedish" },
  no: { name: "Norwegian" },
  fi: { name: "Finnish" },
  da: { name: "Danish" },
  cs: { name: "Czech" },
  hu: { name: "Hungarian" },
  ro: { name: "Romanian" },
  th: { name: "Thai" },
  vi: { name: "Vietnamese" },
  id: { name: "Indonesian" },
  ms: { name: "Malay" },
  he: { name: "Hebrew" },
  bg: { name: "Bulgarian" },
  uk: { name: "Ukrainian" },
  el: { name: "Greek" },
  sk: { name: "Slovak" },
  sl: { name: "Slovenian" },
  hr: { name: "Croatian" },
});

const DEFAULT_MODELS = {
  translation: "github:openai/gpt-4o",
  validation: ["github:openai/gpt-4o-mini", "github:openai/gpt-4o"],
};

interface LangConfiguration {
  name: string;
  alias?: string;
  models?: {
    translation?: string;
    validation?: string[];
  };
}

// Test language validation
function testLanguageValidation() {
  const testCases = [
    { input: "en", expected: true, description: "Valid English code" },
    { input: "fr", expected: true, description: "Valid French code" },
    { input: "pt-br", expected: true, description: "Valid Portuguese-Brazil code" },
    { input: "invalid", expected: false, description: "Invalid language code" },
    { input: "", expected: false, description: "Empty language code" },
    { input: "EN", expected: false, description: "Uppercase language code" },
    { input: "zh-cn", expected: false, description: "Unsupported locale variant" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = LANGS.hasOwnProperty(testCase.input);
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

// Test model configuration resolution (simplified version without external dependencies)
function testModelConfigurationResolution() {
  const resolveModelsSync = (lang: string): LangConfiguration => {
    const config = LANGS[lang];
    if (!config) {
      throw new Error(`Language configuration for "${lang}" not found.`);
    }
    
    const res: LangConfiguration = {
      name: config.name,
      models: {},
    };

    // Apply defaults if not found
    res.models.translation = config.models?.translation ?? DEFAULT_MODELS.translation;
    res.models.validation = config.models?.validation ?? DEFAULT_MODELS.validation;

    return res;
  };

  const testCases = [
    {
      input: "en",
      expected: {
        name: "English",
        models: {
          translation: "github:openai/gpt-4o",
          validation: ["github:openai/gpt-4o-mini", "github:openai/gpt-4o"],
        },
      },
      description: "English with default models"
    },
    {
      input: "ar",
      expected: {
        name: "Arabic",
        models: {
          translation: "github:openai/gpt-4o",
          validation: ["github:openai/gpt-4o-mini", "github:openai/gpt-4o"],
        },
      },
      description: "Arabic with custom translation model"
    },
    {
      input: "fr",
      expected: {
        name: "French",
        models: {
          translation: "github:openai/gpt-4o",
          validation: ["github:openai/gpt-4o-mini", "github:openai/gpt-4o"],
        },
      },
      description: "French with default models"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const result = resolveModelsSync(testCase.input);
      if (JSON.stringify(result) === JSON.stringify(testCase.expected)) {
        passed++;
        console.log(`✅ ${testCase.description}: "${testCase.input}" resolved correctly`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: "${testCase.input}" -> ${JSON.stringify(result)}, expected ${JSON.stringify(testCase.expected)}`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${testCase.description}: "${testCase.input}" threw error: ${error.message}`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test error handling for invalid languages
function testErrorHandling() {
  const resolveModelsSync = (lang: string): LangConfiguration => {
    const config = LANGS[lang];
    if (!config) {
      throw new Error(`Language configuration for "${lang}" not found.`);
    }
    
    return {
      name: config.name,
      models: {
        translation: config.models?.translation ?? DEFAULT_MODELS.translation,
        validation: config.models?.validation ?? DEFAULT_MODELS.validation,
      },
    };
  };

  const testCases = [
    { input: "invalid", description: "Invalid language code should throw" },
    { input: "", description: "Empty language code should throw" },
    { input: "xyz", description: "Non-existent language code should throw" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      resolveModelsSync(testCase.input);
      failed++;
      console.log(`❌ ${testCase.description}: "${testCase.input}" should have thrown but didn't`);
    } catch (error) {
      if (error.message.includes("not found")) {
        passed++;
        console.log(`✅ ${testCase.description}: "${testCase.input}" correctly threw error`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: "${testCase.input}" threw unexpected error: ${error.message}`);
      }
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test language code normalization patterns
function testLanguageCodePatterns() {
  const isLanguagePattern = (filename: string) => {
    // Test the regex patterns from the translator
    const hasLangInFilename = /\.[a-z]{2,2}(-[a-zA-Z]{2,3})?\.mdx?$/.test(filename);
    const hasLangInPath = /\/[a-z]{2,2}(-[a-zA-Z]{2,3})?\//.test(filename);
    return hasLangInFilename || hasLangInPath;
  };

  const testCases = [
    { input: "README.fr.md", expected: true, description: "French filename pattern" },
    { input: "README.pt-br.md", expected: true, description: "Portuguese-Brazil filename pattern" },
    { input: "docs/fr/README.md", expected: true, description: "French path pattern" },
    { input: "docs/pt-BR/README.md", expected: true, description: "Portuguese-Brazil path pattern" },
    { input: "README.md", expected: false, description: "No language pattern" },
    { input: "docs/content/README.md", expected: false, description: "No language in path" },
    { input: "README.english.md", expected: false, description: "Full language name" },
    { input: "README.fra.md", expected: false, description: "Three-letter code" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = isLanguagePattern(testCase.input);
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

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Language Model Configuration Unit Tests");
  
  output.heading(2, "Testing language validation");
  const languageValidationResults = testLanguageValidation();
  output.itemValue("Passed", languageValidationResults.passed);
  output.itemValue("Failed", languageValidationResults.failed);
  output.itemValue("Total", languageValidationResults.total);
  
  output.heading(2, "Testing model configuration resolution");
  const modelConfigResults = testModelConfigurationResolution();
  output.itemValue("Passed", modelConfigResults.passed);
  output.itemValue("Failed", modelConfigResults.failed);
  output.itemValue("Total", modelConfigResults.total);
  
  output.heading(2, "Testing error handling");
  const errorHandlingResults = testErrorHandling();
  output.itemValue("Passed", errorHandlingResults.passed);
  output.itemValue("Failed", errorHandlingResults.failed);
  output.itemValue("Total", errorHandlingResults.total);
  
  output.heading(2, "Testing language code patterns");
  const languagePatternResults = testLanguageCodePatterns();
  output.itemValue("Passed", languagePatternResults.passed);
  output.itemValue("Failed", languagePatternResults.failed);
  output.itemValue("Total", languagePatternResults.total);
  
  // Summary
  const totalPassed = languageValidationResults.passed + modelConfigResults.passed + errorHandlingResults.passed + languagePatternResults.passed;
  const totalFailed = languageValidationResults.failed + modelConfigResults.failed + errorHandlingResults.failed + languagePatternResults.failed;
  const totalTests = languageValidationResults.total + modelConfigResults.total + errorHandlingResults.total + languagePatternResults.total;
  
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