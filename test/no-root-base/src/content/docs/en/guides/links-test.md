---
title: Link Testing Guide
description: A test page with various types of links to verify proper patching.
---

# Link Testing Guide

This page contains various types of links to test the link patching functionality in the no-root-base configuration.

## Internal Links with Base Path

These links should be properly patched by the translator:

- [Example Guide](/my-docs-base/en/guides/example/)
- [Reference Page](/my-docs-base/en/reference/example/) 
- [Home Page](/my-docs-base/en/)

## External Links

These should remain unchanged:

- [GitHub](https://github.com)
- [Astro Documentation](https://docs.astro.build)

## Relative Links

These should also be patched:

- [../reference/example/](../reference/example/)
- [./example/](./example/)

## Image with Base Path

![Test Image](/my-docs-base/assets/test.jpg)

## Mixed Content

Here's a paragraph with [internal link](/my-docs-base/en/guides/example/) and [external link](https://example.com).