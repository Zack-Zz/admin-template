# 业务模块交付自检清单

新增或修改业务模块后，按此清单自检。

## 模块结构

- 页面位于 `src/pages/<group>/<module>/`。
- 模块内包含 `index.tsx`、`service.ts`、`types.ts`、`constants.ts`、`components/`。
- 普通 CRUD 默认包含 `<Module>Table.tsx`、`<Module>FormModal.tsx`、`<Module>DetailDrawer.tsx`。
- 路由手动添加到 `config/routes.ts`，没有让生成器自动改路由。

## UI 与交互

- 页面壳使用 `PageContainer`。
- 列表使用 `ProTable` 的 `request`、search、pagination、toolbar。
- 新增/编辑使用 `ModalForm`、`DrawerForm` 或 `ProForm`。
- 详情使用 `ProDescriptions`。
- `src/components/biz/` 只作为薄封装，没有替代 ProComponents。
- 没有大段页面级 CSS，没有引入新的 UI 体系。

## 数据与类型

- 请求函数集中在页面级 `service.ts` 或生成服务中。
- 页面组件消费项目内部标准类型，不直接耦合后端原始响应。
- 没有编造真实后端 URL。
- 没有手改 `src/services/openapi/`。
- 没有用 `any` 绕过类型问题。

## 权限与国际化

- 路由权限通过 `access` 字段和 `src/access.ts` 管理。
- 按钮权限使用 `BizPermissionButton permissionCode` 标注。
- 权限点命名符合 `<domain>:<module>:<action>`。
- 菜单、页面标题、表单项、操作提示维护了 `en-US` 和 `zh-CN` 文案。

## 验证

```bash
npm run lint
npx antd lint ./src --format json
npm run build
```

涉及行为、工具函数或运行时逻辑时追加：

```bash
npm run test
```
