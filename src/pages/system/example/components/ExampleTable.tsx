import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Popconfirm, Space } from 'antd';
import type { ReactNode, RefObject } from 'react';
import { BizStatusTag } from '@/components';
import { DEFAULT_PAGE_SIZE, EXAMPLE_STATUS_TAG_OPTIONS } from '../constants';
import { queryExampleList } from '../service';
import type { ExampleItem, ExampleQuery, ExampleStatus } from '../types';

interface ExampleTableParams extends Omit<ExampleQuery, 'status'> {
  current?: number;
  status?: ExampleStatus | string;
}

interface ExampleTableProps {
  actionRef?: RefObject<ActionType | null>;
  toolBarRender?: () => ReactNode[];
  onView: (record: ExampleItem) => void;
  onEdit: (record: ExampleItem) => void;
  onDelete: (record: ExampleItem) => void | Promise<void>;
}

const ExampleTable = ({
  actionRef,
  toolBarRender,
  onView,
  onEdit,
  onDelete,
}: ExampleTableProps) => {
  const intl = useIntl();
  const statusOptions = EXAMPLE_STATUS_TAG_OPTIONS.map((item) => ({
    ...item,
    label: intl.formatMessage({
      id:
        item.value === 1
          ? 'pages.system.example.status.enabled'
          : 'pages.system.example.status.disabled',
      defaultMessage: String(item.label),
    }),
  }));
  const statusValueEnum = Object.fromEntries(
    statusOptions.map((item) => [String(item.value), { text: item.label }]),
  );
  const normalizeStatus = (
    status: ExampleTableParams['status'],
  ): ExampleStatus | undefined => {
    if (status === undefined || status === '') {
      return undefined;
    }

    return Number(status) as ExampleStatus;
  };

  const columns: ProColumns<ExampleItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.keyword',
        defaultMessage: 'Keyword',
      }),
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        allowClear: true,
        placeholder: intl.formatMessage({
          id: 'pages.system.example.placeholder.keyword',
          defaultMessage: 'Name / Code / Owner',
        }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
      key: 'name',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.code',
        defaultMessage: 'Code',
      }),
      dataIndex: 'code',
      key: 'code',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: statusValueEnum,
      render: (_, entity) => (
        <BizStatusTag value={entity.status} options={statusOptions} />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.owner',
        defaultMessage: 'Owner',
      }),
      dataIndex: 'owner',
      key: 'owner',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.updatedAt',
        defaultMessage: 'Updated At',
      }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.action',
        defaultMessage: 'Action',
      }),
      key: 'action',
      width: 180,
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onView(record)}>
            {intl.formatMessage({
              id: 'pages.system.example.action.view',
              defaultMessage: 'View',
            })}
          </Button>
          <Button type="link" onClick={() => onEdit(record)}>
            {intl.formatMessage({
              id: 'pages.system.example.action.edit',
              defaultMessage: 'Edit',
            })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.system.example.delete.title',
              defaultMessage: 'Delete this example data?',
            })}
            description={intl.formatMessage({
              id: 'pages.system.example.delete.description',
              defaultMessage:
                'This only affects the local scaffold example data.',
            })}
            okText={intl.formatMessage({
              id: 'pages.system.example.action.delete',
              defaultMessage: 'Delete',
            })}
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record)}
          >
            <Button danger type="link">
              {intl.formatMessage({
                id: 'pages.system.example.action.delete',
                defaultMessage: 'Delete',
              })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<ExampleItem, ExampleTableParams>
      actionRef={actionRef}
      headerTitle={intl.formatMessage({
        id: 'pages.system.example.title',
        defaultMessage: 'Example Management',
      })}
      rowKey="id"
      search={{
        labelWidth: 100,
      }}
      columns={columns}
      pagination={{
        defaultPageSize: DEFAULT_PAGE_SIZE,
        showSizeChanger: true,
      }}
      toolBarRender={toolBarRender}
      request={async (params) => {
        const result = await queryExampleList({
          pageNo: params.current ?? 1,
          pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
          keyword: params.keyword,
          status: normalizeStatus(params.status),
        });

        return {
          data: result.records,
          total: result.total,
          success: true,
        };
      }}
    />
  );
};

export default ExampleTable;
