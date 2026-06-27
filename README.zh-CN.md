# admin-template

语言：简体中文 | [English](./README.md)

`admin-template` 是一个基于 Ant Design Pro、Umi Max、React 和 TypeScript 的企业级后台管理端脚手架。它用于快速创建 Java REST API / OpenAPI 后端配套的 Web 管理端，不是具体业务后台，也不是 Ant Design Pro 官方 demo 的二次展示项目。

## 内置能力

- ProLayout 布局、登录页、路由和权限约定。
- Umi Max request、错误处理和 OpenAPI 生成目录约定。
- 标准 CRUD 示例模块：`src/pages/system/example/`。
- 中文为主的业务开发规范：`docs/development-standard.md`。
- 轻量业务组件：`src/components/biz/`。
- 模块生成器：`npm run gen:module`。
- Codex / AI coding agent 项目约束：`AGENTS.md`、`CLAUDE.md`、`docs/codex-prompt.md`。

## 技术栈

- React 19
- TypeScript strict
- Umi Max 4 / Ant Design Pro
- Ant Design 6
- ProComponents 3
- Tailwind CSS v4、antd-style v4
- TanStack Query
- Vitest
- Biome
- npm + `package-lock.json`
- Node.js >= 22

## 本地开发

```bash
npm install
npm start
```

常用命令：

```bash
npm run dev
npm run lint
npm run tsc
npm run test
npm run build
npm run openapi
npm run gen:module -- --name organization --group system --title 组织管理
```

antd 组件开发前先查询当前版本 API：

```bash
npx antd info Button --format json
npx antd lint ./src --format json
```

## 目录约定

```text
config/                      Umi Max 配置、路由、OpenAPI 配置
docs/                        架构、模块、API、Codex 约束文档
src/app.tsx                  运行时配置、初始用户态、Layout、request
src/access.ts                权限约定
src/components/biz/          业务公共组件
src/pages/system/example/    标准 CRUD 示例模块
src/services/openapi/ OpenAPI 自动生成目录，不手工编辑
src/types/                   通用类型与 API 契约类型
scripts/generate-module.mjs  模块生成器
templates/module/            模块生成模板
```

## 文档入口

- [业务开发主规范](./docs/development-standard.md)
- [业务项目接入清单](./docs/project-setup.md)
- [模块开发规范](./docs/module-development.md)
- [API 契约与适配边界](./docs/api-contract.md)
- [模块交付自检清单](./docs/checklists/module-review.md)
- [Codex 提示词](./docs/codex-prompt.md)

## 开发约束

- 新增后台页面优先参考 `src/pages/system/example/`。
- 页面目录保持 `index.tsx`、`service.ts`、`types.ts`、`constants.ts`、`components/` 共置。
- 默认 CRUD 页面使用 `PageContainer`、`ProTable`、`ModalForm` / `ProForm`、`ProDescriptions`。
- UI 优先级：项目现有 Ant Design Pro / Umi Max 能力 → ProComponents → Ant Design 基础组件 → `src/components/biz/` 薄封装。
- 禁止引入 MUI、Chakra UI、Arco Design、Element、Naive UI 等其他 UI 体系。
- 禁止脱离 Ant Design Pro 自行设计页面风格。
- 禁止重写 Ant Design / ProComponents 已有基础能力。
- 禁止在业务页面中写大段自定义 CSS。
- 禁止新增复杂低代码 CRUD 引擎。
- API 调用走 Umi request、生成服务或页面级 `service.ts`，并把后端响应适配为项目内部类型。
- 接口不存在时只写 TODO 或本地 mock promise，不编造真实 URL。
- `src/services/openapi/` 是自动生成目录，必须通过 `npm run openapi` 更新。
- 不要手动运行 `npm run simple`，本项目已经完成裁剪。
- 不要 push 到远程仓库，除非用户明确要求。

## 新增业务模块

```bash
npm run gen:module -- --name organization --group system --title 组织管理
```

生成器默认只生成文件并输出路由片段，不自动修改 `config/routes.ts`。添加路由前请先检查现有路由结构。

## 国际化

项目保留 Umi Max i18n，默认只维护 `en-US` 和 `zh-CN`。默认语言是 `en-US`，用户可以通过右上角语言菜单切换。如果业务项目只保留一套语言，语言切换入口会自动隐藏。

## 权限

项目保留轻量权限约定。路由权限使用 `config/routes.ts` 的 `access` 字段和 `src/access.ts`；当前内置 `canAdmin`，判断 `currentUser.access === 'admin'`。按钮权限通过 `BizPermissionButton permissionCode` 标注，建议命名为 `system:example:create` 这类 `<domain>:<module>:<action>` 格式。

## 验证

交付前优先运行：

```bash
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
```

## 来源说明

本项目基于 [Ant Design Pro](https://github.com/ant-design/ant-design-pro) 初始化并裁剪。后续维护应保留 Umi Max / Ant Design Pro 的核心结构，避免改造成普通 Vite 应用或完全自定义后台框架。
