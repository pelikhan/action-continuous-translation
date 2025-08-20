import { hash } from "crypto";
import emojiRegex from "emoji-regex-xs";
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
  Parent,
} from "mdast";
import { basename, dirname, extname, join, relative } from "path";
import { URL } from "url";
import { xor } from "es-toolkit";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { FrontmatterWithTranslator } from "./src/types.mts";
import { FrontmatterWithTranslatorSchema } from "./src/schemas.mts";
import { resolveModels } from "./src/models.mts";
import { prettyTokens } from "@genaiscript/core";

script({
  title: "Automatic Markdown Translations using GenAI",
  description:
    "This action uses GitHub Models and remark to incrementally translate markdown documents in your repository.",
  accept: ".md,.mdx",
  branding: {
    color: "yellow",
    icon: "globe",
  },
  disableChatPreview: true,
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
    filenameTemplate: {
      type: "string",
      default: "{{dirname}}/{{basename}}.{{lang}}{{extname}}",
      description: "Template (jinja) for the translated file names.",
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
    glossaryFile: {
      type: "string",
      description: "A markdown file containing the glossary of the project",
    },
    maxTranslationTokens: {
      type: "number",
      description:
        "Maximum number of tokens to process in a translation LLM call.",
      default: 8000,
    },
    maxValidationTokens: {
      type: "number",
      description:
        "Maximum number of tokens to process in a validation LLM call.",
      default: 2000,
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

const IGNORE_RX = /^\s*[0-9-"'`=+\/~_.,:;<>\]\[{}\(\)…\s]+\s*$/;
const EMOJI_RX = emojiRegex();
const isTranslatable = (text: string) =>
  !IGNORE_RX.test(text) && !isUri(text) && !!text.replaceAll(EMOJI_RX, "");
const hasTranslatableTextChildren = (
  node: Parent // list of links with untranslatable text
) =>
  node.children.length > 1 &&
  !node.children.every(
    (c) =>
      c.type === "link" ||
      c.type === "linkReference" ||
      (c.type === "text" && !isTranslatable(c.value))
  );
const HASH_TEXT_LENGTH = 80;
const HASH_LENGTH = 20;
const maxPromptPerFile = 5;
const minTranslationsThreshold = 0.7;
const nodeTypes = ["text", "paragraph", "heading", "yaml", "image"];
const MARKER_START = "┌";
const MARKER_END = "└";

const hasMarker = (text: string) => {
  return text.includes(MARKER_START) && text.includes(MARKER_END);
};

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

export default async function main() {
  const { output, vars } = env;
  const dbg = host.logger(`ct`);
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
    starlightDir?: string;
    starlightBase?: string;
    instructions?: string;
    instructionsFile?: string;
    translationsDir?: string;
    glossaryFile?: string;
    filenameTemplate?: string;
    maxTranslationTokens?: number;
    maxValidationTokens?: number;
  };

  output.heading(1, "Continuous Translation");

  const {
    translationsDir,
    glossaryFile,
    filenameTemplate,
    maxTranslationTokens,
    maxValidationTokens,
  } = parameters;
  dbg(`translationsDir: %s`, translationsDir);
  if (filenameTemplate) output.itemValue(`filename template`, filenameTemplate);
  output.itemValue(`max translation tokens`, maxTranslationTokens);
  output.itemValue(`max validation tokens`, maxValidationTokens);
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

  const glossary = parameters.glossaryFile
    ? (await workspace.readText(parameters.glossaryFile))?.content
    : undefined;
  const glossaryTokens = await tokenizers.count(glossary || "");
  if (glossaryFile) {
    output.itemValue(`glossary file`, glossaryFile);
    output.itemValue(`glossary`, prettyTokens(glossaryTokens));
  }
  dbg(`glossary: %s`, glossary || "");

  const ignorer = await parsers.ignore(".ctignore");
  dbg(`ignorer: %s`, ignorer ? "loaded" : "no .ctignore found");
  dbg(
    `files (before filter): %O`,
    env.files.map((f) => f.filename)
  );
  const files = env.files
    .filter((f) => ignorer([f.filename]).length)
    // Filter files that match the ISO language code pattern in the filename
    .filter(
      ({ filename }) => !/\.[a-z]{2,2}(-[a-zA-Z]{2,3})?\.mdx?$/.test(filename)
    )
    .filter(
      ({ filename }) => !/\/[a-z]{2,2}(-[a-zA-Z]{2,3})?\//.test(filename)
    );
  if (!files.length) cancel("No files or not matching languages selected.");

  const stats: {
    filename: string;
    tokens: number;
    cost: number;
    todos?: number;
    missing?: number;
    chunks?: number;
    translated?: number;
    validated?: boolean;
    error?: string;
  }[] = [];
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
    const validationModels = langInfo.models.validation;
    output.heading(2, `Translating Markdown files to ${lang} (${to})`);

    dbg(`Using translation model: %s`, translationModel);

    // before getting started, check llm connection
    const resCheck = await runPrompt("Respond with 'echo'", {
      model: translationModel,
      cache: false,
      maxTokens: 5,
    });
    if (resCheck?.error) {
      output.error(
        `Error connecting to translation model ${translationModel}: ${resCheck.error.message}`
      );
      continue;
    }

    // Build safe filename for translation cache
    const translationCacheFilename = join(
      translationsDir,
      `${to.toLowerCase()}.json`
    );
    dbg(`cache: %s`, translationCacheFilename);
    output.itemValue(`translation model`, translationModel);
    output.itemValue(`validation models`, validationModels.join(", "));
    output.itemValue("cache", translationCacheFilename);
    // hash -> text translation
    const translationCache: Record<string, string> =
      (await workspace.readJSON(translationCacheFilename)) || {};
    dbgc(`translation cache: %O`, translationCache);
    const originalTranslationCache = structuredClone(translationCache);

    for (const file of files) {
      const { filename } = file;
      output.heading(3, `${filename}`);

      const fileStat: (typeof stats)[0] = {
        filename,
        tokens: fileTokens[filename] || 0,
        cost: 0,
      };
      stats.push(fileStat);

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

      const { visit, parse, stringify, inspect, chunk, SKIP } = await mdast({
        mdx: /\.mdx$/i.test(filename),
        gfm: true,
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

      const starlight = starlightDir && filename.startsWith(starlightDir);
      dbg(`starlight: %s`, starlight);
      const translationFn = starlight
        ? filename.replace(starlightDir, join(starlightDir, to.toLowerCase()))
        : parsers.jinja(filenameTemplate, {
            filename,
            basename: basename(path.changeext(filename, "")),
            extname: extname(filename),
            dirname: dirname(filename),
            lang: to.toLowerCase(),
          });
      output.itemValue(`translated file`, translationFn);

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
        dbgt(`original\n%s`, inspect(root.children));

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
          dbgn(`%s -> %s`, hash, inspect(node));
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
            else if (node.type === "image") node.alt = translation;
            else if (node.type === "heading" || node.type === "paragraph") {
              dbgo(`%s: %s -> %s`, node.type, nhash, translation);
              try {
                const newNodes = parse(translation)
                  .children as PhrasingContent[];
                node.children.splice(0, node.children.length, ...newNodes);
                return SKIP; // don't process children of paragraphs
              } catch (error) {
                output.error(`error parsing paragraph translation`, error);
                output.detailsFenced(`ast`, inspect(node, { color: false }));
                output.detailsFenced(`translation`, translation);
              }
            }
          } else {
            dbgo(`missing %s %s`, node.type, nhash);
            // mark untranslated nodes with a unique identifier
            if (node.type === "text") {
              if (isTranslatable(node.value)) {
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
            } else if (node.type === "image") {
              if (node.alt) {
                dbga(`image alt: %s`, nhash);
                // compress long hash into LLM friendly short hash
                const llmHash = `T${Object.keys(llmHashes)
                  .length.toString()
                  .padStart(3, "0")}`;
                llmHashes[llmHash] = nhash;
                llmHashTodos.add(llmHash);
                nTranslatable++;
                node.alt = `┌${llmHash}┐${node.alt}└${llmHash}┘`;
              }
            } else if (node.type === "paragraph" || node.type === "heading") {
              // some paragraphs only contain links, with white spaces
              if (hasTranslatableTextChildren(node)) {
                dbga(`paragraph/heading node: %s`, nhash);
                const llmHash = `P${Object.keys(llmHashes)
                  .length.toString()
                  .padStart(3, "0")}`;
                llmHashes[llmHash] = nhash;
                llmHashTodos.add(llmHash);
                nTranslatable++;
                let insert = 0;
                if ((node.children?.[0]?.type as any) === "githubAlertMarker") {
                  dbga(`alert marker`);
                  insert++;
                }
                node.children.splice(insert, 0, {
                  type: "text",
                  value: `┌${llmHash}┐`,
                } as Text);
                node.children.push({
                  type: "text",
                  value: `└${llmHash}┘`,
                });
                return SKIP; // don't process children of paragraphs
              }
            } else if (node.type === "yaml") {
              dbgfm(`%s`, node.value);
              const data = parsers.YAML(node.value);
              if (data && starlight) {
                if (data.hero) {
                  if (typeof data.hero.tagline === "string") {
                    const nhash = hashNode(data.hero.tagline);
                    const tr = translationCache[nhash];
                    dbga(`yaml hero.tagline: %s -> %s`, nhash, tr);
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

        const instructionPrompt = [instructions, instructionsFile]
          .filter(Boolean)
          .join("\n");
        const instructionTokens = await tokenizers.count(instructionPrompt);
        const maxTranslationChunkTokens = Math.ceil(
          (maxTranslationTokens - glossaryTokens - instructionTokens - 200) / 3
        );
        output.itemValue(
          `max translation chunk tokens`,
          prettyTokens(maxTranslationChunkTokens)
        );

        const translatedChunks = chunk(translated, maxTranslationChunkTokens);
        output.itemValue(`translation chunks`, translatedChunks.length);

        fileStat.todos = llmHashTodos.size;
        fileStat.chunks = translatedChunks.length;

        dbgt(`translated\n%s`, inspect(translated.children));
        let attempts = 0;
        let lastLLmHashTodos = llmHashTodos.size + 1;
        while (
          llmHashTodos.size &&
          llmHashTodos.size < lastLLmHashTodos &&
          attempts < maxPromptPerFile
        ) {
          attempts++;
          output.heading(4, `missing translations: ${llmHashTodos.size}`);
          dbge(`todos: %o`, Array.from(llmHashTodos));
          for (let chunki = 0; chunki < translatedChunks.length; chunki++) {
            const translatedChunk = translatedChunks[chunki];
            dbge(`chunk %d: %s`, chunki, inspect(translatedChunk));
            const contentMix = stringify(translatedChunk);
            dbgc(`translatable content: %s`, contentMix);
            if (!hasMarker(contentMix)) {
              output.itemValue(`chunk ${chunki}`, `no marker detected`);
              continue;
            }

            // compute the translate part of the original document
            const contentStart = translatedChunks
              .slice(0, chunki)
              .reduce((count, curr) => count + curr.length, 0);
            const originalChunk = root.children.slice(
              contentStart,
              translatedChunk.length + contentStart
            );
            dbge(`content chunk start: %d`, contentStart);
            const originalChunkContent = stringify(originalChunk);
            dbgc(`original chunk: %s`, originalChunkContent);

            // run prompt to generate translations
            output.itemValue(
              `chunk ${chunki}`,
              prettyTokens(await tokenizers.count(contentMix))
            );
            const { error, fences, text, usage } = await runPrompt(
              async (ctx) => {
                const originalRef = ctx.def("ORIGINAL", originalChunkContent, {
                  lineNumbers: false,
                });
                const translatedRef = ctx.def("TRANSLATED", contentMix, {
                  lineNumbers: false,
                });
                const glossaryRef = glossary
                  ? ctx.def("GLOSSARY", glossary)
                  : undefined;
                ctx.$`You are an expert at translating technical documentation into ${lang} (${to}).
## Task
Your task is to translate a Markdown (GFM) document to ${lang} (${to}) while preserving the structure and formatting of the original document.
You will receive the original document as a variable named ${originalRef} and the currently translated document as a variable named ${translatedRef}.`.role(
                  "system"
                );
                if (glossary)
                  ctx.$`## Glossary
You also have a glossary ${glossaryRef} to maintain a consistent terminology accross all translations.`.role(
                    "system"
                  );
                ctx.$`## Input Format

Each translatable text chunk that needs to be translated is be 
enclosed with a unique identifier in the form  of \`┌node_identifier┐\` at the start and \`└node_identifier┘\` at the end of the node.
You should translate the content of each these text chunks individually.
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
- Always make sure that the URLs are not modified by the translation. Do not try to translate URLs, even if there is a better localized version, keep the original URL.
- Translate each node individually, preserving the original meaning and context.
- If you are unsure about the translation, skip the translation.
${instructionPrompt}`.role("system");
              },
              {
                model: translationModel,
                responseType: "text",
                systemSafety: true,
                system: [],
                cache: true,
                label: `translating ${filename}#${chunki}`,
              }
            );
            logUsage("translate", translationModel, usage);
            fileStat.cost += usage?.cost || 0;
            if (error) {
              fileStat.error = error.message;
              // are we out of tokens?
              if (/429/.test(error.message)) {
                output.error(`Rate limit exceeded: ${error.message}`);
                cancel(`rate limit exceeded`);
              }

              // somehow invalid configuration
              if (/403/.test(error.message)) {
                output.error(
                  `Not allowed to access model, might be out of credits: ${error.message}`
                );
                cancel(`not allowed to access model`);
              }

              output.error(
                `Error translating ${filename}#${chunki}: ${error.message}`
              );
              continue;
            }

            output.itemValue(`translations`, fences.length);

            if (!fences.length) {
              output.warn(`No translations found`);
              output.fence(text, "markdown");
              continue;
            }

            // collect translations
            for (const fence of fences) {
              const llmHash = fence.language;
              if (llmHashTodos.has(llmHash)) {
                llmHashTodos.delete(llmHash);
                const hash = llmHashes[llmHash];
                dbg(`translation: %s - %s`, llmHash, hash);
                let chunkTranslated = fence.content
                  .replace(/\r?\n$/, "")
                  .trim();
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

            lastLLmHashTodos = llmHashTodos.size;
          } // chunk
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
              } else if (node.type === "image") {
                dbgo(`%s: %s -> %s`, node.type, nhash, translation);
                node.alt = translation;
                node.url = patchFn(node.url);
              } else if (node.type === "paragraph" || node.type === "heading") {
                if (hasTranslatableTextChildren(node)) {
                  dbgo(`%s: %s -> %s`, node.type, nhash, translation);
                  try {
                    const newNodes = parse(translation)
                      .children as PhrasingContent[];
                    let insert = 0;
                    if (
                      (node.children?.[0]?.type as any) === "githubAlertMarker"
                    )
                      insert++;
                    node.children.splice(
                      insert,
                      node.children.length - insert,
                      ...newNodes
                    );
                    return SKIP;
                  } catch (error) {
                    output.error(`error parsing paragraph translation`, error);
                    output.fence(node, "json");
                    output.fence(translation);
                  }
                } else {
                  dbg(`untranslated node type: %s`, node.type);
                }
              }
            } else if (node.type === "text" && !isTranslatable(node.value)) {
              // ignore
            } else if (
              (node.type === "paragraph" || node.type === "heading") &&
              !hasTranslatableTextChildren(node)
            ) {
              // ignore paragraphs with no translatable text
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
              // For absolute URLs (starting with /), calculate direct path from translation dir to project root
              const translationDir = dirname(translationFn);
              
              // Extract the project root from starlightDir (remove "/src/content/docs")
              const projectRoot = starlightDir.replace("/src/content/docs", "");
              
              // Calculate relative path from translation directory to project root
              const relativeToProjectRoot = relative(translationDir, projectRoot);
              
              // Remove the leading slash/base and join with relative path to root
              const pathWithoutBase = node.url.replace(starlightBaseRx, "");
              let result = join(relativeToProjectRoot, pathWithoutBase);
              
              // Add trailing slash if original was a directory
              if (node.url.endsWith("/") && !result.endsWith("/")) {
                result += "/";
              }
              
              node.url = result;
            }
          });
        }

        fileStat.missing = unresolvedTranslations.size;
        if (unresolvedTranslations.size) {
          output.itemValue(
            `unresolved translations`,
            unresolvedTranslations.size
          );
          output.fence(
            Array.from(unresolvedTranslations)
              .map((t) => inspect(nodes[t], { color: false }))
              .join("\n\n")
          );
        }

        dbgt(`stringifying\n%s`, inspect(translated.children));
        let contentTranslated = await stringify(translated);

        const nTranslations = Object.keys(llmHashes).length;
        const successfulTranslations =
          nTranslations - unresolvedTranslations.size;
        const translationRatio =
          nTranslations > 0 ? successfulTranslations / nTranslations : 1;

        output.itemValue(`total nodes to translate`, nTranslations);
        output.itemValue(`successful translations`, successfulTranslations);
        output.itemValue(
          `translation success ratio`,
          `${(translationRatio * 100).toFixed(1)}%`
        );
        await workspace.writeText(
          translationCacheFilename,
          JSON.stringify(translationCache, null, 2)
        );

        if (
          unresolvedTranslations.size > 5 &&
          translationRatio < minTranslationsThreshold
        ) {
          fileStat.error = "not enough translations";
          output.warn(
            `not enough translations (${(translationRatio * 100).toFixed(
              1
            )}% < ${minTranslationsThreshold * 100}%), try to translate more.`
          );
          output.detailsFenced(`translated`, contentTranslated, "markdown");
          continue;
        }

        if (content === contentTranslated) {
          output.note(
            `Unable to translate anything, skipping file. Original content length: ${content.length}, translated length: ${contentTranslated.length}`
          );
          continue;
        }

        // validate it stills parses as Markdown
        try {
          parse(contentTranslated);
        } catch (error) {
          fileStat.error = "invalid markdown";
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
            fileStat.error = "links changed";
            output.warn(`some links have changed`);
            output.diff(
              {
                filename: "original",
                content: Array.from(originalLinks).sort().join("\n"),
              },
              {
                filename: "translated",
                content: Array.from(translatedLinks).sort().join("\n"),
              }
            );
          }
        }

        if (
          JSON.stringify(translationCache) ===
          JSON.stringify(originalTranslationCache)
        ) {
          output.note(`no new translations found, skipping validation.`);
          await workspace.writeText(translationFn, contentTranslated);
          continue;
        }

        // chunk and classify
        let fileValidated = true;
        const maxValidationChunkTokens = Math.ceil(
          (maxValidationTokens - 400) / 2
        );
        output.itemValue(
          `max validation chunk tokens`,
          prettyTokens(maxValidationChunkTokens)
        );
        const validationChunks = chunk(translated, maxValidationChunkTokens);
        output.itemValue(`validation chunks`, validationChunks.length);

        output.heading(4, "Validation");
        output.itemValue(`models`, validationModels.join(", "));
        output.itemValue(`chunks`, validationChunks.length);
        for (let chunki = 0; chunki < validationChunks.length; chunki++) {
          output.heading(5, `Validation chunk ${chunki + 1}`);
          const validationChunk = validationChunks[chunki];
          dbge(`validation chunk %d: %s`, chunki, inspect(validationChunk));
          const validationChunkTranslated = stringify(validationChunk);

          // compute the translate part of the original document
          const contentStart = validationChunks
            .slice(0, chunki)
            .reduce((count, curr) => count + curr.length, 0);
          const originalChunk = root.children.slice(
            contentStart,
            validationChunk.length + contentStart
          );
          dbge(`content chunk start: %d`, contentStart);
          const originalChunkContent = stringify(originalChunk);
          dbgc(`original chunk: %s`, originalChunkContent);

          let chunkValidated = false;
          for (const validationModel of validationModels) {
            output.heading(6, validationModel);
            // judge quality is good enough
            const validation = await classify(
              (ctx) => {
                const originalRef = ctx.def("ORIGINAL", originalChunkContent);
                const translatedRef = ctx.def(
                  "TRANSLATED",
                  validationChunkTranslated
                );
                ctx.$`
You are an expert at judging the quality of translations of Markdown documents. 
Your task is to determine the quality of the translation of a Markdown document from ${
                  sourceInfo.name
                } (${source}) to ${lang} (${to}).
The original document is in ${originalRef}, and the translated document is provided in ${translatedRef}.
- The document uses GitHub Flavored Markdown (GFM) syntax.
- Ignore formatting or Markdown syntactic issues.
- The translation should be faithful to the original document and convey the same meaning.
- The code blocks should not be translated.
- The GitHub Alerts ([!NOTE]) should not be translated.
- Emojis are allowed.
- Ignore file path changes as they have to be changed to match the translated file directory structure.
${instructionPrompt || ""}
If you label the transition as 'bad', provide a detailled list of specific sentences or sections that are not translated correctly, 
and explain why they are incorrect.
`.role("system");
              },
              {
                ok: `Translation is good enough as a translation. It is faithful to the original document and conveys the same meaning. It does not have to be perfect.`,
                bad: `Translation is of low quality or has a different meaning from the original.`,
              },
              {
                label: `judge translation ${to} ${basename(
                  filename
                )}#${chunki}`,
                explanations: true,
                cache: true,
                systemSafety: false,
                system: ["system.safety_jailbreak"],
                model: validationModel,
                maxTokens: 400,
              }
            );
            logUsage("validate", validationModel, validation.usage);
            fileStat.cost += validation.usage?.cost || 0;

            // are we out of tokens?
            if (/429/.test(validation.error)) {
              output.error(`Rate limit exceeded: ${validation.error}`);
              chunkValidated = false;
              cancel(`rate limit exceeded`);
            }

            output.resultItem(
              validation.label === "ok",
              `chunk translation validation: ${validation.label}`
            );
            output.fence(validation.answer);
            if (validation.label === "ok") {
              dbg(`validated`);
              chunkValidated = true;
              break;
            }
          }
          if (!chunkValidated) {
            output.startDetails(`translation diff`);
            output.diff(originalChunkContent, validationChunkTranslated);
            output.endDetails();
          }
          fileValidated = fileValidated && chunkValidated;
        }

        output.heading(4, `Results`);
        fileStat.translated = nTranslatable;
        output.resultItem(
          unresolvedTranslations.size === 0,
          `translated texts: ${nTranslatable}, untranslated: ${unresolvedTranslations.size}`
        );
        output.resultItem(fileValidated, `validation`);
        dbgc(`translated: %s`, contentTranslated);

        fileStat.validated = fileValidated;
        if (!fileValidated) {
          output.startDetails(`translation diff`);
          output.diff(content, contentTranslated);
          output.endDetails();
        } else {
          dbg(`writing translation to %s`, translationFn);
          await workspace.writeText(translationFn, contentTranslated);
          await workspace.writeText(
            translationCacheFilename,
            JSON.stringify(translationCache, null, 2)
          );
        }
      } catch (error) {
        output.error(error);
        break;
      }
    }
  }

  output.heading(3, `Summary`);
  output.table(stats);
}
