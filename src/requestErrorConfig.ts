import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { getIntl, history } from '@umijs/max';
import { message, notification } from 'antd';

export const AUTH_TOKEN_STORAGE_KEY = 'admin-template:token';
export const TENANT_ID_STORAGE_KEY = 'admin-template:tenant-id';
const LOGIN_PATH = '/user/login';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

interface ApiResponseStructure {
  code: number | string;
  message?: string;
  data?: unknown;
}

interface LegacyResponseStructure {
  success?: boolean;
  data: unknown;
  errorCode?: number | string;
  errorMessage?: string;
  showType?: ErrorShowType;
}

interface BizErrorInfo {
  code?: number | string;
  message?: string;
  data?: unknown;
  showType?: ErrorShowType;
}

type BizError = Error & {
  name: 'BizError';
  info: BizErrorInfo;
};

type ResponseError = Error & {
  response: {
    status?: number;
    data?: unknown;
  };
};

type RequestError = Error & {
  request: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBizError = (error: unknown): error is BizError =>
  error instanceof Error &&
  error.name === 'BizError' &&
  isRecord(error) &&
  isRecord(error.info);

const hasResponse = (error: unknown): error is ResponseError =>
  error instanceof Error && isRecord(error) && isRecord(error.response);

const hasRequest = (error: unknown): error is RequestError =>
  error instanceof Error && isRecord(error) && 'request' in error;

const hasApiResponseShape = (value: unknown): value is ApiResponseStructure =>
  isRecord(value) && 'code' in value;

const hasLegacyResponseShape = (
  value: unknown,
): value is LegacyResponseStructure =>
  isRecord(value) && typeof value.success === 'boolean';

const isSuccessCode = (code: number | string) =>
  code === 0 || code === 200 || code === '0' || code === '200';

const getErrorMessage = (value: unknown, fallback: string) =>
  typeof value === 'string' && value ? value : fallback;

const createBizError = (info: BizErrorInfo) => {
  const error = new Error(
    getErrorMessage(info.message, 'Business request failed.'),
  ) as BizError;
  error.name = 'BizError';
  error.info = info;
  return error;
};

const redirectToLogin = () => {
  const { pathname, search, hash } = history.location;
  if (pathname === LOGIN_PATH) {
    return;
  }

  history.replace(
    `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname + search + hash)}`,
  );
};

const getStorageValue = (key: string) => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage.getItem(key) ?? undefined;
  } catch (_error) {
    return undefined;
  }
};

const appendHeader = (
  config: RequestOptions,
  name: string,
  value: string | undefined,
) => {
  if (!value) {
    return;
  }

  const headers = isRecord(config.headers) ? config.headers : {};
  config.headers = {
    ...headers,
    [name]: value,
  };
};

const unwrapApiResultResponse = <T extends { data?: unknown }>(response: T) => {
  if (hasApiResponseShape(response.data) && isSuccessCode(response.data.code)) {
    response.data = response.data.data;
  }

  return response;
};

/**
 * @name 错误处理
 * 默认面向 Java REST API 常见的 `code/message/data` 响应格式。
 * 当前 mock 或旧 Pro 示例的 `success/errorCode/errorMessage` 结构继续兼容。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      if (hasApiResponseShape(res) && !isSuccessCode(res.code)) {
        throw createBizError({
          code: res.code,
          message: getErrorMessage(res.message, 'Business request failed.'),
          data: res.data,
        });
      }

      if (hasLegacyResponseShape(res) && !res.success) {
        throw createBizError({
          code: res.errorCode,
          message: getErrorMessage(
            res.errorMessage,
            'Business request failed.',
          ),
          showType: res.showType,
          data: res.data,
        });
      }
    },
    errorHandler: (error: unknown, opts?: RequestOptions) => {
      if (opts?.skipErrorHandler) throw error;

      if (isBizError(error)) {
        const { code } = error.info;
        const errorMessage = getErrorMessage(
          error.info.message,
          error.message || 'Business request failed.',
        );
        if (code === 401 || code === '401') {
          redirectToLogin();
          return;
        }

        switch (error.info.showType) {
          case ErrorShowType.SILENT:
            break;
          case ErrorShowType.WARN_MESSAGE:
            message.warning(errorMessage);
            break;
          case ErrorShowType.ERROR_MESSAGE:
            message.error(errorMessage);
            break;
          case ErrorShowType.NOTIFICATION:
            notification.open({
              title: code ?? 'Business Error',
              description: errorMessage,
            });
            break;
          case ErrorShowType.REDIRECT:
            redirectToLogin();
            break;
          default:
            message.error(errorMessage);
        }
      } else if (hasResponse(error)) {
        if (error.response.status === 401) {
          redirectToLogin();
          return;
        }

        message.error(`Response status:${error.response.status}`);
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        message.error(
          getIntl().formatMessage({
            id: 'app.request.offline',
            defaultMessage:
              'Network unavailable. Please check your connection and try again.',
          }),
        );
      } else if (hasRequest(error)) {
        message.error('None response! Please retry.');
      } else {
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = getStorageValue(AUTH_TOKEN_STORAGE_KEY);
      appendHeader(
        config,
        'Authorization',
        token ? `Bearer ${token}` : undefined,
      );
      appendHeader(
        config,
        'X-Tenant-Id',
        getStorageValue(TENANT_ID_STORAGE_KEY),
      );
      return config;
    },
  ],

  responseInterceptors: [unwrapApiResultResponse],
};
