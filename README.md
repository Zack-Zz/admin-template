# admin-template

Language: English | [简体中文](./README.zh-CN.md)

`admin-template` is an enterprise admin frontend scaffold based on Ant Design Pro, Umi Max, React, and TypeScript. It has been simplified from the Ant Design Pro template with `npm run simple`, and is intended as a reusable Web admin base for Java REST API / OpenAPI backend projects.

## Positioning

This repository is not a concrete business system and not a second display site for the official Ant Design Pro demo. It provides maintainable conventions that can be reused across new admin projects:

- ProLayout, login initialization, routes, and access conventions.
- Umi Max request, error handling, and OpenAPI generated service conventions.
- A standard CRUD example module for future business pages.
- Chinese-first business development standards under `docs/`.
- Lightweight business components for status tags, permission buttons, dictionary selects, detail drawers, form modals, and toolbars.
- Codex / AI coding agent guardrails to reduce global rewrites and invented backend APIs.
- A small native Node.js module generator for standard page skeletons.

## Tech Stack

- React 19
- TypeScript strict
- Umi Max 4 / Ant Design Pro
- Ant Design 6
- ProComponents 3
- Tailwind CSS v4 and antd-style v4
- TanStack Query
- Vitest
- Biome
- npm with `package-lock.json`
- Node.js >= 22

## Local Development

```bash
npm install
npm start
```

Common commands:

```bash
npm run dev          # development without mock
npm run build        # production build
npm run lint         # Biome lint + TypeScript typecheck
npm run tsc          # typecheck only
npm run test         # Vitest
npm run openapi      # regenerate src/services/ from config/oneapi.json
npm run gen:module -- --name organization --group system --title "Organization"
```

Query antd component APIs before writing antd code:

```bash
npx antd info Button --format json
npx antd lint ./src --format json
```

## Directory Conventions

```text
config/                       Umi Max config, routes, OpenAPI config
docs/                         Architecture, module, API, and Codex guardrails
src/app.tsx                   Runtime config, initial state, Layout, request
src/access.ts                 Access convention
src/components/biz/           Shared business components
src/pages/system/example/     Standard CRUD example module
src/services/openapi/  OpenAPI generated services; do not edit manually
src/types/                    Shared types and API contract types
scripts/generate-module.mjs   Module generator
templates/module/             Module generator templates
```

## Documentation

- [Business development standard](./docs/development-standard.md)
- [Project setup checklist](./docs/project-setup.md)
- [Module development](./docs/module-development.md)
- [API contract and adapter boundary](./docs/api-contract.md)
- [Module review checklist](./docs/checklists/module-review.md)
- [Codex prompt](./docs/codex-prompt.md)

## Development Rules

- New admin pages should start from `src/pages/system/example/`.
- Page modules should keep `index.tsx`, `service.ts`, `types.ts`, `constants.ts`, and `components/` co-located.
- Default CRUD pages should use `PageContainer`, `ProTable`, `ModalForm` / `ProForm`, and `ProDescriptions`.
- API calls should use the current Umi request convention, generated services, or page-level `service.ts`, then adapt backend responses to project internal types.
- If an API does not exist, leave a TODO or use a local mock promise. Do not invent real backend URLs.
- `src/services/openapi/` is generated code. Update it with `npm run openapi`.
- UI priority: existing Umi Max / Ant Design Pro capability -> ProComponents -> Ant Design base components -> thin wrappers in `src/components/biz/`.
- Do not introduce MUI, Chakra UI, Arco Design, Element, Naive UI, or another UI system.
- Do not rewrite existing Ant Design / ProComponents foundation features or add a complex low-code CRUD engine.
- Do not casually change global Layout, theme, or menu style.

## Internationalization

The scaffold keeps Umi Max i18n enabled and maintains `en-US` and `zh-CN` by default. The default locale is `en-US`; users can switch language from the header language menu. If a business project keeps only one locale, the language switcher is hidden automatically.

## Permissions

The scaffold keeps a lightweight permission convention. Route access uses `config/routes.ts` plus `src/access.ts`; the built-in `canAdmin` rule checks `currentUser.access === 'admin'`. Action permissions are marked with `BizPermissionButton permissionCode`, using names such as `system:example:create`. If a backend adapter provides `currentUser.permissions` or `currentUser.permissionCodes`, the button checks them; otherwise scaffold demos allow actions by default.

## Verification

Before handoff, prefer running:

```bash
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
```

If a command fails because of local environment or template state, include the exact command, error summary, and suggested next step in the handoff.

## Source

This project was initialized from [Ant Design Pro](https://github.com/ant-design/ant-design-pro) and then simplified. Future maintenance should preserve the Umi Max / Ant Design Pro foundation instead of turning this repository into a plain Vite app or a fully custom admin framework.
