# Repository Guidelines

## Project Structure & Module Organization
Core tooling lives in `quartz/` (CLI, processors, plugins, Preact components). User-authored content sits in `content/`, while static assets belong in `public/`. Generated documentation publishes into `docs/`. Type definitions and shared config reside alongside the root `tsconfig.json` and `quartz.config.ts`.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. Build the production site via `npm run quartz -- build`. Start a local preview with `npm run quartz -- serve` (restarts on content and config changes). For documentation builds, run `npm run docs`. Validate type safety and formatting together with `npm run check`, or auto-format using `npm run format`.

## Coding Style & Naming Conventions
All TypeScript and JSX are formatted by Prettier; run `npm run format` before committing. Keep indentation at two spaces, favor named exports for shared utilities, and use PascalCase for components (`quartz/components/`), camelCase for functions and variables, and kebab-case for file names unless the ecosystem dictates otherwise. Co-locate module-specific styles inside `quartz/styles/` and avoid introducing non-English identifiers.

## Testing Guidelines
Write unit tests with the built-in `tsx --test` runner. Place specs next to the code under test using the `*.test.ts` suffix (see `quartz/util/path.test.ts`). Execute `npm test` locally before opening a pull request. Aim to cover new utilities and processors with deterministic tests; document any intentional gaps directly in the test file.

## Commit & Pull Request Guidelines
Follow the existing Git history: concise, imperative subject lines under 72 characters (e.g., "Add portable asset resolver"). Each change should include a clear summary, testing notes, and any related issue references in the pull request description. Attach screenshots or terminal output when UI or CLI behavior changes. Confirm `npm run check` and `npm test` succeed before requesting review.

## Security & Configuration Tips
Keep secrets out of the repo and prefer environment variables for private tokens. When touching config (`quartz.config.ts`), mention default-preserving behavior and migration steps so downstream gardens can update safely.
