import type { BizStatusOption } from '@/components';
import type { OptionItem } from '@/types';
import type { ExampleStatus } from './types';

export const EXAMPLE_STATUS_OPTIONS: OptionItem<ExampleStatus>[] = [
  { label: 'Enabled', value: 1 },
  { label: 'Disabled', value: 0 },
];

export const EXAMPLE_STATUS_TAG_OPTIONS: BizStatusOption[] = [
  { label: 'Enabled', value: 1, color: 'success' },
  { label: 'Disabled', value: 0, color: 'default' },
];

export const DEFAULT_PAGE_SIZE = 10;
