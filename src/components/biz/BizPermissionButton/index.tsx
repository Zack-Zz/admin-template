import { useModel } from '@umijs/max';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';

export interface BizPermissionButtonProps extends ButtonProps {
  permissionCode?: string;
  hiddenWhenDenied?: boolean;
}

type CurrentUserWithPermissionCodes = API.CurrentUser & {
  permissions?: unknown;
  permissionCodes?: unknown;
};

const getStringList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === 'string');
};

const getPermissionCodes = (currentUser?: API.CurrentUser) => {
  const user = currentUser as CurrentUserWithPermissionCodes | undefined;

  return (
    getStringList(user?.permissions) ?? getStringList(user?.permissionCodes)
  );
};

const BizPermissionButton = ({
  permissionCode,
  hiddenWhenDenied = false,
  ...buttonProps
}: BizPermissionButtonProps) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const permissionCodes = getPermissionCodes(currentUser);
  const allowed =
    !permissionCode ||
    currentUser?.access === 'admin' ||
    !permissionCodes ||
    permissionCodes.includes(permissionCode);

  if (!allowed && hiddenWhenDenied) {
    return null;
  }

  return (
    <Button {...buttonProps} disabled={buttonProps.disabled || !allowed} />
  );
};

export default BizPermissionButton;
