# API Contract And Adapter Boundary

`ApiResult<T>`、`PageResult<T>` 和 `PageQuery` 是前端项目内部标准，不要求每个服务端项目天然返回同样结构。真实接入时，在 OpenAPI 生成服务、页面级 `service.ts` 或 request response interceptor 中完成适配。

## Internal Envelope

The scaffold consumes this internal shape after adaptation:

```ts
interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}
```

This is a frontend convention, not a live backend requirement.

## Pagination

Default internal paginated data:

```ts
interface PageResult<T> {
  records: T[];
  total: number;
  pageNo: number;
  pageSize: number;
}
```

Default query fields:

```ts
interface PageQuery {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
```

Shared TypeScript definitions live in `src/types/api.ts` and `src/types/common.ts`.

## Request Runtime

The project keeps the Umi Max request runtime:

- `config/config.ts` enables `request: {}`.
- `src/app.tsx` exports `request`.
- `src/requestErrorConfig.ts` owns `errorThrower`, `errorHandler`, request interceptors, and response interceptors.

Do not add a competing global request wrapper unless there is a concrete need. Page services should use generated OpenAPI services or Umi Max `request`, then normalize responses to project internal types.

## Error Handling

The current template still contains Ant Design Pro's `success/errorCode/errorMessage/showType` error handler. When a backend is connected, align one of these approaches:

- Convert backend responses to the current success-based error handler in a response interceptor.
- Or update `ResponseStructure` and `errorThrower` to use `code`, `message`, and `data`.

Do this only when a real backend contract exists.

## Login Expiration

The existing runtime redirects unauthenticated users to `/user/login` from `getInitialState()` and `onPageChange`. Future backend integration should map 401 responses to the same login route and preserve the current redirect query behavior.

## Authorization And Tenant Headers

Future integration point:

```ts
// src/requestErrorConfig.ts
// TODO: attach Authorization and tenantId after the auth model is finalized.
// const token = localStorage.getItem('token');
// const tenantId = localStorage.getItem('tenantId');
```

Keep this logic in request interceptors. Do not add token, tenant, trace, or authorization handling inside individual page components.

## OpenAPI

OpenAPI generation is already configured in `config/config.ts`:

- schema: `config/oneapi.json`
- generated services: `src/services/openapi/`
- command: `npm run openapi`

Do not hand-edit generated service files. Update the OpenAPI schema and regenerate.
