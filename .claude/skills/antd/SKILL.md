---
name: antd
description: Use when working on Ant Design or ProComponents code in this repository, including antd component usage, API lookup, props, tokens, semantic styling, demos, lint findings, migrations, or UI bugs involving imports from antd, @ant-design/icons, @ant-design/pro-components, antd-style, or @umijs/max layout components.
---

# Ant Design For Codex

This repository uses Ant Design 6, ProComponents 3, Umi Max 4, TypeScript strict, and Biome. Treat `@ant-design/cli` as the source of truth for component APIs instead of memory.

## Required Workflow

1. Before writing or changing antd component code, run:

```bash
npx antd info <Component> --format json
```

2. Use the project UI priority:

```text
existing Umi Max / Ant Design Pro capability
→ ProComponents
→ Ant Design base components
→ thin wrappers in src/components/biz/
```

3. After changing antd or ProComponents code, run the narrowest useful check first, then the project check when appropriate:

```bash
npx antd lint ./src --format json
npm run lint
```

4. For handoff-ready UI changes, prefer the full project verification:

```bash
npm run lint
npx antd lint ./src --format json
npm run test
npm run build
```

If a command fails because the shell is using an old Node version, rerun with Node >= 22.

## Common Commands

| Need | Command |
|---|---|
| Component props/API | `npx antd info Button --format json` |
| Working example | `npx antd demo Button basic --format json` |
| Full component docs | `npx antd doc Table --format json` |
| Chinese docs | `npx antd doc Table --lang zh --format json` |
| Component tokens | `npx antd token Button --format json` |
| Semantic slots/classes | `npx antd semantic Button --format json` |
| Project usage scan | `npx antd usage ./src --format json` |
| antd lint | `npx antd lint ./src --format json` |
| Environment snapshot | `npx antd env --format json` |
| Migration checklist | `npx antd migrate 5 6 --format json` |
| Changelog range | `npx antd changelog 5.27.0..6.0.0 --format json` |

Always prefer `--format json` so Codex can read structured output.

## Project Guardrails

- Do not introduce another UI library such as MUI, Chakra UI, Arco Design, Element, or Naive UI.
- Do not reimplement ProComponents features with large custom React/CSS code.
- Do not write large page-level CSS. Prefer layout props, ProComponents patterns, Ant Design tokens, `antd-style`, and small local styles.
- Keep business wrappers in `src/components/biz/` thin. They must not become a schema renderer, design system, or low-code CRUD engine.
- Do not hand-edit `src/services/ant-design-pro/`.
- Do not invent backend URLs while wiring antd tables/forms. Use existing generated services, page `service.ts`, or a clearly local mock promise with TODO.

## Decision Guide

- Admin page shell: prefer `PageContainer`.
- Data list with search/actions: prefer `ProTable`.
- Create/edit form in modal or drawer: prefer `ModalForm`, `DrawerForm`, `ProForm`.
- Read-only detail: prefer `ProDescriptions` or existing `BizDetailDrawer`.
- Local composition: use antd `Form`, `Table`, `Modal`, `Drawer`, `Descriptions`, `Select`, `Tag`, `Button`, `Space`, `Popconfirm`, `Card`.
- Styling/theming: use Ant Design tokens and `createStyles`; use Tailwind only for simple layout utilities.

## Debugging

When an antd UI issue appears:

1. Capture project environment with `npx antd env --format json`.
2. Verify the component API with `npx antd info <Component> --format json`.
3. Check semantic slots or tokens before adding CSS.
4. Run `npx antd lint ./src --format json`.
5. Fix the smallest scoped cause and rerun verification.

Only prepare `npx antd bug` or `npx antd bug-cli` reports when the user explicitly asks to report an upstream issue. Preview the report and get confirmation before any `--submit`.
