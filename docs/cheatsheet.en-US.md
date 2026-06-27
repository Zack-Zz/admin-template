# admin-template Cheatsheet

This project is no longer the full Ant Design Pro demo. It is a simplified admin scaffold for Java REST API / OpenAPI based backend projects.

## Start Here

- Architecture: `docs/architecture.md`
- Module development: `docs/module-development.md`
- API contract: `docs/api-contract.md`
- Codex prompt: `docs/codex-prompt.md`
- AI agent rules: `AGENTS.md`

## Current Stack

- React 19
- TypeScript strict
- Umi Max 4 / Ant Design Pro
- Ant Design 6
- ProComponents 3
- Tailwind CSS v4 and antd-style v4
- npm with `package-lock.json`
- Biome and Vitest

## Commands

```bash
npm start
npm run dev
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
npm run gen:module -- --name organization --group system --title 组织管理
```

## Golden Example

Use `src/pages/system/example/` as the reference for future CRUD pages. It shows the expected module shape, local mock service, search form, table, form modal, detail drawer, status tag, pagination, and delete confirmation.

## API Rule

Do not invent real backend endpoints. Use generated OpenAPI services or per-page `service.ts` after the backend contract exists. For scaffold examples, keep local mock promises and TODO comments.

## Source

The scaffold is based on Ant Design Pro. Upstream documentation remains useful for framework behavior, but project-specific decisions live in this repository's docs.
