# 业务项目开发规范

本文是业务项目基于 `admin-template` 开发时的主规范。README 只作为入口，具体开发约束以本文、`AGENTS.md` 和 `src/pages/system/example/` 为准。

## 项目边界

- 本项目是基于 Ant Design Pro / Umi Max 的企业后台脚手架，不是具体业务系统，也不是完整 Ant Design Pro demo。
- 保留 Umi Max、ProLayout、request、OpenAPI、access、locale 等基础结构，不把项目改造成普通 Vite 应用或自定义后台框架。
- 新增能力优先使用项目现有 Ant Design Pro / Umi Max 能力，其次 ProComponents，再其次 Ant Design 基础组件，最后才是 `src/components/biz/` 薄封装。
- 禁止引入 MUI、Chakra UI、Arco Design、Element、Naive UI 等竞争 UI 体系。
- 禁止在业务页面中写大段自定义 CSS；优先使用 Ant Design Pro 默认视觉、ProComponents、少量 Tailwind 布局工具和必要的 antd-style。

## 业务模块

普通 CRUD 模块默认参考 `src/pages/system/example/`：

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

- 页面壳使用 `PageContainer`。
- 列表使用 `ProTable`，由 `request` 承接查询、分页、刷新和 loading。
- 新增/编辑使用 `ModalForm`、`DrawerForm` 或其他 `ProForm` 组件。
- 详情使用 `ProDescriptions`。
- `ProTable` 内置 search 能表达的查询，不单独拆 `SearchForm`；复杂查询体验才拆分。
- `src/components/biz/` 只保留状态 Tag、权限按钮、字典 Select 等薄封装，不能演化为 schema renderer、低代码 CRUD 引擎或独立设计系统。
- 模块生成器 `npm run gen:module` 只生成文件并输出路由片段，不自动改 `config/routes.ts`。

## API 与适配器

前端项目内部默认使用 `ApiResult<T>`、`PageResult<T>`、`PageQuery` 等标准类型，但这不是对后端 wire shape 的强制要求。

- 后端天然匹配项目标准时，可以直接透传。
- 后端响应不一致时，在 OpenAPI 生成服务、页面级 `service.ts` 或 `src/requestErrorConfig.ts` 的 response interceptor 中适配。
- 页面组件只消费项目内部标准类型，不直接耦合不同服务端的原始响应。
- 不手改 `src/services/openapi/`，需要更新时改 OpenAPI schema 后运行 `npm run openapi`。
- 不在页面组件里拼 Authorization、tenantId、traceId 等 header；统一放在 request interceptors。
- 后端接口不存在时，不编造真实 URL。脚手架示例可以使用本地 mock promise，并保留 TODO。

## 权限

当前脚手架只保留轻量权限约定，不实现完整 RBAC。

- 路由级权限使用 `config/routes.ts` 的 `access` 字段，对应 `src/access.ts`。
- 当前内置 `canAdmin`，来源是 `initialState.currentUser.access === 'admin'`。
- 按钮或操作权限使用 `BizPermissionButton` 的 `permissionCode` 预留。
- `permissionCode` 建议命名为 `<domain>:<module>:<action>`，例如 `system:example:create`。
- 真实业务项目接入权限时，优先改权限适配层、`access.ts` 或 `BizPermissionButton` 内部逻辑，不在页面里散落权限判断。

## 国际化

默认只维护 `en-US` 和 `zh-CN` 两套语言。

- 不明确指定语言时，默认 `en-US`。
- 用户可以通过右上角语言菜单切换语言。
- 如果业务项目只使用中文，可以只保留 `zh-CN` 并把默认语言改为 `zh-CN`；当可用语言只有一套时，语言切换入口会自动隐藏。
- 新业务代码默认使用 `useIntl().formatMessage({ id, defaultMessage })`，至少维护 `en-US` 和 `zh-CN` 两套文案。

## 代码质量

- TypeScript strict，不使用 `any` 绕过类型问题；优先 `unknown`、类型收窄或明确的本地接口。
- Biome 是唯一格式化和 lint 工具，不引入 ESLint 或 Prettier。
- 不新增生产依赖，除非任务确实需要并在交付说明中解释原因。
- 不随意修改全局 Layout、主题、菜单风格、登录流程或 request runtime。
- `npm run simple` 已经执行过，后续不要再运行。

## 交付自检

交付前优先运行：

```bash
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
```

新增或修改业务模块时，同时参考 `docs/checklists/module-review.md`。
