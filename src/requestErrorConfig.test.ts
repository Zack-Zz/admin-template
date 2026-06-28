import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_TOKEN_STORAGE_KEY,
  errorConfig,
  TENANT_ID_STORAGE_KEY,
} from './requestErrorConfig';

type TestBizErrorInfo = {
  code?: number | string;
  message?: string;
  showType?: number;
  data?: unknown;
};

type TestBizError = Error & {
  name: 'BizError';
  info: TestBizErrorInfo;
};

type TestResponseError = Error & {
  response?: {
    status: number;
    data?: unknown;
  };
  request?: unknown;
};

type TestRequestConfig = {
  url?: string;
  method?: string;
  headers?: Record<string, unknown>;
};

type TestResponse = {
  data?: unknown;
};

const createBizError = (
  messageText: string,
  info: TestBizErrorInfo,
): TestBizError => {
  const error = new Error(messageText) as TestBizError;
  error.name = 'BizError';
  error.info = info;
  return error;
};

vi.mock('antd', () => ({
  message: {
    warning: vi.fn(),
    error: vi.fn(),
  },
  notification: {
    open: vi.fn(),
  },
}));

vi.mock('@umijs/max', () => ({
  getIntl: vi.fn(() => ({
    formatMessage: vi.fn(({ defaultMessage }) => defaultMessage),
  })),
  history: {
    location: {
      pathname: '/secure',
      search: '?tab=list',
      hash: '#top',
    },
    replace: vi.fn(),
  },
}));

describe('requestErrorConfig', () => {
  // biome-ignore lint/style/noNonNullAssertion: config handlers are always defined
  const errorThrower = errorConfig.errorConfig!.errorThrower!;
  // biome-ignore lint/style/noNonNullAssertion: config handlers are always defined
  const errorHandler = errorConfig.errorConfig!.errorHandler!;
  const requestInterceptor = errorConfig.requestInterceptors?.[0] as (
    config: TestRequestConfig,
  ) => TestRequestConfig;
  const responseInterceptor = errorConfig
    .responseInterceptors?.[0] as unknown as (
    response: TestResponse,
  ) => TestResponse;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    history.location.pathname = '/secure';
    history.location.search = '?tab=list';
    history.location.hash = '#top';
  });

  describe('errorThrower', () => {
    it('does not throw for ApiResult success codes', () => {
      expect(() => {
        errorThrower({ code: 0, message: 'ok', data: { id: 1 } });
      }).not.toThrow();

      expect(() => {
        errorThrower({ code: '200', message: 'ok', data: { id: 2 } });
      }).not.toThrow();
    });

    it('throws BizError for ApiResult business errors', () => {
      expect.assertions(4);

      try {
        errorThrower({
          code: 40001,
          message: 'Invalid business state',
          data: { field: 'status' },
        });
      } catch (error) {
        const bizError = error as TestBizError;
        expect(bizError.name).toBe('BizError');
        expect(bizError.info.code).toBe(40001);
        expect(bizError.info.message).toBe('Invalid business state');
        expect(bizError.info.data).toEqual({ field: 'status' });
      }
    });

    it('keeps compatibility with legacy Pro success responses', () => {
      expect(() => {
        errorThrower({ success: true, data: { id: 1 } });
      }).not.toThrow();

      expect(() => {
        errorThrower({
          success: false,
          data: null,
          errorCode: 403,
          errorMessage: 'Forbidden',
          showType: 2,
        });
      }).toThrow('Forbidden');
    });
  });

  describe('errorHandler', () => {
    it('rethrows error when skipErrorHandler is true', () => {
      const error = new Error('Test error');

      expect(() => {
        errorHandler(error, { skipErrorHandler: true });
      }).toThrow('Test error');
    });

    it('handles SILENT showType', () => {
      const error = createBizError('Silent error', {
        code: 1001,
        message: 'Silent error',
        showType: 0,
      });

      errorHandler(error, {});

      expect(message.warning).not.toHaveBeenCalled();
      expect(message.error).not.toHaveBeenCalled();
      expect(notification.open).not.toHaveBeenCalled();
    });

    it('handles WARN_MESSAGE showType', () => {
      const error = createBizError('Warning', {
        code: 1002,
        message: 'This is a warning',
        showType: 1,
      });

      errorHandler(error, {});

      expect(message.warning).toHaveBeenCalledWith('This is a warning');
    });

    it('handles ERROR_MESSAGE showType', () => {
      const error = createBizError('Error message', {
        code: 1003,
        message: 'This is an error',
        showType: 2,
      });

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('This is an error');
    });

    it('handles NOTIFICATION showType', () => {
      const error = createBizError('Notification', {
        code: 1004,
        message: 'This is a notification',
        showType: 3,
      });

      errorHandler(error, {});

      expect(notification.open).toHaveBeenCalledWith({
        title: 1004,
        description: 'This is a notification',
      });
    });

    it('redirects 401 business errors to login', () => {
      const error = createBizError('Unauthorized', {
        code: 401,
        message: 'Unauthorized',
      });

      errorHandler(error, {});

      expect(history.replace).toHaveBeenCalledWith(
        '/user/login?redirect=%2Fsecure%3Ftab%3Dlist%23top',
      );
      expect(message.error).not.toHaveBeenCalled();
    });

    it('redirects HTTP 401 response errors to login', () => {
      const error = new Error('Axios error') as TestResponseError;
      error.response = {
        status: 401,
        data: {},
      };

      errorHandler(error, {});

      expect(history.replace).toHaveBeenCalledWith(
        '/user/login?redirect=%2Fsecure%3Ftab%3Dlist%23top',
      );
      expect(message.error).not.toHaveBeenCalled();
    });

    it('handles default case for unknown showType', () => {
      const error = createBizError('Unknown type', {
        code: 1005,
        message: 'Unknown error type',
        showType: 99,
      });

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('Unknown error type');
    });

    it('handles axios response error', () => {
      const error = new Error('Axios error') as TestResponseError;
      error.response = {
        status: 500,
        data: {},
      };

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('Response status:500');
    });

    it('handles offline error', () => {
      const error = new Error('Network error') as TestResponseError;
      error.request = {};

      const originalOnLine = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      try {
        errorHandler(error, {});

        expect(message.error).toHaveBeenCalledWith(
          'Network unavailable. Please check your connection and try again.',
        );
      } finally {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: originalOnLine,
        });
      }
    });

    it('handles request error with no response', () => {
      const error = new Error('Request error') as TestResponseError;
      error.request = {};

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith(
        'None response! Please retry.',
      );
    });

    it('handles generic error', () => {
      const error = new Error('Generic error');

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith(
        'Request error, please retry.',
      );
    });
  });

  describe('requestInterceptors', () => {
    it('attaches auth token and tenant headers when available', () => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'token-123');
      localStorage.setItem(TENANT_ID_STORAGE_KEY, 'tenant-a');

      const result = requestInterceptor({
        url: '/request-test/users',
        method: 'GET',
      });

      expect(result.headers).toMatchObject({
        Authorization: 'Bearer token-123',
        'X-Tenant-Id': 'tenant-a',
      });
    });

    it('keeps config unchanged when token and tenant are missing', () => {
      const config = {
        url: '/request-test/users',
        method: 'GET',
      };

      const result = requestInterceptor(config);

      expect(result).toBe(config);
      expect(result.headers).toBeUndefined();
    });
  });

  describe('responseInterceptors', () => {
    it('unwraps successful ApiResult responses', () => {
      const result = responseInterceptor({
        data: {
          code: 0,
          message: 'ok',
          data: { id: 1 },
        },
      });

      expect(result.data).toEqual({ id: 1 });
    });

    it('passes through non-ApiResult responses', () => {
      const response = {
        data: {
          success: true,
          data: { id: 1 },
        },
      };

      const result = responseInterceptor(response);

      expect(result).toBe(response);
      expect(result.data).toEqual({
        success: true,
        data: { id: 1 },
      });
    });
  });
});
