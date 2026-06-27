import type { PageResult } from '@/types';
import { DEFAULT_PAGE_SIZE } from './constants';
import type { ExampleFormValues, ExampleItem, ExampleQuery } from './types';

const now = '2026-06-27 10:00:00';

let exampleList: ExampleItem[] = [
  {
    id: '1',
    name: 'Example Organization',
    code: 'demo-org',
    status: 1,
    owner: 'Admin',
    description: 'Scaffold data for the standard CRUD page structure.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    name: 'Disabled Example',
    code: 'disabled-demo',
    status: 0,
    owner: 'Operator',
    description: 'Used to demonstrate status tags and filters.',
    createdAt: now,
    updatedAt: now,
  },
];

const wait = async () =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, 240);
  });

const getCurrentTime = () =>
  new Date().toISOString().slice(0, 19).replace('T', ' ');

export async function queryExampleList(
  query: ExampleQuery = {},
): Promise<PageResult<ExampleItem>> {
  await wait();

  const pageNo = query.pageNo ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const keyword = query.keyword?.trim().toLowerCase();

  const filtered = exampleList.filter((item) => {
    const matchKeyword = keyword
      ? [item.name, item.code, item.owner].some((value) =>
          value.toLowerCase().includes(keyword),
        )
      : true;
    const matchStatus =
      typeof query.status === 'number' ? item.status === query.status : true;

    return matchKeyword && matchStatus;
  });

  const start = (pageNo - 1) * pageSize;

  return {
    records: filtered.slice(start, start + pageSize),
    total: filtered.length,
    pageNo,
    pageSize,
  };
}

export async function createExample(
  values: ExampleFormValues,
): Promise<ExampleItem> {
  await wait();

  const currentTime = getCurrentTime();
  const item: ExampleItem = {
    ...values,
    id: `${Date.now()}`,
    createdAt: currentTime,
    updatedAt: currentTime,
  };

  exampleList = [item, ...exampleList];

  return item;
}

export async function updateExample(
  id: string,
  values: ExampleFormValues,
): Promise<ExampleItem> {
  await wait();

  const current = exampleList.find((item) => item.id === id);
  if (!current) {
    throw new Error('Example data does not exist');
  }

  const next: ExampleItem = {
    ...current,
    ...values,
    updatedAt: getCurrentTime(),
  };

  exampleList = exampleList.map((item) => (item.id === id ? next : item));

  return next;
}

export async function deleteExample(id: string): Promise<void> {
  await wait();
  exampleList = exampleList.filter((item) => item.id !== id);
}
