import { Space } from 'antd';
import type { ReactNode } from 'react';

export interface BizToolbarProps {
  title?: ReactNode;
  extra?: ReactNode;
}

const BizToolbar = ({ title, extra }: BizToolbarProps) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="text-base font-medium">{title}</div>
      <Space wrap>{extra}</Space>
    </div>
  );
};

export default BizToolbar;
