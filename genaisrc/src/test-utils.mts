// Test utilities for offline testing without external API dependencies

import emojiRegex from "emoji-regex-xs";

/**
 * Utility functions extracted from translator.genai.mts for unit testing
 */

const IGNORE_RX = /^\s*[0-9-"'`=+\/~_.,:;<>\]\[{}\(\)…\s]+\s*$/;
const EMOJI_RX = emojiRegex();

export const isUri = (str: string): URL => {
  try {
    return new URL(str);
  } catch {
    return undefined;
  }
};

export const isTranslatable = (text: string): boolean =>
  !IGNORE_RX.test(text) && !isUri(text) && !!text.replaceAll(EMOJI_RX, "");

export const hasMarker = (text: string): boolean => {
  const MARKER_START = "┌";
  const MARKER_END = "└";
  return text.includes(MARKER_START) && text.includes(MARKER_END);
};

export const FRONTMATTER_FIELDS = [
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

/**
 * Mock translation cache for testing
 */
export class MockTranslationCache {
  private cache: Record<string, string> = {};

  set(hash: string, translation: string): void {
    this.cache[hash] = translation;
  }

  get(hash: string): string | undefined {
    return this.cache[hash];
  }

  clear(): void {
    this.cache = {};
  }

  size(): number {
    return Object.keys(this.cache).length;
  }

  entries(): [string, string][] {
    return Object.entries(this.cache);
  }
}

/**
 * Mock filesystem for testing
 */
export class MockFileSystem {
  private files: Record<string, string> = {};

  writeFile(path: string, content: string): void {
    this.files[path] = content;
  }

  readFile(path: string): string | undefined {
    return this.files[path];
  }

  exists(path: string): boolean {
    return path in this.files;
  }

  clear(): void {
    this.files = {};
  }

  listFiles(): string[] {
    return Object.keys(this.files);
  }
}

/**
 * Test data generators
 */
export const createTestMarkdown = (content: string): string => `# Test Document

${content}

## End of Test
`;

export const createTestFrontmatter = (translator?: any): string => {
  const fm = translator ? { translator } : {};
  return `---
title: "Test Document"
description: "A test document for translation"
${translator ? `translator:\n  instructions: "${translator.instructions}"` : ''}
---

# Test Content

This is test content for translation.
`;
};