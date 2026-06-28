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

Current runtime behavior:

- `code` values `0` / `200` / `'0'` / `'200'` are treated as success.
- Successful `ApiResult<T>` responses are unwrapped by the response interceptor, so page services can consume `T`.
- Non-success `ApiResult<T>` responses are thrown as `BizError`.
- HTTP `401` and business `code: 401` redirect to `/user/login?redirect=...`.
- The old Ant Design Pro `success/errorCode/errorMessage/showType` response shape remains compatible for existing mock/demo code.

## Error Handling

Default business errors use the internal `code/message/data` contract. If a real backend returns another wire shape, adapt it before page components consume it:

- Prefer request response interceptor for global envelope differences.
- Use generated OpenAPI service adapters when the difference belongs to a service group.
- Use page-level `service.ts` mapping only for module-specific DTO differences.

Do not make page components branch on multiple backend response shapes.

## Login Expiration

The runtime redirects unauthenticated users to `/user/login` from `getInitialState()` and `onPageChange`. Request errors with HTTP `401` or business `code: 401` use the same login route and preserve the current redirect query behavior.

## Authorization And Tenant Headers

`src/requestErrorConfig.ts` currently reads these browser storage keys:

```ts
export const AUTH_TOKEN_STORAGE_KEY = 'admin-template:token';
export const TENANT_ID_STORAGE_KEY = 'admin-template:tenant-id';
```

When present, request interceptors attach:

- `Authorization: Bearer <token>`
- `X-Tenant-Id: <tenant-id>`

Business projects may rename the keys or replace the storage source when the login model is finalized. Keep this logic in request interceptors. Do not add token, tenant, trace, or authorization handling inside individual page components.

## OpenAPI

OpenAPI generation is already configured in `config/config.ts`:

- schema: `config/oneapi.json`
- generated services: `src/services/openapi/`
- command: `npm run openapi`

Do not hand-edit generated service files. Update the OpenAPI schema and regenerate.
