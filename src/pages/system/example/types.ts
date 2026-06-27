import type { PageQuery } from '@/types';

export type ExampleStatus = 0 | 1;

export interface ExampleItem {
  id: string;
  name: string;
  code: string;
  status: ExampleStatus;
  owner: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExampleQuery extends PageQuery {
  status?: ExampleStatus;
}

export interface ExampleFormValues {
  name: string;
  code: string;
  status: ExampleStatus;
  owner: string;
  description?: string;
}
