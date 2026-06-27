import type { SelectProps } from 'antd';
import { Select } from 'antd';
import type { OptionItem } from '@/types';

export interface BizDictSelectProps
  extends Omit<SelectProps<string | number>, 'options'> {
  options?: OptionItem[];
}

const BizDictSelect = ({
  options = [],
  ...selectProps
}: BizDictSelectProps) => {
  // TODO: load remote dictionary options after the dictionary API is finalized.
  return <Select allowClear options={options} {...selectProps} />;
};

export default BizDictSelect;
