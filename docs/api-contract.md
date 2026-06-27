# API Contract

## Default Envelope

The scaffold assumes Java backend responses can be normalized to this shape:

```ts
interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}
```

This is a default convention, not a live backend integration.

## Pagination

Default paginated data:

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

Do not add a competing global request wrapper unless there is a concrete need. Page services should use generated OpenAPI services or Umi Max `request`.

## Error Handling

The current template still contains Ant Design Pro's `success/errorCode/errorMessage/showType` error handler. When a Java backend is connected, align one of these approaches:

- Convert backend `ApiResult<T>` to the current success-based error handler in a response interceptor.
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

Keep this logic in request interceptors. Do not add token or tenant handling inside individual page components.

## OpenAPI

OpenAPI generation is already configured in `config/config.ts`:

- schema: `config/oneapi.json`
- generated services: `src/services/ant-design-pro/`
- command: `npm run openapi`

Do not hand-edit generated service files. Update the OpenAPI schema and regenerate.
