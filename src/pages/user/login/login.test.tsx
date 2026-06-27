// @ts-ignore
import { startMock } from '@@/requestRecordMock';
import { TestBrowser } from '@@/testBrowser';
import { fireEvent, render } from '@testing-library/react';
import type { Location as HistoryLocation } from 'history';
import React, { act } from 'react';

let server: {
  close: () => void;
};

type HistoryWithPush = HistoryLocation & {
  push: (path: string) => void;
};

const createHistoryRef = (): React.MutableRefObject<HistoryLocation> => ({
  current: {
    pathname: '/user/login',
    search: '',
    hash: '',
    state: null,
    key: 'test',
  },
});

const getHistory = (
  historyRef: React.MutableRefObject<HistoryLocation>,
): HistoryWithPush => historyRef.current as HistoryWithPush;

describe('Login Page', () => {
  beforeAll(async () => {
    server = await startMock({
      port: 8000,
      scene: 'login',
    });
  });

  afterAll(() => {
    server?.close();
  });

  it('should show login form', async () => {
    const historyRef = createHistoryRef();
    const rootContainer = render(
      <TestBrowser
        historyRef={historyRef}
        location={{
          pathname: '/user/login',
        }}
      />,
    );

    await rootContainer.findAllByText('Admin Template');

    act(() => {
      getHistory(historyRef).push('/user/login');
    });

    expect(
      rootContainer.baseElement?.querySelector('.ant-pro-form-login-desc')
        ?.textContent,
    ).toBe('Enterprise admin scaffold for Java REST API / OpenAPI backends');

    expect(rootContainer.asFragment()).toMatchSnapshot();

    rootContainer.unmount();
  });

  it('should login success', async () => {
    const historyRef = createHistoryRef();
    const rootContainer = render(
      <TestBrowser
        historyRef={historyRef}
        location={{
          pathname: '/user/login',
        }}
      />,
    );

    await rootContainer.findAllByText('Admin Template');

    const userNameInput = await rootContainer.findByPlaceholderText(
      'Username: admin or user',
    );

    act(() => {
      fireEvent.change(userNameInput, { target: { value: 'admin' } });
    });

    const passwordInput = await rootContainer.findByPlaceholderText(
      'Password: admin.template',
    );

    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'admin.template' } });
    });

    await (await rootContainer.findByText('Login')).click();

    // Wait for login to succeed and navigate to home page
    await rootContainer.findByText(/Admin Template/, undefined, {
      timeout: 10000,
    });

    expect(rootContainer.asFragment()).toMatchSnapshot();

    rootContainer.unmount();
  });
});
