# Module Development

业务模块规范以 `docs/development-standard.md` 为准，本文只展开模块目录和生成流程。

## Standard Module Shape

New business modules should follow the example module:

```text
src/pages/system/example/
  index.tsx
  service.ts
  types.ts
  constants.ts
  components/
    ExampleTable.tsx
    ExampleFormModal.tsx
    ExampleDetailDrawer.tsx
```

Use this shape for normal CRUD pages before creating new abstractions.

The default implementation should follow `PageContainer + ProTable + ModalForm / ProForm + ProDescriptions`.

## Creating A Module

Use the generator:

```bash
npm run gen:module -- --name organization --group system --title 组织管理
```

This creates:

```text
src/pages/system/organization/
  index.tsx
  service.ts
  types.ts
  constants.ts
  components/
```

The generator does not edit routes automatically. Add the route manually in `config/routes.ts` after reviewing the target menu group.

## Route Example

```ts
{
  path: '/system/organization',
  name: '组织管理',
  component: './system/organization',
}
```

## Page Rules

- Use `ProTable` built-in search, pagination, toolbar, and request flow for normal CRUD pages.
- Keep table, form modal, and detail drawer in separate files.
- Split a dedicated search form only when `ProTable` search is not expressive enough.
- Keep module-specific options in `constants.ts`.
- Keep module-specific DTOs and view models in `types.ts`.
- Keep request functions in `service.ts`.
- Prefer ProComponents for admin surfaces. Use `src/components/biz/` only for thin business conveniences.
- Avoid large page-level CSS. Follow Ant Design Pro defaults.

## Service Rules

If the backend API exists, call it through generated OpenAPI services or Umi Max `request`. If it does not exist, add a TODO and keep a local mock promise only as scaffold/demo behavior.

## Naming

- Directory names use lower kebab/camel-style route names, for example `organization` or `role-permission`.
- Component names use PascalCase, for example `OrganizationTable`.
- Types use module prefixes, for example `OrganizationItem` and `OrganizationQuery`.

## Verification

After adding or changing a module, run:

```bash
npm run lint
npx antd lint ./src --format json
npm run build
```

Run `npm run test` when behavior or utility functions changed.
