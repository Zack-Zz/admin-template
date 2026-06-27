import type { ReactNode } from 'react';

export type EnableStatus = 0 | 1;

export type GeneralStatus =
  | 'enabled'
  | 'disabled'
  | 'success'
  | 'error'
  | 'processing';

export interface OptionItem<
  ValueType extends string | number = string | number,
> {
  label: ReactNode;
  value: ValueType;
  disabled?: boolean;
}

export interface DictItem<ValueType extends string | number = string | number>
  extends OptionItem<ValueType> {
  dictType?: string;
  color?: string;
  remark?: string;
  sort?: number;
}
