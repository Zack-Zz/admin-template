# 业务项目接入清单

业务项目基于本脚手架初始化后，建议按下面顺序完成接入。

## 基础信息

- 修改 `package.json` 中的项目名、描述和仓库地址。
- 替换 `public/logo.svg`、`public/pro_icon.svg`、`src/manifest.json` 中的品牌信息。
- 检查 `config/defaultSettings.ts`，确认系统名称、主题和布局配置。
- 根据业务需要调整 `src/pages/Welcome.tsx` 或默认首页路由。

## 路由与菜单

- 在 `config/routes.ts` 中保留需要的菜单组，删除或隐藏不需要的示例页面。
- 新业务模块使用 `npm run gen:module -- --name <module> --group <group> --title <title>` 生成，再手动添加路由。
- 路由 `name` 应能对应 locale 中的 `menu.xxx` 文案。
- 需要路由权限时，使用 `access` 字段并在 `src/access.ts` 中集中定义。

## 后端接入

- 配置 `config/proxy.ts` 的本地代理。
- 如果有 OpenAPI，更新 `config/oneapi.json` 或相关 schema 配置后运行 `npm run openapi`。
- 如果暂时没有 OpenAPI，在页面级 `service.ts` 中使用 Umi Max `request`，并把后端响应适配为项目内部类型。
- 401、业务错误、token、tenantId、traceId 等统一在 `src/requestErrorConfig.ts` 中处理。

## 登录与权限

- 对接真实登录接口和 `GET /api/currentUser` 或等价用户信息接口。
- `currentUser.access` 目前用于内置 `canAdmin` 判断；真实项目可以在 `src/access.ts` 中扩展。
- 按钮权限先使用 `BizPermissionButton permissionCode` 标注权限点。
- 权限点建议命名为 `<domain>:<module>:<action>`，例如 `system:user:create`。
- 不在页面组件里散落角色或权限判断。

## 国际化

- 默认保留 `en-US` 和 `zh-CN`。
- 默认语言是 `en-US`；只做中文系统时，可以把 `config/config.ts` 的默认语言改为 `zh-CN`。
- 如果只保留一套语言，右上角语言切换入口会自动隐藏。
- 新增菜单、页面、表单、提示语时同步维护 locale 文案。

## 示例模块

- `src/pages/system/example/` 是标准 CRUD 参考模块。
- 业务项目可以长期保留它作为开发参考，也可以在项目稳定后删除。
- 删除示例模块时，同步删除路由、菜单文案和相关页面文案。

## 验证

完成初始化后运行：

```bash
npm run lint
npx antd lint ./src --format json
npm run build
npm run test
```
