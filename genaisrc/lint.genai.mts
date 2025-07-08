import { mdast } from "@genaiscript/plugin-mdast";
import "mdast-util-mdx";
import "mdast-util-mdxjs-esm";
import "mdast-util-mdx-jsx";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { join } from "path";

script({
  title: "Lint markdown files using remark parse/stringify",
  description:
    "Formats markdown files using the same parse/stringify toolchain as the translator",
  parameters: {
    pattern: {
      type: "string",
      description: "Glob pattern for files to lint",
      default: "**/*.{md,mdx}",
    },
    write: {
      type: "boolean",
      description: "Write formatted files back to disk",
      default: true,
    },
  },
});

export default async function main() {
  const { pattern, write } = env.vars;

  // Find all markdown files matching the pattern
  const files = await glob(pattern as string, {
    cwd: env.vars.workspaceRoot || process.cwd(),
    ignore: [
      "node_modules/**",
      ".git/**",
      "dist/**",
      "build/**",
      ".genaiscript/**",
    ],
    absolute: false,
  });

  console.log(`Found ${files.length} files to lint`);

  let changedFiles = 0;

  for (const file of files) {
    const filePath = join(env.vars.workspaceRoot || process.cwd(), file);

    try {
      // Read the file content
      const content = await readFile(filePath, "utf-8");

      // Determine if it's an MDX file
      const isMdx = /\.mdx$/i.test(file);

      // Get the mdast parse/stringify functions
      const { parse, stringify } = await mdast({
        mdx: isMdx,
      });

      // Parse and stringify to normalize formatting
      const parsed = parse(content);
      const formatted = stringify(parsed);

      // Check if content changed
      if (content !== formatted) {
        changedFiles++;

        if (write) {
          await writeFile(filePath, formatted, "utf-8");
          console.log(`✓ Formatted ${file}`);
        } else {
          console.log(`✗ ${file} would be formatted`);
        }
      } else {
        console.log(`- ${file} already formatted`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log(`\nFormatted ${changedFiles} files`);

  if (!write && changedFiles > 0) {
    console.log("Run with --write to format files");
    process.exit(1);
  }
}
