import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PermissionCurrentUser } from '@/types';
import BizPermissionButton, {
  checkPermission,
  getPermissionCodes,
} from './index';

const modelState = vi.hoisted(() => ({
  initialState: {
    currentUser: undefined as PermissionCurrentUser | undefined,
  },
}));

vi.mock('@umijs/max', () => ({
  useModel: vi.fn(() => modelState),
}));

describe('BizPermissionButton', () => {
  beforeEach(() => {
    modelState.initialState.currentUser = undefined;
  });

  it('renders when permissionCode is not provided', () => {
    render(<BizPermissionButton>Open</BizPermissionButton>);

    expect(screen.getByRole('button', { name: 'Open' })).toBeEnabled();
  });

  it('allows access when permission list is absent', () => {
    modelState.initialState.currentUser = {
      access: 'user',
    };

    render(
      <BizPermissionButton permissionCode="system:example:create">
        Create
      </BizPermissionButton>,
    );

    expect(screen.getByRole('button', { name: 'Create' })).toBeEnabled();
  });

  it('allows admin users regardless of permission code', () => {
    modelState.initialState.currentUser = {
      access: 'admin',
      permissions: [],
    };

    render(
      <BizPermissionButton permissionCode="system:example:delete">
        Delete
      </BizPermissionButton>,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('disables button when permission code is missing from permission list', () => {
    modelState.initialState.currentUser = {
      access: 'user',
      permissions: ['system:example:view'],
    };

    render(
      <BizPermissionButton permissionCode="system:example:update">
        Edit
      </BizPermissionButton>,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
  });

  it('hides button when permission code is denied and hiddenWhenDenied is true', () => {
    modelState.initialState.currentUser = {
      access: 'user',
      permissionCodes: ['system:example:view'],
    };

    render(
      <BizPermissionButton
        hiddenWhenDenied
        permissionCode="system:example:delete"
      >
        Delete
      </BizPermissionButton>,
    );

    expect(
      screen.queryByRole('button', { name: 'Delete' }),
    ).not.toBeInTheDocument();
  });
});

describe('permission helpers', () => {
  it('reads permissions before permissionCodes', () => {
    expect(
      getPermissionCodes({
        access: 'user',
        permissions: ['system:example:view'],
        permissionCodes: ['system:example:update'],
      }),
    ).toEqual(['system:example:view']);
  });

  it('checks permission codes consistently outside button render trees', () => {
    expect(
      checkPermission(
        {
          access: 'user',
          permissionCodes: ['system:example:delete'],
        },
        'system:example:delete',
      ),
    ).toBe(true);

    expect(
      checkPermission(
        {
          access: 'user',
          permissionCodes: ['system:example:view'],
        },
        'system:example:delete',
      ),
    ).toBe(false);
  });
});
