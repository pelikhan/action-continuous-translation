// Unit tests for translation utilities
// These tests run offline without external API dependencies

import {
  isTranslatable,
  isUri,
  hasMarker,
  FRONTMATTER_FIELDS,
  MockTranslationCache,
  MockFileSystem,
  createTestMarkdown,
  createTestFrontmatter,
} from "./src/test-utils.mts";

script({
  title: "Unit Tests for Translation Utilities",
  description: "Test utility functions without external API dependencies",
  disableChatPreview: true,
  tests: [
    {
      files: [],
      keywords: ["unit", "test", "offline"],
    },
  ],
});

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Translation Utility Tests");
  
  let passedTests = 0;
  let totalTests = 0;
  
  const test = (name: string, testFn: () => boolean) => {
    totalTests++;
    try {
      const result = testFn();
      if (result) {
        passedTests++;
        output.note(`✅ ${name}`);
      } else {
        output.error(`❌ ${name}: Test assertion failed`);
      }
    } catch (error) {
      output.error(`❌ ${name}: ${error.message}`);
    }
  };

  output.heading(2, "isTranslatable Function Tests");
  
  test("should identify translatable text", () => {
    return isTranslatable("Hello world") === true;
  });
  
  test("should reject empty text", () => {
    return isTranslatable("") === false;
  });
  
  test("should reject whitespace only", () => {
    return isTranslatable("   ") === false;
  });
  
  test("should reject punctuation covered by regex", () => {
    return isTranslatable(".,;:~_") === false;
  });
  
  test("should accept punctuation not in regex", () => {
    return isTranslatable("!?") === true;
  });
  
  test("should reject numbers only", () => {
    return isTranslatable("123456") === false;
  });
  
  test("should reject URLs", () => {
    return isTranslatable("https://example.com") === false;
  });
  
  test("should reject emojis only", () => {
    return isTranslatable("😀🚀💻") === false;
  });
  
  test("should accept text with emojis", () => {
    return isTranslatable("Hello 😀 world") === true;
  });

  output.heading(2, "isUri Function Tests");
  
  test("should identify valid HTTP URL", () => {
    return isUri("https://example.com") !== undefined;
  });
  
  test("should identify valid HTTPS URL", () => {
    return isUri("https://example.com") !== undefined;
  });
  
  test("should reject invalid URL", () => {
    return isUri("not-a-url") === undefined;
  });
  
  test("should reject empty string", () => {
    return isUri("") === undefined;
  });

  output.heading(2, "hasMarker Function Tests");
  
  test("should detect translation markers", () => {
    return hasMarker("┌T001┐Hello world└T001┘") === true;
  });
  
  test("should reject text without markers", () => {
    return hasMarker("Hello world") === false;
  });
  
  test("should reject partial markers", () => {
    return hasMarker("┌T001┐Hello world") === false;
  });

  output.heading(2, "MockTranslationCache Tests");
  
  test("should store and retrieve translations", () => {
    const cache = new MockTranslationCache();
    cache.set("hash1", "translation1");
    return cache.get("hash1") === "translation1";
  });
  
  test("should return undefined for missing hash", () => {
    const cache = new MockTranslationCache();
    return cache.get("nonexistent") === undefined;
  });
  
  test("should clear cache", () => {
    const cache = new MockTranslationCache();
    cache.set("hash1", "translation1");
    cache.clear();
    return cache.size() === 0;
  });

  output.heading(2, "MockFileSystem Tests");
  
  test("should write and read files", () => {
    const fs = new MockFileSystem();
    fs.writeFile("/test.txt", "content");
    return fs.readFile("/test.txt") === "content";
  });
  
  test("should check file existence", () => {
    const fs = new MockFileSystem();
    fs.writeFile("/test.txt", "content");
    return fs.exists("/test.txt") === true && fs.exists("/missing.txt") === false;
  });

  output.heading(2, "Test Data Generators");
  
  test("should create test markdown", () => {
    const md = createTestMarkdown("Test content");
    return md.includes("Test content") && md.includes("# Test Document");
  });
  
  test("should create frontmatter with translator", () => {
    const fm = createTestFrontmatter({ instructions: "Be happy" });
    return fm.includes("Be happy") && fm.includes("translator:");
  });

  output.heading(2, "FRONTMATTER_FIELDS Tests");
  
  test("should contain expected fields", () => {
    return FRONTMATTER_FIELDS.includes("title") && 
           FRONTMATTER_FIELDS.includes("description") &&
           FRONTMATTER_FIELDS.length > 10;
  });

  output.heading(2, "Test Summary");
  
  if (passedTests === totalTests) {
    output.note(`All ${totalTests} tests passed! ✅`);
  } else {
    output.error(`${passedTests}/${totalTests} tests passed. ${totalTests - passedTests} tests failed. ❌`);
  }
  
  return {
    passed: passedTests,
    total: totalTests,
    success: passedTests === totalTests
  };
}