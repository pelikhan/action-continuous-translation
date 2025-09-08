script({
  title: "Unit Tests for Markdown Processing",
  description: "Unit tests for markdown AST processing and translation markers",
  tests: [
    {
      files: "test/markdown.md",
      keywords: ["test", "markdown", "ast"],
    },
  ],
});

// Test translation marker insertion and removal
function testTranslationMarkers() {
  const MARKER_START = "┌";
  const MARKER_END = "└";
  
  const insertMarkers = (text: string, markerId: string): string => {
    return `┌${markerId}┐${text}└${markerId}┘`;
  };
  
  const removeMarkers = (text: string): string => {
    return text
      .replace(/┌[A-Z]\d{3,5}┐/g, "")
      .replace(/└[A-Z]\d{3,5}┘/g, "");
  };
  
  const extractMarkerContent = (text: string): { markerId: string; content: string } | null => {
    const match = text.match(/┌([A-Z]\d{3,5})┐(.*?)└\1┘/s);
    if (match) {
      return { markerId: match[1], content: match[2] };
    }
    return null;
  };

  const testCases = [
    {
      input: "Hello world",
      markerId: "T001",
      description: "Insert markers around text"
    },
    {
      input: "This is a test sentence",
      markerId: "P002",
      description: "Insert paragraph markers"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    // Test marker insertion
    const withMarkers = insertMarkers(testCase.input, testCase.markerId);
    const expectedWithMarkers = `┌${testCase.markerId}┐${testCase.input}└${testCase.markerId}┘`;
    
    if (withMarkers === expectedWithMarkers) {
      passed++;
      console.log(`✅ ${testCase.description} (insertion): "${testCase.input}" -> "${withMarkers}"`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description} (insertion): got "${withMarkers}", expected "${expectedWithMarkers}"`);
    }
    
    // Test marker removal
    const withoutMarkers = removeMarkers(withMarkers);
    if (withoutMarkers === testCase.input) {
      passed++;
      console.log(`✅ ${testCase.description} (removal): "${withMarkers}" -> "${withoutMarkers}"`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description} (removal): got "${withoutMarkers}", expected "${testCase.input}"`);
    }
    
    // Test marker extraction
    const extracted = extractMarkerContent(withMarkers);
    if (extracted && extracted.markerId === testCase.markerId && extracted.content === testCase.input) {
      passed++;
      console.log(`✅ ${testCase.description} (extraction): extracted "${extracted.content}" with ID "${extracted.markerId}"`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description} (extraction): failed to extract content`);
    }
  }

  return { passed, failed, total: testCases.length * 3 };
}

// Test hash generation for caching
function testHashGeneration() {
  // Simulate the hash function from the translator
  const simpleHash = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).toUpperCase();
  };
  
  const hashNode = (content: string, hashLength = 20, textLength = 80): string => {
    const trimmed = content.trim();
    const contentHash = simpleHash(trimmed);
    
    if (trimmed.length < textLength) {
      return trimmed;
    } else {
      return trimmed.slice(0, textLength) + "." + contentHash.slice(0, hashLength);
    }
  };

  const testCases = [
    {
      input: "Short text",
      description: "Short text returns as-is"
    },
    {
      input: "This is a very long piece of text that exceeds the maximum length threshold and should be truncated with a hash suffix to ensure uniqueness while keeping it manageable",
      description: "Long text gets truncated with hash"
    },
    {
      input: "",
      description: "Empty string"
    },
    {
      input: "   Whitespace padded   ",
      description: "Text with whitespace padding"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = hashNode(testCase.input);
    
    if (testCase.input.trim().length < 80) {
      // Should return trimmed input as-is
      if (result === testCase.input.trim()) {
        passed++;
        console.log(`✅ ${testCase.description}: "${testCase.input}" -> "${result}"`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: got "${result}", expected "${testCase.input.trim()}"`);
      }
    } else {
      // Should be truncated with hash
      if (result.length <= 100 && result.includes('.')) {
        passed++;
        console.log(`✅ ${testCase.description}: text truncated to ${result.length} chars with hash`);
      } else {
        failed++;
        console.log(`❌ ${testCase.description}: expected truncated text with hash, got "${result}"`);
      }
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test path manipulation for Starlight
function testStarlightPathPatching() {
  const patchPath = (
    originalPath: string,
    originalFileDir: string,
    translatedFileDir: string
  ): string => {
    if (!originalPath.startsWith('./')) {
      return originalPath; // Don't modify non-relative paths
    }
    
    // Calculate relative path from translated directory to original directory
    const pathSegments = originalFileDir.split('/');
    const translatedSegments = translatedFileDir.split('/');
    
    // Find common base
    let commonLength = 0;
    while (commonLength < Math.min(pathSegments.length, translatedSegments.length) &&
           pathSegments[commonLength] === translatedSegments[commonLength]) {
      commonLength++;
    }
    
    // Build relative path
    const upLevels = translatedSegments.length - commonLength;
    const downPath = pathSegments.slice(commonLength).join('/');
    
    let relativePath = '';
    for (let i = 0; i < upLevels; i++) {
      relativePath += '../';
    }
    relativePath += downPath;
    
    // Combine with original relative path
    const result = relativePath + originalPath.substring(1); // Remove the '.' from the beginning
    return result.replace('//', '/'); // Clean up double slashes
  };

  const testCases = [
    {
      originalPath: "./image.png",
      originalDir: "docs/src/content/docs",
      translatedDir: "docs/src/content/docs/fr",
      expected: "../image.png",
      description: "Image in French subdirectory"
    },
    {
      originalPath: "./assets/logo.svg",
      originalDir: "src/pages",
      translatedDir: "src/pages/es",
      expected: "../assets/logo.svg",
      description: "Asset in Spanish subdirectory"
    },
    {
      originalPath: "/absolute/path/image.png",
      originalDir: "docs",
      translatedDir: "docs/fr",
      expected: "/absolute/path/image.png",
      description: "Absolute path should not be modified"
    },
    {
      originalPath: "https://example.com/image.png",
      originalDir: "docs",
      translatedDir: "docs/fr",
      expected: "https://example.com/image.png",
      description: "URL should not be modified"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = testCase.originalPath.startsWith('./') 
      ? patchPath(testCase.originalPath, testCase.originalDir, testCase.translatedDir)
      : testCase.originalPath;
      
    if (result === testCase.expected) {
      passed++;
      console.log(`✅ ${testCase.description}: "${testCase.originalPath}" -> "${result}"`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: got "${result}", expected "${testCase.expected}"`);
    }
  }

  return { passed, failed, total: testCases.length };
}

// Test content chunking logic
function testContentChunking() {
  // Simulate content chunking for translation
  const chunkContent = (content: string, maxTokensPerChunk: number): string[] => {
    if (!content.trim()) return []; // Return empty array for empty content
    
    const words = content.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokens = 0;
    
    // Rough estimation: 1 token ≈ 0.75 words
    const estimateTokens = (text: string) => Math.ceil(text.length / 4);
    
    for (const word of words) {
      const wordTokens = estimateTokens(word);
      
      if (currentTokens + wordTokens > maxTokensPerChunk && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [word];
        currentTokens = wordTokens;
      } else {
        currentChunk.push(word);
        currentTokens += wordTokens;
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
    
    return chunks;
  };

  const testCases = [
    {
      content: "This is a short piece of text that should fit in one chunk.",
      maxTokens: 100,
      expectedChunks: 1,
      description: "Short content in single chunk"
    },
    {
      content: "This is a much longer piece of content that needs to be split into multiple chunks because it exceeds the maximum token limit per chunk. We want to test that the chunking algorithm works correctly and splits the content appropriately while maintaining readability and context.",
      maxTokens: 50,
      expectedChunks: 2,
      description: "Long content split into multiple chunks"
    },
    {
      content: "",
      maxTokens: 100,
      expectedChunks: 0,
      description: "Empty content"
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const chunks = chunkContent(testCase.content, testCase.maxTokens);
    
    if (chunks.length === testCase.expectedChunks) {
      passed++;
      console.log(`✅ ${testCase.description}: content split into ${chunks.length} chunks`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: got ${chunks.length} chunks, expected ${testCase.expectedChunks}`);
    }
    
    // Verify chunks don't exceed token limit (roughly)
    let allChunksValid = true;
    for (let i = 0; i < chunks.length; i++) {
      const estimatedTokens = Math.ceil(chunks[i].length / 4);
      if (estimatedTokens > testCase.maxTokens * 1.2) { // Allow 20% tolerance
        allChunksValid = false;
        break;
      }
    }
    
    if (allChunksValid) {
      passed++;
      console.log(`✅ ${testCase.description}: all chunks within token limits`);
    } else {
      failed++;
      console.log(`❌ ${testCase.description}: some chunks exceed token limits`);
    }
  }

  return { passed, failed, total: testCases.length * 2 };
}

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Markdown Processing Unit Tests");
  
  output.heading(2, "Testing translation markers");
  const markerResults = testTranslationMarkers();
  output.itemValue("Passed", markerResults.passed);
  output.itemValue("Failed", markerResults.failed);
  output.itemValue("Total", markerResults.total);
  
  output.heading(2, "Testing hash generation");
  const hashResults = testHashGeneration();
  output.itemValue("Passed", hashResults.passed);
  output.itemValue("Failed", hashResults.failed);
  output.itemValue("Total", hashResults.total);
  
  output.heading(2, "Testing Starlight path patching");
  const pathResults = testStarlightPathPatching();
  output.itemValue("Passed", pathResults.passed);
  output.itemValue("Failed", pathResults.failed);
  output.itemValue("Total", pathResults.total);
  
  output.heading(2, "Testing content chunking");
  const chunkResults = testContentChunking();
  output.itemValue("Passed", chunkResults.passed);
  output.itemValue("Failed", chunkResults.failed);
  output.itemValue("Total", chunkResults.total);
  
  // Summary
  const totalPassed = markerResults.passed + hashResults.passed + pathResults.passed + chunkResults.passed;
  const totalFailed = markerResults.failed + hashResults.failed + pathResults.failed + chunkResults.failed;
  const totalTests = markerResults.total + hashResults.total + pathResults.total + chunkResults.total;
  
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