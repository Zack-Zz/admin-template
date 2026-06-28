import { useModel } from '@umijs/max';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import type { PermissionCurrentUser } from '@/types';

export interface BizPermissionButtonProps extends ButtonProps {
  permissionCode?: string;
  hiddenWhenDenied?: boolean;
}

const getStringList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === 'string');
};

export const getPermissionCodes = (currentUser?: PermissionCurrentUser) => {
  return (
    getStringList(currentUser?.permissions) ??
    getStringList(currentUser?.permissionCodes)
  );
};

export const checkPermission = (
  currentUser: PermissionCurrentUser | undefined,
  permissionCode: string | undefined,
) => {
  const permissionCodes = getPermissionCodes(currentUser);

  return (
    !permissionCode ||
    currentUser?.access === 'admin' ||
    !permissionCodes ||
    permissionCodes.includes(permissionCode)
  );
};

export const useBizPermission = (permissionCode?: string) => {
  const { initialState } = useModel('@@initialState');
  return checkPermission(initialState?.currentUser, permissionCode);
};

const BizPermissionButton = ({
  permissionCode,
  hiddenWhenDenied = false,
  ...buttonProps
}: BizPermissionButtonProps) => {
  const allowed = useBizPermission(permissionCode);

  if (!allowed && hiddenWhenDenied) {
    return null;
  }

  return (
    <Button {...buttonProps} disabled={buttonProps.disabled || !allowed} />
  );
};

export default BizPermissionButton;
