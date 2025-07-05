# Contributor Manual

We welcome contributions of any size and contributors of any skill level.
As an open source project, we believe in giving back to our contributors.
We are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.

> **Tip for new contributors:**
> Take a look at [GitHub's Docs](https://docs.github.com/en/get-started/quickstart/hello-world) for helpful information on working with GitHub.

This document is an active work in progress — like Action Continuous Translation itself! Feel free to join us in [the GenAIScript Discord server][discord] to join the discussion.

## Types of contributions

There are lots of ways to contribute to Action Continuous Translation.

Maintaining Action Continuous Translation requires writing TypeScript code.
This repository also contains the code for the Action Continuous Translation docs website.
Help writing docs, catching typos and errors is always welcome.

You can also get involved by leaving feedback on [issues][issues] or reviewing [pull requests][pulls] by other contributors.

We encourage you to:

- [**Open an issue**][new-issue] to let us know of bugs in Action Continuous Translation, documentation you found unclear, or other issues you run into.

- [**Look at existing issues**][issues] (especially those labelled [“good first issue”][gfi]) to find ways to contribute.

- **Make a pull request (PR)** to address an open issue or to fix obvious problems.
  Read more about [making a PR in GitHub’s docs][pr-docs]

- [**Review existing PRs**][pulls] to help us merge contributions sooner.

## About this repo

This repo is a “monorepo,” meaning it contains several projects in one. It contains the Action Continuous Translation docs site in [`docs/`](./docs/) and the action itself that make up Action Continuous Translation in [`genaisrc/`](./genaisrc/).

### Setting up a development environment

You can [develop locally](#developing-locally) or use an online coding development environment like [GitHub Codespaces](#developing-using-github-codespaces) to get started quickly.

#### Developing locally

**Prerequisites:** Developing Action Continuous Translation requires [Node.js](https://nodejs.org/en) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Make sure you have these installed before following these steps.

1. **Fork Action Continuous Translation** to your personal GitHub account by clicking <kbd>Fork</kbd> on the [main Action Continuous Translation repo page][act].

2. **Clone your fork** of Action Continuous Translation to your computer. Replace `YOUR-USERNAME` in the command below with your GitHub username to clone in a Terminal:

   ```sh
   git clone https://github.com/YOUR-USERNAME/action-continuous-translation.git
   ```

3. **Change directory** to the cloned repo:

   ```sh
   cd action-continuous-translation
   ```

4. **Install dependencies** with `npm`:

   ```sh
   npm i
   ```

#### Developing using GitHub Codespaces

1. **Create a new codespace** via https://codespaces.new/pelikhan/action-continuous-translation

2. If running the docs site, pass the `--host` flag to avoid “502 Bad Gateway” errors:

   ```sh
   cd docs
   npm run dev --host
   ```

The dev container used for GitHub Codespaces can also be used with [other supporting tools](https://containers.dev/supporting), including VS Code.

## Showcase

### Sites

We love to see websites built with Action Continuous Translation and share them with the community.
If you’ve built a website with Action Continuous Translation, adding it to the showcase is just a pull request away!

1. Set up a development environment by following the [“Setting up a development environment”](#setting-up-a-development-environment) instructions.
2. Add a screenshot of your site to the `docs/src/assets/showcase/` directory. The image file must:
   - Be a `.png` file and named after your site’s domain, e.g. `example.com.png`.
   - Have the dimensions of 800 × 450 pixels.
3. Add a new entry for your website in `docs/src/components/showcase/ShowcaseSites.astro`.

   - The new entry must be appended at the end of the existing list of sites.
   - The `title` attribute must be the name of your site with no extra details.
   - The `href` attribute must be the URL of your website. If your documentation is hosted on a subdomain or subdirectory, include that in the URL.
   - The `thumbnail` attribute must be the filename of the screenshot you added in step 2.

   ```diff
     <Card title="Example" href="https://example.net" thumbnail="example.net.png" />
     <Card title="Last Example" href="https://example.org" thumbnail="example.org.png" />
   + <Card title="New Example" href="https://example.com" thumbnail="example.com.png" />
   </FluidGrid>
   ```

4. Open a pull request on GitHub to add your changes.

[discord]: https://discord.gg/tYrtzWpEe9
[act]: https://github.com/pelikhan/action-continuous-translation
[issues]: https://github.com/pelikhan/action-continuous-translation/issues
[pulls]: https://github.com/pelikhan/action-continuous-translation/pulls
[new-issue]: https://github.com/pelikhan/action-continuous-translation/issues/new/choose
[pr-docs]: https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request
[gfi]: https://github.com/pelikhan/action-continuous-translation/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+
