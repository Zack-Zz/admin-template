import type { ButtonProps } from 'antd';
import { Button } from 'antd';

export interface BizPermissionButtonProps extends ButtonProps {
  permissionCode?: string;
  hiddenWhenDenied?: boolean;
}

const BizPermissionButton = ({
  permissionCode,
  hiddenWhenDenied: _hiddenWhenDenied,
  ...buttonProps
}: BizPermissionButtonProps) => {
  // TODO: integrate with a real usePermission hook when backend permissions exist.
  void permissionCode;

  return <Button {...buttonProps} />;
};

export default BizPermissionButton;
