# AGENTS.md

## Project Positioning

`admin-template` is an enterprise admin frontend scaffold based on Ant Design Pro, Umi Max, React, TypeScript, Ant Design, and ProComponents. It is intended as a reusable Web admin base for Java REST API / OpenAPI backends, not as a concrete business system or an Ant Design Pro demo clone.

## Tech Stack

- React 19
- TypeScript strict
- Umi Max 4 / Ant Design Pro
- Ant Design 6
- ProComponents 3
- Tailwind CSS v4, antd-style v4, CSS Modules when needed
- TanStack Query for complex server state
- npm with `package-lock.json`
- Biome for lint/format, no ESLint or Prettier
- Node.js >= 22

## Hard Rules

- Do not introduce a new UI component library.
- Do not introduce MUI, Chakra UI, Arco Design, Element, Naive UI, or any other competing UI system.
- Do not convert the project to a plain Vite app.
- Do not rewrite the Ant Design Pro / Umi Max structure.
- Do not casually modify global Layout, theme, menu style, login flow, or request runtime.
- Do not rewrite foundation features already provided by Ant Design or ProComponents.
- Do not write large blocks of custom CSS in business pages.
- Do not hand-edit `src/services/openapi/`; regenerate it with `npm run openapi`.
- Do not invent backend URLs or fake real API contracts.
- Do not use `any` just to silence TypeScript. Prefer `unknown`, narrow types, or explicit local interfaces.
- Do not modify `package-lock.json` unless `package.json` changes require it.
- Do not introduce new production dependencies unless the task truly requires them and the reason is documented.
- Do not push to a remote repository unless the user explicitly asks.
- Do not run `npm run simple`; it is irreversible and this project has already been simplified.

## UI Component Priority

1. Use existing Ant Design Pro / Umi Max capabilities already present in this project.
2. Prefer ProComponents for admin surfaces: `PageContainer`, `ProTable`, `ProForm`, `ModalForm`, `DrawerForm`, and `ProDescriptions`.
3. Use Ant Design base components for local composition: `Table`, `Form`, `Modal`, `Drawer`, `Descriptions`, `Tag`, `Select`, `Button`, `Popconfirm`, `Space`, and `Card`.
4. Use `src/components/biz/` only for project-level business conveniences.
5. Keep business components as thin wrappers around Ant Design or ProComponents. They must not become a separate design system, schema renderer, or low-code CRUD engine.

## Page Development

- New admin pages should follow `src/pages/system/example/`.
- Business project rules live in `docs/development-standard.md`; use it as the source of truth when docs disagree.
- Keep each module co-located:
  - `index.tsx`
  - `service.ts`
  - `types.ts`
  - `constants.ts`
  - `components/`
- Default CRUD pages should use `ProTable` built-in search, pagination, toolbar, and request flow.
- Split a dedicated `SearchForm` only when `ProTable` search cannot express the query experience cleanly.
- Keep pages visually consistent with Ant Design Pro. Do not design a new visual language for a single page.
- Prefer Ant Design, ProComponents, and `src/components/biz/` over ad hoc UI.
- Keep forms, tables, drawers, and modals simple. Do not build a generic low-code CRUD engine.

## Module Directory

Recommended module path:

```text
src/pages/<group>/<module>/
  index.tsx
  service.ts
  types.ts
  constants.ts
  components/
    <Module>Table.tsx
    <Module>FormModal.tsx
    <Module>DetailDrawer.tsx
```

Use `npm run gen:module -- --name <module> --group <group> --title <中文标题> --title-en <English Title>` to generate a module skeleton, then add the route manually in `config/routes.ts`.

The generator must not modify routes automatically unless the implementation is deliberately reviewed and safe. The default workflow is to print the route snippet and let the developer add it manually.

## API Rules

- Use Umi Max `request` through generated services or per-page `service.ts`.
- Keep page components aligned with internal types from `src/types/api.ts` and `src/types/common.ts`.
- Backend wire shapes may differ by project. Normalize them in generated service wrappers, page `service.ts`, or request interceptors before page components consume them.
- Internal response envelope:

```ts
interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}
```

- Internal pagination envelope:

```ts
interface PageResult<T> {
  records: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}
```

- If a backend API does not exist, leave a TODO and use a local mock promise only for scaffold examples.
- Future Authorization and tenant headers belong in request interceptors, not in page components.

## Permission And i18n Rules

- Route access belongs in `config/routes.ts` and `src/access.ts`.
- The built-in `canAdmin` rule checks `currentUser.access === 'admin'`.
- Action permission markers belong on `BizPermissionButton permissionCode`.
- Permission codes should use `<domain>:<module>:<action>`, for example `system:example:create`.
- `BizPermissionButton` checks `currentUser.permissions` or `currentUser.permissionCodes` when present; without a permission list it defaults to allowing scaffold actions.
- Default locales are `en-US` and `zh-CN`; default language is `en-US`.
- If a business project keeps only one locale, the language switcher should stay hidden.

## Code Style

- Use Biome only.
- Biome enforces `noExplicitAny` for business code; generated `src/services/openapi/` files are excluded.
- Match existing project style and imports.
- Keep changes surgical and scoped to the user request.
- Prefer named local types over broad inline object types when a module reuses them.
- Remove unused code introduced by your own changes.

## Verification

Before handing off, run the commands that actually exist in this project:

```bash
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
```

If a command fails, fix project-introduced failures first. If the failure is from existing template state or environment, report the exact command and error summary.

## Delivery Notes

Every final report should include:

- Files changed and files added.
- Scaffold conventions introduced.
- TODO items left intentionally.
- How to add a new module.
- Verification commands run and their results.
- Risks or unfinished items.
