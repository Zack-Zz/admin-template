# admin-template 速查

本项目已经不是完整的 Ant Design Pro 官方 demo，而是面向 Java REST API / OpenAPI 后端项目的后台管理端脚手架。

## 优先阅读

- 架构说明：`docs/architecture.md`
- 模块开发：`docs/module-development.md`
- API 契约：`docs/api-contract.md`
- Codex 提示词：`docs/codex-prompt.md`
- AI 开发约束：`AGENTS.md`

## 当前技术栈

- React 19
- TypeScript strict
- Umi Max 4 / Ant Design Pro
- Ant Design 6
- ProComponents 3
- Tailwind CSS v4 和 antd-style v4
- npm 与 `package-lock.json`
- Biome 和 Vitest

## 常用命令

```bash
npm start
npm run dev
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
npm run gen:module -- --name organization --group system --title 组织管理
```

## 黄金样例

后续 CRUD 页面优先参考 `src/pages/system/example/`。它展示了模块目录、局部 mock service、查询表单、表格、表单弹窗、详情抽屉、状态 Tag、分页和删除二次确认。

## API 规则

不要编造真实后端接口。后端契约明确后，使用 OpenAPI 生成服务或页面级 `service.ts`。脚手架示例只保留本地 mock promise 和 TODO。

## 来源

本脚手架基于 Ant Design Pro 初始化。上游文档仍可作为框架参考，但本项目的开发约定以当前仓库 docs 和 AGENTS.md 为准。
