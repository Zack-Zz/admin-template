import { message, notification } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorConfig } from './requestErrorConfig';

type TestResponseError = Error & {
  info?: {
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: unknown;
  };
  response?: {
    status: number;
    data?: unknown;
  };
  request?: unknown;
};

const createBizError = (
  messageText: string,
  info: TestResponseError['info'],
): TestResponseError => {
  const error = new Error(messageText) as TestResponseError;
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
}));

describe('requestErrorConfig', () => {
  // biome-ignore lint/style/noNonNullAssertion: config handlers are always defined
  const errorThrower = errorConfig.errorConfig!.errorThrower!;
  // biome-ignore lint/style/noNonNullAssertion: config handlers are always defined
  const errorHandler = errorConfig.errorConfig!.errorHandler!;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('errorThrower', () => {
    it('should throw error when success is false', () => {
      const response = {
        success: false,
        data: null,
        errorCode: 400,
        errorMessage: 'Bad Request',
        showType: 2,
      };

      expect(() => {
        errorThrower(response);
      }).toThrow('Bad Request');
    });

    it('should not throw error when success is true', () => {
      const response = {
        success: true,
        data: { id: 1 },
      };

      expect(() => {
        errorThrower(response);
      }).not.toThrow();
    });

    it('should throw BizError with correct info', () => {
      const response = {
        success: false,
        data: { detail: 'more info' },
        errorCode: 403,
        errorMessage: 'Forbidden',
        showType: 3,
      };

      expect.assertions(5);
      try {
        errorThrower(response);
      } catch (error) {
        const bizError = error as TestResponseError;
        expect(bizError.name).toBe('BizError');
        expect(bizError.info?.errorCode).toBe(403);
        expect(bizError.info?.errorMessage).toBe('Forbidden');
        expect(bizError.info?.showType).toBe(3);
        expect(bizError.info?.data).toEqual({ detail: 'more info' });
      }
    });
  });

  describe('errorHandler', () => {
    it('should rethrow error when skipErrorHandler is true', () => {
      const error = new Error('Test error');
      const opts = { skipErrorHandler: true };

      expect(() => {
        errorHandler(error, opts);
      }).toThrow('Test error');
    });

    it('should handle SILENT showType', () => {
      const error = createBizError('Silent error', {
        errorCode: 1001,
        errorMessage: 'Silent error',
        showType: 0,
      });

      errorHandler(error, {});

      expect(message.warning).not.toHaveBeenCalled();
      expect(message.error).not.toHaveBeenCalled();
      expect(notification.open).not.toHaveBeenCalled();
    });

    it('should handle WARN_MESSAGE showType', () => {
      const error = createBizError('Warning', {
        errorCode: 1002,
        errorMessage: 'This is a warning',
        showType: 1,
      });

      errorHandler(error, {});

      expect(message.warning).toHaveBeenCalledWith('This is a warning');
    });

    it('should handle ERROR_MESSAGE showType', () => {
      const error = createBizError('Error message', {
        errorCode: 1003,
        errorMessage: 'This is an error',
        showType: 2,
      });

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('This is an error');
    });

    it('should handle NOTIFICATION showType', () => {
      const error = createBizError('Notification', {
        errorCode: 1004,
        errorMessage: 'This is a notification',
        showType: 3,
      });

      errorHandler(error, {});

      expect(notification.open).toHaveBeenCalledWith({
        title: 1004,
        description: 'This is a notification',
      });
    });

    it('should handle REDIRECT showType', () => {
      const error = createBizError('Redirect', {
        errorCode: 401,
        errorMessage: 'Unauthorized',
        showType: 9,
      });

      errorHandler(error, {});

      // REDIRECT 分支不应触发任何消息/通知提示
      expect(message.warning).not.toHaveBeenCalled();
      expect(message.error).not.toHaveBeenCalled();
      expect(notification.open).not.toHaveBeenCalled();
    });

    it('should handle default case for unknown showType', () => {
      const error = createBizError('Unknown type', {
        errorCode: 1005,
        errorMessage: 'Unknown error type',
        showType: 99,
      });

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('Unknown error type');
    });

    it('should handle axios response error', () => {
      const error = new Error('Axios error') as TestResponseError;
      error.response = {
        status: 500,
        data: {},
      };

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith('Response status:500');
    });

    it('should handle offline error', () => {
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

    it('should handle request error with no response', () => {
      const error = new Error('Request error') as TestResponseError;
      error.request = {};

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith(
        'None response! Please retry.',
      );
    });

    it('should handle generic error', () => {
      const error = new Error('Generic error');

      errorHandler(error, {});

      expect(message.error).toHaveBeenCalledWith(
        'Request error, please retry.',
      );
    });
  });

  describe('requestInterceptors', () => {
    // The interceptor is registered as a plain function (not a tuple),
    // so narrow the union type to a callable for the test.
    const interceptor = errorConfig.requestInterceptors?.[0] as (config: {
      url?: string;
      method?: string;
    }) => { url?: string };

    it('should pass through config without modification', () => {
      const config = {
        url: '/request-test/users',
        method: 'GET',
      };

      const result = interceptor(config);

      // Token attachment is intentionally commented out in the source;
      // interceptor currently returns config as-is
      expect(result.url).toBe('/request-test/users');
    });

    it('should handle URL without config', () => {
      const config = {};

      const result = interceptor(config);

      expect(result.url).toBeUndefined();
    });
  });
});
