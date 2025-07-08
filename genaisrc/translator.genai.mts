import { hash } from "crypto";
import { classify } from "@genaiscript/runtime";
import { mdast } from "@genaiscript/plugin-mdast";
import "mdast-util-mdx";
import "mdast-util-mdxjs-esm";
import "mdast-util-mdx-jsx";
import type {
  Node,
  Text,
  Heading,
  Paragraph,
  PhrasingContent,
  Yaml,
} from "mdast";
import { basename, dirname, join, relative } from "path";
import { URL } from "url";
import { xor } from "es-toolkit";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { FrontmatterWithTranslator } from "./src/types.mts";
import { FrontmatterWithTranslatorSchema } from "./src/schemas.mts";
import { resolveModels } from "./src/models.mts";

script({
  title: "Automatic Markdown Translations using GenAI",
  description:
    "This action uses GitHub Models and remark to incrementally translate markdown documents in your repository.",
  accept: ".md,.mdx",
  branding: {
    color: "yellow",
    icon: "globe",
  },
  parameters: {
    lang: {
      type: "string",
      default: "fr",
      description:
        "The ISO code(s) of the target language(s) for translation (comma-separated values).",
    },
    source: {
      type: "string",
      default: "en",
      description:
        "The ISO code of the source language for translation. Defaults to 'en' (English).",
    },
    instructions: {
      type: "string",
      description:
        "Additional prompting instructions that will be injected in the translation prompt.",
    },
    instructionsFile: {
      type: "string",
      description:
        "File containing additional prompting instructions that will be injected in the translation prompt.",
    },
    translationsDir: {
      type: "string",
      default: "translations",
      description:
        "Directory where the translations will be stored. Defaults to 'translations'.",
    },
    starlightDir: {
      type: "string",
      description: "Root directory for the Astro Starlight documentation.",
    },
    starlightBase: {
      type: "string",
      description: "Base path for the Astro Starlight documentation.",
    },
    force: {
      type: "boolean",
      default: false,
      description:
        "Force translation even if the file has already been translated.",
    },
  },
  tests: [
    {
      files: "test/markdown.md",
      keywords: ["paragraph", "heading"],
    },
    {
      files: "test/example-with-instructions.md",
      keywords: ["translator"],
    },
  ],
});

const HASH_TEXT_LENGTH = 80;
const HASH_LENGTH = 20;
const maxPromptPerFile = 5;
const minTranslationsThreshold = 0.9;
const maxTokensPerChunk = 3000;
const nodeTypes = ["text", "paragraph", "heading", "yaml"];
const MARKER_START = "┌";
const MARKER_END = "└";
type NodeType = Text | Paragraph | Heading | Yaml;
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

const isUri = (str: string): URL => {
  try {
    return new URL(str);
  } catch {
    return undefined;
  }
};

const hasMarker = (str: string): boolean => {
  return str.includes(MARKER_START) || str.includes(MARKER_END);
};

export default async function main() {
  const { dbg, output, vars } = env;
  const dbgn = host.logger(`ct:node`);
  const dbgc = host.logger(`ct:md`);
  const dbgo = host.logger(`ct:target`);
  const dbgt = host.logger(`ct:tree`);
  const dbge = host.logger(`ct:text`);
  const dbgm = host.logger(`ct:mdx`);
  const dbga = host.logger(`ct:source`);
  const dbgfm = host.logger(`ct:frontmatter`);
  const dbgp = host.logger(`ct:patch`);
  const parameters = vars as {
    lang?: string;
    source?: string;
    force?: boolean;
    starlightDir?: string;
    starlightBase?: string;
    instructions?: string;
    instructionsFile?: string;
    translationsDir?: string;
  };

  output.heading(1, "Continuous Translation");

  const { force, translationsDir } = parameters;
  dbg(`translationsDir: %s`, translationsDir);
  let { instructions } = parameters;
  const source = parameters.source;
  const sourceInfo = await resolveModels(source);
  const instructionsFile = parameters.instructionsFile
    ? MD.content(await workspace.readText(parameters.instructionsFile))
    : undefined;
  const starlightDir = parameters.starlightDir
    ? `${parameters.starlightDir}/src/content/docs`
    : undefined;
  dbg(`starlightDir: %s`, starlightDir);
  const starlightBase = parameters.starlightBase;
  dbg(`starlightBase: %s`, starlightBase);
  if (starlightBase && !starlightDir) {
    throw new Error(
      `"starlightDir" must be defined when "starlightBase" is defined.`
    );
  }
  const starlightBaseRx = starlightBase
    ? new RegExp(`^/${starlightBase}/`)
    : new RegExp(`^/`);
  dbg(`starlightbase rx: %s`, starlightBaseRx);
  const langs = vars.lang
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  output.itemValue(`locales`, langs.join(", "));
  langs.forEach((l) => resolveModels(l)); // validate languages

  const ignorer = await parsers.ignore(".ctignore");
  dbg(`ignorer: %s`, ignorer ? "loaded" : "no .ctignore found");
  dbg(
    `files (before filter): %O`,
    env.files.map((f) => f.filename)
  );
  const files = env.files
    .filter((f) => ignorer([f.filename]).length)
    // Filter files that match the ISO language code pattern in the filename
    .filter(({ filename }) => !/\.\w\w(-\w\w\w?)?\.mdx?$/i.test(filename))
    .filter(({ filename }) => !/\/\w\w(-\w\w\w?)?\//i.test(filename));
  if (!files.length) cancel("No files or not matching languages selected.");

  const fileTokens: Record<string, number> = {};
  for (const file of files) {
    const tokens = await tokenizers.count(file.content);
    output.itemValue(file.filename, tokens + "t");
    fileTokens[file.filename] = tokens;
  }

  const usageFn = join(translationsDir, `usage.jsonl`);

  for (const to of langs) {
    const langInfo = await resolveModels(to);
    const lang = langInfo.name;
    const translationModel = langInfo.models.translation;
    const classifyModel = langInfo.models.classify;
    output.heading(2, `Translating Markdown files to ${lang} (${to})`);
    const translationCacheFilename = join(
      translationsDir,
      `${to.toLowerCase()}.json`
    );
    dbg(`cache: %s`, translationCacheFilename);
    output.itemValue(`translation model`, translationModel);
    output.itemValue(`validation model`, classifyModel);
    output.itemValue("cache", translationCacheFilename);
    // hash -> text translation
    const translationCache: Record<string, string> = force
      ? {}
      : (await workspace.readJSON(translationCacheFilename)) || {};
    dbgc(`translation cache: %O`, translationCache);

    for (const file of files) {
      const { filename } = file;
      output.heading(3, `${filename}`);

      const logUsage = async (
        stage: "translate" | "validate",
        model: string,
        usage: RunPromptUsage
      ) => {
        if (usageFn)
          await workspace.appendText(
            usageFn,
            JSON.stringify({
              filename,
              lang: to,
              tokens: fileTokens[filename] || 0,
              stage: stage,
              model,
              date: new Date().toISOString(),
              ...(usage || {}),
            }) + "\n"
          );
      };

      const { visit, parse, stringify, SKIP } = await mdast({
        mdx: /\.mdx$/i.test(filename),
      });
      const hashNode = (node: Node | string) => {
        if (typeof node === "object") {
          node = structuredClone(node);
          visit(node, (node) => delete node.position);
        }
        const text = (
          typeof node === "string"
            ? node
            : stringify({ type: "root", children: [node as any] })
        ).trim();
        const chunkHash = hash("sha-256", text);
        if (text.length < HASH_TEXT_LENGTH) return text;
        else
          return (
            text.slice(0, HASH_TEXT_LENGTH) +
            "." +
            chunkHash.slice(0, HASH_LENGTH).toUpperCase()
          );
      };

      const chunkNodesByTokens = async (
        llmHashTodos: Set<string>,
        llmHashes: Record<string, string>,
        nodes: Record<string, NodeType>
      ): Promise<string[][]> => {
        const chunks: string[][] = [];
        let currentChunk: string[] = [];
        let currentTokenCount = 0;

        for (const llmHash of llmHashTodos) {
          const hash = llmHashes[llmHash];
          const node = nodes[hash];
          if (!node) continue;

          // Estimate token count for this node
          const nodeText = typeof node === 'string' ? node : 
            (node.type === 'text' ? node.value : 
             stringify({ type: 'root', children: [node as any] }));
          const nodeTokens = await tokenizers.count(nodeText);

          // If adding this node would exceed the limit and we have items, start a new chunk
          if (currentTokenCount + nodeTokens > maxTokensPerChunk && currentChunk.length > 0) {
            chunks.push([...currentChunk]);
            currentChunk = [];
            currentTokenCount = 0;
          }

          currentChunk.push(llmHash);
          currentTokenCount += nodeTokens;
        }

        // Add the last chunk if it has items
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }

        return chunks;
      };

      const starlight = starlightDir && filename.startsWith(starlightDir);
      dbg(`starlight: %s`, starlight);
      const translationFn = starlight
        ? filename.replace(starlightDir, join(starlightDir, to.toLowerCase()))
        : path.changeext(filename, `.${to.toLowerCase()}.md`);
      dbg(`translation %s`, translationFn);

      const patchFn = (fn: string, trailingSlash?: boolean) => {
        if (typeof fn === "string" && /^\./.test(fn) && starlight) {
          // given an local image path fn (like ./image.png) relative to the original file (filename),
          // path it to the translation file (translationFn).
          // Calculate the relative path from the translation file's directory to the original file's directory,
          // then join it with the local image path to get the correct relative path for the translation
          const originalDir = dirname(filename);
          const translationDir = dirname(translationFn);
          const relativeToOriginal = relative(translationDir, originalDir);
          let r = join(relativeToOriginal, fn);
          if (trailingSlash && !r.endsWith("/")) r += "/";
          dbgp(`patching %s -> %s`, fn, r);
          return r;
        }
        return fn;
      };

      try {
        let content = file.content;
        dbgc(`md: %s`, content);

        // normalize content
        dbgc(`normalizing content`);
        content = stringify(parse(content));

        // parse to tree
        dbgc(`parsing %s`, filename);
        const root = parse(content);
        dbgt(`original %O`, root.children);

        // Extract instructions from frontmatter if not provided via parameters
        const frontmatterNode = root.children.find(
          (child) => child.type === "yaml"
        );
        const frontmatter = parsers.YAML(frontmatterNode?.value, {
          schema: FrontmatterWithTranslatorSchema,
        }) as FrontmatterWithTranslator;
        const { translator } = frontmatter || {};
        dbg(`frontmatter config: %O`, translator);
        if (!instructions && translator?.instructions) {
          instructions = translator.instructions;
          dbg(`frontmatter instructions: %s`, instructions);
        }
        // remove the translator node
        if (translator) {
          delete frontmatter.translator;
          frontmatterNode.value = YAML.stringify(frontmatter);
          dbg(`patched frontmatter: %s`, frontmatterNode.value);
          content = stringify(root);
        }

        // collect original nodes nodes
        const nodes: Record<string, NodeType> = {};
        visit(root, nodeTypes, (node) => {
          const hash = hashNode(node);
          dbgn(`%s -> %s`, node.type, hash);
          nodes[hash] = node as NodeType;
        });

        dbg(`nodes: %d`, Object.keys(nodes).length);

        const llmHashes: Record<string, string> = {};
        const llmHashTodos = new Set<string>();
        let nTranslatable = 0;

        // apply translations and mark untranslated nodes with id
        let translated = structuredClone(root);
        visit(translated, nodeTypes, (node) => {
          const nhash = hashNode(node);
          const translation = translationCache[nhash];
          if (translation) {
            dbgo(`%s`, nhash);
            nTranslatable++;
            if (node.type === "text") node.value = translation;
            else if (node.type === "heading" || node.type === "paragraph") {
              dbgo(`%s: %s -> %s`, node.type, nhash, translation);
              try {
                const newNodes = parse(translation)
                  .children as PhrasingContent[];
                node.children.splice(0, node.children.length, ...newNodes);
                return SKIP; // don't process children of paragraphs
              } catch (error) {
                output.error(`error parsing paragraph translation`, error);
                output.fence(node, "json");
                output.fence(translation);
              }
            }
          } else {
            dbgo(`missing %s %s`, node.type, nhash);
            // mark untranslated nodes with a unique identifier
            if (node.type === "text") {
              if (
                !/^\s*[0-9-_.,:;<>\]\[{}\(\)…\s]+\s*$/.test(node.value) &&
                !isUri(node.value)
              ) {
                dbga(`text node: %s`, nhash);
                // compress long hash into LLM friendly short hash
                const llmHash = `T${Object.keys(llmHashes)
                  .length.toString()
                  .padStart(3, "0")}`;
                llmHashes[llmHash] = nhash;
                llmHashTodos.add(llmHash);
                nTranslatable++;
                node.value = `┌${llmHash}┐${node.value}└${llmHash}┘`;
              }
            } else if (node.type === "paragraph" || node.type === "heading") {
              dbga(`paragraph/heading node: %s`, nhash);
              const llmHash = `P${Object.keys(llmHashes)
                .length.toString()
                .padStart(3, "0")}`;
              llmHashes[llmHash] = nhash;
              llmHashTodos.add(llmHash);
              nTranslatable++;
              node.children.unshift({
                type: "text",
                value: `┌${llmHash}┐`,
              } as Text);
              node.children.push({
                type: "text",
                value: `└${llmHash}┘`,
              });
              return SKIP; // don't process children of paragraphs
            } else if (node.type === "yaml") {
              dbgfm(`%s`, node.value);
              const data = parsers.YAML(node.value);
              if (data && starlight) {
                if (data.hero) {
                  if (typeof data.hero.tagline === "string") {
                    const nhash = hashNode(data.hero.tagline);
                    const tr = translationCache[nhash];
                    nTranslatable++;
                    if (tr) data.hero.tagline = tr;
                    else {
                      const llmHash = `T${Object.keys(llmHashes)
                        .length.toString()
                        .padStart(3, "0")}`;
                      llmHashes[llmHash] = nhash;
                      llmHashTodos.add(llmHash);
                      data.hero.tagline = `┌${llmHash}┐${data.hero.tagline}└${llmHash}┘`;
                    }
                  }
                  if (Array.isArray(data.hero.actions)) {
                    for (const action of data.hero.actions) {
                      if (typeof action.text === "string") {
                        const nhash = hashNode(action.text);
                        const tr = translationCache[nhash];
                        dbga(`hero.action: %s -> %s`, nhash, tr);
                        nTranslatable++;
                        if (tr) action.text = tr;
                        else {
                          const llmHash = `T${Object.keys(llmHashes)
                            .length.toString()
                            .padStart(3, "0")}`;
                          llmHashes[llmHash] = nhash;
                          llmHashTodos.add(llmHash);
                          action.text = `┌${llmHash}┐${action.text}└${llmHash}┘`;
                        }
                      }
                    }
                  }
                }
                if (data?.cover?.image) {
                  data.cover.image = patchFn(data.cover.image);
                  dbga(`cover.image: %s`, data.cover.image);
                }
              }
              for (const field of FRONTMATTER_FIELDS.filter(
                (field) => typeof data[field] === "string"
              )) {
                const nhash = hashNode(data[field]);
                const tr = translationCache[nhash];
                dbga(`%s: %s -> %s`, field, nhash, tr);
                nTranslatable++;
                if (tr) data[field] = tr;
                else {
                  const llmHash = `T${Object.keys(llmHashes)
                    .length.toString()
                    .padStart(3, "0")}`;
                  llmHashes[llmHash] = nhash;
                  llmHashTodos.add(llmHash);
                  data[field] = `┌${llmHash}┐${data[field]}└${llmHash}┘`;
                }
              }
              node.value = YAML.stringify(data);
              dbgfm(`patched: %s`, node.value);
              return SKIP;
            } else {
              dbga(`untranslated node type: %s`, node.type);
            }
          }
        });

        // patch images and esm imports
        visit(translated, ["mdxJsxFlowElement"], (node) => {
          const flow = node as MdxJsxFlowElement;
          for (const attribute of flow.attributes || []) {
            if (
              attribute.type === "mdxJsxAttribute" &&
              attribute.name === "title"
            ) {
              // collect title attributes
              dbgm(`attribute title: %s`, attribute.value);
              let title = attribute.value;
              const nhash = hashNode(title);
              const tr = translationCache[nhash];
              nTranslatable++;
              if (tr) {
                title = tr;
              } else {
                const llmHash = `T${Object.keys(llmHashes)
                  .length.toString()
                  .padStart(3, "0")}`;
                llmHashes[llmHash] = nhash;
                llmHashTodos.add(llmHash);
                title = `┌${llmHash}┐${title}└${llmHash}┘`;
              }
              attribute.value = title;
              return SKIP;
            }
          }
        });

        dbgt(`translated %O`, translated.children);
        let attempts = 0;
        let lastLLmHashTodos = llmHashTodos.size + 1;
        while (
          llmHashTodos.size &&
          llmHashTodos.size < lastLLmHashTodos &&
          attempts < maxPromptPerFile
        ) {
          attempts++;
          output.itemValue(`missing translations`, llmHashTodos.size);
          dbge(`todos: %o`, Array.from(llmHashTodos));
          const contentMix = stringify(translated);
          dbgc(`translatable content: %s`, contentMix);

          // Check if we need to chunk the content
          const contentTokens = await tokenizers.count(contentMix);
          const shouldChunk = contentTokens > maxTokensPerChunk;
          
          if (shouldChunk) {
            // Split todos into chunks
            const chunks = await chunkNodesByTokens(
              llmHashTodos,
              llmHashes,
              nodes
            );
            
            output.itemValue(`translation chunks`, chunks.length);
            
            for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
              const chunk = chunks[chunkIndex];
              if (chunk.length === 0) continue;
              
              // Create a subset of the translated content for this chunk
              const chunkLlmHashTodos = new Set(chunk);
              const chunkTranslated = structuredClone(translated);
              
              // Remove markers for nodes not in this chunk
              visit(chunkTranslated, nodeTypes, (node) => {
                if (node.type === "text") {
                  // Remove markers for hashes not in this chunk
                  let updatedValue = node.value;
                  const markerRegex = /┌([A-Z]\d{3,5})┐(.*?)└\1┘/g;
                  let match;
                  while ((match = markerRegex.exec(node.value)) !== null) {
                    const hash = match[1];
                    if (!chunkLlmHashTodos.has(hash)) {
                      updatedValue = updatedValue.replace(match[0], match[2]);
                    }
                  }
                  node.value = updatedValue;
                } else if (node.type === "paragraph" || node.type === "heading") {
                  // Handle paragraph/heading nodes
                  for (const child of node.children) {
                    if (child.type === "text") {
                      let updatedValue = child.value;
                      const markerRegex = /┌([A-Z]\d{3,5})┐/g;
                      let match;
                      while ((match = markerRegex.exec(child.value)) !== null) {
                        const hash = match[1];
                        if (!chunkLlmHashTodos.has(hash)) {
                          updatedValue = updatedValue.replace(match[0], '');
                        }
                      }
                      const endMarkerRegex = /└([A-Z]\d{3,5})┘/g;
                      while ((match = endMarkerRegex.exec(child.value)) !== null) {
                        const hash = match[1];
                        if (!chunkLlmHashTodos.has(hash)) {
                          updatedValue = updatedValue.replace(match[0], '');
                        }
                      }
                      child.value = updatedValue;
                    }
                  }
                }
              });
              
              const chunkContentMix = stringify(chunkTranslated);
              dbgc(`chunk ${chunkIndex + 1}/${chunks.length} content: %s`, chunkContentMix);
              
              // run prompt to generate translations for this chunk
              output.item(`generating translations for chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} nodes)`);
              const { error, fences, text, usage } = await runPrompt(
                async (ctx) => {
                  const originalRef = ctx.def("ORIGINAL", file.content, {
                    lineNumbers: false,
                  });
                  const translatedRef = ctx.def("TRANSLATED", chunkContentMix, {
                    lineNumbers: false,
                  });
                  ctx.$`You are an expert at translating technical documentation into ${lang} (${to}).
          
          ## Task
          Your task is to translate a Markdown (GFM) document to ${lang} (${to}) while preserving the structure and formatting of the original document.
          You will receive the original document as a variable named ${originalRef} and the currently translated document as a variable named ${translatedRef}.

          Each Markdown AST node in the translated document that has not been translated yet will be enclosed with a unique identifier in the form 
          of \`┌node_identifier┐\` at the start and \`└node_identifier┘\` at the end of the node.
          You should translate the content of each these nodes individually.
          Example:

          \`\`\`markdown
          ┌T001┐
          This is the content to be translated.
          └T001┘

          This is some other content that does not need translation.

          ┌T002┐
          This is another piece of content to be translated.
          └T002┘
          \`\`\`

          ## Output format

          Respond using code regions where the language string is the HASH value
          For example:
          
          \`\`\`T001
          translated content of text enclosed in T001 here (only T001 content!)
          \`\`\`

          \`\`\`T002
          translated content of text enclosed in T002 here (only T002 content!)
          \`\`\`

          \`\`\`T003
          translated content of text enclosed in T003 here (only T003 content!)
          \`\`\`
          ...

          ## Instructions

          - Be extremely careful about the HASH names. They are unique identifiers for each node and should not be changed.
          - Always use code regions to respond with the translated content. 
          - Do not translate the text outside of the HASH tags.
          - Do not change the structure of the document.
          - As much as possible, maintain the original formatting and structure of the document.
          - Do not translate inline code blocks, code blocks, or any other code-related content.
          - Use ' instead of '
          - Always make sure that the URLs are not modified by the translation.
          - Translate each node individually, preserving the original meaning and context.
          - If you are unsure about the translation, skip the translation.
          ${instructions || ""}
          ${instructionsFile || ""}`.role("system");
                },
                {
                  model: translationModel,
                  responseType: "text",
                  systemSafety: true,
                  system: [],
                  cache: true,
                  label: `translating ${filename} chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} nodes)`,
                }
              );
              logUsage("translate", translationModel, usage);

              if (error) {
                // are we out of tokens?
                if (/429/.test(error.message)) {
                  output.error(`Rate limit exceeded: ${error.message}`);
                  cancel(`rate limit exceeded`);
                }

                output.error(`Error translating ${filename} chunk ${chunkIndex + 1}: ${error.message}`);
                break;
              }

              output.itemValue(`chunk ${chunkIndex + 1} translations`, fences.length);

              if (!fences.length) {
                output.warn(`No translations found in chunk ${chunkIndex + 1}`);
                output.fence(text, "markdown");
                continue;
              }

              // collect translations from this chunk
              for (const fence of fences) {
                const llmHash = fence.language;
                if (llmHashTodos.has(llmHash)) {
                  llmHashTodos.delete(llmHash);
                  const hash = llmHashes[llmHash];
                  dbg(`translation: %s - %s`, llmHash, hash);
                  let chunkTranslated = fence.content.replace(/\r?\n$/, "").trim();
                  const node = nodes[hash];
                  dbg(`original node: %O`, node);
                  if (node?.type === "text" && /\s$/.test(node.value)) {
                    // preserve trailing space if original text had it
                    dbg(`patch trailing space for %s`, hash);
                    chunkTranslated += " ";
                  }
                  chunkTranslated = chunkTranslated
                    .replace(/┌[A-Z]\d{3,5}┐/g, "")
                    .replace(/└[A-Z]\d{3,5}┘/g, "");
                  dbg(`content: %s`, chunkTranslated);
                  translationCache[hash] = chunkTranslated;
                }
              }
            }
          } else {
            // Original single-pass translation for smaller files

          // run prompt to generate translations
          output.item(`generating translations`);
          const { error, fences, text, usage } = await runPrompt(
            async (ctx) => {
              const originalRef = ctx.def("ORIGINAL", file.content, {
                lineNumbers: false,
              });
              const translatedRef = ctx.def("TRANSLATED", contentMix, {
                lineNumbers: false,
              });
              ctx.$`You are an expert at translating technical documentation into ${lang} (${to}).
      
      ## Task
      Your task is to translate a Markdown (GFM) document to ${lang} (${to}) while preserving the structure and formatting of the original document.
      You will receive the original document as a variable named ${originalRef} and the currently translated document as a variable named ${translatedRef}.

      Each Markdown AST node in the translated document that has not been translated yet will be enclosed with a unique identifier in the form 
      of \`┌node_identifier┐\` at the start and \`└node_identifier┘\` at the end of the node.
      You should translate the content of each these nodes individually.
      Example:

      \`\`\`markdown
      ┌T001┐
      This is the content to be translated.
      └T001┘

      This is some other content that does not need translation.

      ┌T002┐
      This is another piece of content to be translated.
      └T002┘
      \`\`\`

      ## Output format

      Respond using code regions where the language string is the HASH value
      For example:
      
      \`\`\`T001
      translated content of text enclosed in T001 here (only T001 content!)
      \`\`\`

      \`\`\`T002
      translated content of text enclosed in T002 here (only T002 content!)
      \`\`\`

      \`\`\`T003
      translated content of text enclosed in T003 here (only T003 content!)
      \`\`\`
      ...

      ## Instructions

      - Be extremely careful about the HASH names. They are unique identifiers for each node and should not be changed.
      - Always use code regions to respond with the translated content. 
      - Do not translate the text outside of the HASH tags.
      - Do not change the structure of the document.
      - As much as possible, maintain the original formatting and structure of the document.
      - Do not translate inline code blocks, code blocks, or any other code-related content.
      - Use ' instead of ’
      - Always make sure that the URLs are not modified by the translation.
      - Translate each node individually, preserving the original meaning and context.
      - If you are unsure about the translation, skip the translation.
      ${instructions || ""}
      ${instructionsFile || ""}`.role("system");
            },
            {
              model: translationModel,
              responseType: "text",
              systemSafety: true,
              system: [],
              cache: true,
              label: `translating ${filename} (${llmHashTodos.size} nodes)`,
            }
          );
          logUsage("translate", translationModel, usage);

          if (error) {
            // are we out of tokens?
            if (/429/.test(error.message)) {
              output.error(`Rate limit exceeded: ${error.message}`);
              cancel(`rate limit exceeded`);
            }

            output.error(`Error translating ${filename}: ${error.message}`);
            break;
          }

          output.itemValue(`translations`, fences.length);

          if (!fences.length) {
            output.warn(`No translations found`);
            output.fence(text, "markdown");
            break;
          }

          // collect translations
          for (const fence of fences) {
            const llmHash = fence.language;
            if (llmHashTodos.has(llmHash)) {
              llmHashTodos.delete(llmHash);
              const hash = llmHashes[llmHash];
              dbg(`translation: %s - %s`, llmHash, hash);
              let chunkTranslated = fence.content.replace(/\r?\n$/, "").trim();
              const node = nodes[hash];
              dbg(`original node: %O`, node);
              if (node?.type === "text" && /\s$/.test(node.value)) {
                // preserve trailing space if original text had it
                dbg(`patch trailing space for %s`, hash);
                chunkTranslated += " ";
              }
              chunkTranslated = chunkTranslated
                .replace(/┌[A-Z]\d{3,5}┐/g, "")
                .replace(/└[A-Z]\d{3,5}┘/g, "");
              dbg(`content: %s`, chunkTranslated);
              translationCache[hash] = chunkTranslated;
            }
          }
          }

          lastLLmHashTodos = llmHashTodos.size;
        }

        // apply translations
        translated = structuredClone(root);

        // apply translations
        const unresolvedTranslations = new Set<string>();
        visit(translated, nodeTypes, (node) => {
          if (node.type === "yaml") {
            const data = parsers.YAML(node.value);
            if (data) {
              if (starlight) {
                if (data?.hero?.image?.file) {
                  data.hero.image.file = patchFn(data.hero.image.file);
                  dbgo(`yaml hero image: %s`, data.hero.image.file);
                }
                if (Array.isArray(data?.hero?.actions)) {
                  data.hero.actions.forEach((action) => {
                    if (typeof action.link === "string") {
                      action.link = patchFn(
                        action.link.replace(
                          starlightBaseRx,
                          `/${starlightBase || ""}/${to.toLowerCase()}/`
                        )
                      );
                      dbgo(`yaml hero action link: %s`, action.link);
                    }
                    if (typeof action.text === "string") {
                      const nhash = hashNode(action.text);
                      const tr = translationCache[nhash];
                      dbgo(`yaml hero.action: %s -> %s`, nhash, tr);
                      if (tr) action.text = tr;
                      else unresolvedTranslations.add(nhash);
                    }
                    if (action?.image?.file) {
                      action.image.file = patchFn(action.image.file);
                      dbgo(`yaml hero action image: %s`, action.image.file);
                    }
                  });
                }
                if (data?.cover?.image) {
                  data.cover.image = patchFn(data.cover.image);
                  dbgo(`yaml cover image: %s`, data.cover.image);
                }
              }
              if (data.hero && typeof data.hero.tagline === "string") {
                const nhash = hashNode(data.hero.tagline);
                const tr = translationCache[nhash];
                if (tr) data.hero.tagline = tr;
                else unresolvedTranslations.add(nhash);
              }
              for (const field of FRONTMATTER_FIELDS.filter(
                (field) => typeof data[field] === "string"
              )) {
                const nhash = hashNode(data[field]);
                const tr = translationCache[nhash];
                dbgo(`yaml %s: %s -> %s`, field, nhash, tr);
                if (tr) data[field] = tr;
                else unresolvedTranslations.add(nhash);
              }
              node.value = YAML.stringify(data);
              return SKIP;
            }
          } else {
            const nhash = hashNode(node);
            const translation = translationCache[nhash];
            if (translation) {
              if (node.type === "text") {
                dbgo(`%s -> %s`, nhash, translation);
                node.value = translation;
              } else if (node.type === "paragraph" || node.type === "heading") {
                dbgo(`%s: %s -> %s`, node.type, nhash, translation);
                try {
                  const newNodes = parse(translation)
                    .children as PhrasingContent[];
                  node.children.splice(0, node.children.length, ...newNodes);
                  return SKIP;
                } catch (error) {
                  output.error(`error parsing paragraph translation`, error);
                  output.fence(node, "json");
                  output.fence(translation);
                }
              } else {
                dbg(`untranslated node type: %s`, node.type);
              }
            } else unresolvedTranslations.add(nhash);
          }
        });

        // patch images and esm imports
        visit(translated, ["mdxjsEsm", "image"], (node) => {
          if (node.type === "image") {
            node.url = patchFn(node.url);
            return SKIP;
          } else if (node.type === "mdxjsEsm") {
            // path local imports
            const rx =
              /^(import|\})\s*(.*)\s+from\s+(?:\"|')(\.?\.\/.*)(?:\"|');?$/gm;
            node.value = node.value.replace(rx, (m, k, i, p) => {
              const pp = patchFn(p);
              const r =
                k === "}" ? `} from "${pp}";` : `import ${i} from "${pp}";`;
              dbgo(`import: %s -> %s`, m, r);
              return r;
            });
            return SKIP;
          }
        });

        visit(translated, ["mdxJsxFlowElement"], (node) => {
          const flow = node as MdxJsxFlowElement;
          for (const attribute of flow.attributes || []) {
            if (
              attribute.type === "mdxJsxAttribute" &&
              attribute.name === "title"
            ) {
              const nhash = hashNode(attribute.value);
              const tr = translationCache[nhash];
              if (tr) {
                dbgo(`%s -> %s`, nhash, tr);
                attribute.value = tr;
              } else unresolvedTranslations.add(nhash);
            }
          }
        });

        // patch links
        if (starlight) {
          visit(translated, "link", (node) => {
            if (starlightBaseRx.test(node.url)) {
              node.url = patchFn(
                node.url.replace(starlightBaseRx, "../"),
                true
              );
            }
          });
        }

        if (unresolvedTranslations.size) {
          output.itemValue(`unresolved translations`, unresolvedTranslations);
          Array.from(unresolvedTranslations).forEach((t) => output.fence(t));
        }

        dbgt(`stringifying %O`, translated.children);
        let contentTranslated = await stringify(translated);

        const nTranslations = Object.keys(llmHashes).length;
        if (
          unresolvedTranslations.size > 5 &&
          (nTranslations - unresolvedTranslations.size) / nTranslations <
            minTranslationsThreshold
        ) {
          output.warn(`not enough translations, try to translate more.`);
          output.fence(contentTranslated, "markdown");
          continue;
        }

        if (content === contentTranslated) {
          output.warn(`Unable to translate anything, skipping file.`);
          continue;
        }

        // validate it stills parses as Markdown
        try {
          parse(contentTranslated);
        } catch (error) {
          output.error(`Translated content is not valid Markdown`, error);
          output.diff(contentTranslated, content);
          continue;
        }

        // validate all external links
        // have same domain
        {
          const originalLinks = new Set<string>();
          visit(root, "link", (node) => {
            if (isUri(node.url)) {
              originalLinks.add(node.url);
            }
          });
          const translatedLinks = new Set<string>();
          visit(translated, "link", (node) => {
            if (isUri(node.url)) {
              translatedLinks.add(node.url);
            }
          });
          const diffLinks = xor(
            Array.from(originalLinks),
            Array.from(translatedLinks)
          );
          if (diffLinks.length) {
            output.warn(`some links have changed`);
            output.fence(diffLinks, "yaml");
          }
        }

        if (attempts) {
          // judge quality is good enough
          const res = await classify(
            (ctx) => {
              ctx.$`You are an expert at judging the quality of translations. 
          Your task is to determine the quality of the translation of a Markdown document from ${
            sourceInfo.name
          } (${source}) to ${lang} (${to}).
          The original document is in ${ctx.def(
            "ORIGINAL",
            content
          )}, and the translated document is provided in ${ctx.def(
                "TRANSLATED",
                contentTranslated,
                { lineNumbers: true }
              )} (line numbers were added).`.role("system");
            },
            {
              ok: `Translation is faithful to the original document and conveys the same meaning.`,
              bad: `Translation is of low quality or has a different meaning from the original.`,
            },
            {
              label: `judge translation ${to} ${basename(filename)}`,
              explanations: true,
              cache: true,
              systemSafety: true,
              model: classifyModel,
            }
          );
          logUsage("validate", classifyModel, res.usage);

          // are we out of tokens?
          if (/429/.test(res.error)) {
            output.error(`Rate limit exceeded: ${res.error}`);
            cancel(`rate limit exceeded`);
          }

          output.resultItem(
            res.label === "ok",
            `translation validation: ${res.label}`
          );
          if (res.label !== "ok") {
            output.fence(res.answer);
            output.diff(content, contentTranslated);
            continue;
          }
        }

        // apply translations and save
        dbgc(`translated: %s`, contentTranslated);
        dbg(`writing translation to %s`, translationFn);

        await workspace.writeText(translationFn, contentTranslated);
        await workspace.writeText(
          translationCacheFilename,
          JSON.stringify(translationCache, null, 2)
        );

        output.resultItem(
          true,
          `translated chunks: ${nTranslatable}, untranslated: ${unresolvedTranslations.size}`
        );
      } catch (error) {
        output.error(error);
        break;
      }
    }
  }
}
