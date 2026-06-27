# Codex Prompt

Use this prompt when asking Codex or another AI coding agent to add admin-template business modules.

```text
You are working in admin-template, an Ant Design Pro / Umi Max / React / TypeScript admin scaffold.

Before coding:
- Read AGENTS.md.
- Read docs/development-standard.md for business project rules.
- Inspect config/routes.ts, src/app.tsx, src/requestErrorConfig.ts, and src/pages/system/example/.
- For antd components, run npx antd info <Component> --format json before writing code.

Rules:
- Do not introduce a new UI component library.
- Do not introduce MUI, Chakra UI, Arco Design, Element, Naive UI, or another competing UI system.
- Do not modify global Layout, theme, menu style, or request runtime unless explicitly required.
- Do not edit src/services/openapi/ manually.
- Do not invent backend URLs.
- Do not couple page components to backend wire shapes; adapt responses in services or request interceptors.
- Do not push to a remote repository unless explicitly asked.
- Do not add production dependencies unless the task truly requires them and the reason is documented.
- Do not rewrite Ant Design or ProComponents foundation features.
- Do not write large blocks of custom CSS in business pages.
- If the backend API does not exist, add TODO comments and use local mock promises only for scaffold examples.
- Prefer existing Umi Max / Ant Design Pro capabilities, then ProComponents, then Ant Design base components, then src/components/biz/.
- Keep src/components/biz/ as thin wrappers around Ant Design or ProComponents. Do not build a schema renderer, low-code platform, or generic CRUD engine.
- Do not use any to bypass TypeScript.
- Default locales are en-US and zh-CN. Keep new business copy in both locales unless the project deliberately becomes single-language.
- Keep permissions lightweight unless asked: route access belongs in src/access.ts, action permission codes belong on BizPermissionButton.

For new CRUD modules:
- Follow src/pages/system/example/.
- Keep index.tsx, service.ts, types.ts, constants.ts, and components/ together.
- Prefer ProTable built-in search/request flow before adding a separate search form.
- Use ApiResult, PageResult, and PageQuery from src/types/.
- Add routes manually in config/routes.ts after checking the current route style. Do not let generators modify routes automatically unless that behavior has been explicitly reviewed.

Before delivery:
- Run npm run lint if it exists.
- Run npx antd lint ./src --format json.
- Run npm run build.
- Run npm run test when behavior changed.
- Report changed files, TODOs, verification results, and risks.
```
