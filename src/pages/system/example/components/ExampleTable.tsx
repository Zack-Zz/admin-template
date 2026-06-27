import { useIntl } from '@umijs/max';
import type { TableProps } from 'antd';
import { Button, Popconfirm, Space, Table } from 'antd';
import { BizStatusTag } from '@/components';
import type { PageResult } from '@/types';
import { EXAMPLE_STATUS_TAG_OPTIONS } from '../constants';
import type { ExampleItem } from '../types';

interface ExampleTableProps {
  data?: PageResult<ExampleItem>;
  loading?: boolean;
  onPageChange: (pageNo: number, pageSize: number) => void;
  onView: (record: ExampleItem) => void;
  onEdit: (record: ExampleItem) => void;
  onDelete: (record: ExampleItem) => void;
}

const ExampleTable = ({
  data,
  loading,
  onPageChange,
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
  const columns: TableProps<ExampleItem>['columns'] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.code',
        defaultMessage: 'Code',
      }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      key: 'status',
      render: (value: ExampleItem['status']) => (
        <BizStatusTag value={value} options={statusOptions} />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.owner',
        defaultMessage: 'Owner',
      }),
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.updatedAt',
        defaultMessage: 'Updated At',
      }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.action',
        defaultMessage: 'Action',
      }),
      key: 'action',
      width: 180,
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
    <Table<ExampleItem>
      columns={columns}
      dataSource={data?.records}
      loading={loading}
      rowKey="id"
      pagination={{
        current: data?.pageNo ?? 1,
        pageSize: data?.pageSize ?? 10,
        total: data?.total ?? 0,
        showSizeChanger: true,
      }}
      onChange={(pagination) => {
        onPageChange(pagination.current ?? 1, pagination.pageSize ?? 10);
      }}
    />
  );
};

export default ExampleTable;
