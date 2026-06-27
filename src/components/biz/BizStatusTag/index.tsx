import type { TagProps } from 'antd';
import { Tag } from 'antd';
import type { ReactNode } from 'react';

export interface BizStatusOption {
  value: string | number | boolean;
  label: ReactNode;
  color?: TagProps['color'];
}

export interface BizStatusTagProps {
  value?: string | number | boolean | null;
  options?: BizStatusOption[];
  fallbackText?: ReactNode;
}

const defaultOptions: BizStatusOption[] = [
  { value: 1, label: 'Enabled', color: 'success' },
  { value: 0, label: 'Disabled', color: 'default' },
  { value: 'success', label: 'Success', color: 'success' },
  { value: 'error', label: 'Failed', color: 'error' },
  { value: 'processing', label: 'Processing', color: 'processing' },
];

const BizStatusTag = ({
  value,
  options = defaultOptions,
  fallbackText = '-',
}: BizStatusTagProps) => {
  const option = options.find((item) => item.value === value);

  if (!option) {
    return <Tag>{fallbackText}</Tag>;
  }

  return <Tag color={option.color}>{option.label}</Tag>;
};

export default BizStatusTag;
