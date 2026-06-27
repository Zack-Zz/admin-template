import {
  ProDescriptions,
  type ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Drawer } from 'antd';
import { BizStatusTag } from '@/components';
import { EXAMPLE_STATUS_TAG_OPTIONS } from '../constants';
import type { ExampleItem } from '../types';

interface ExampleDetailDrawerProps {
  open: boolean;
  record?: ExampleItem;
  onClose: () => void;
}

const ExampleDetailDrawer = ({
  open,
  record,
  onClose,
}: ExampleDetailDrawerProps) => {
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
  const columns: ProDescriptionsItemProps<ExampleItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.code',
        defaultMessage: 'Code',
      }),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.description',
        defaultMessage: 'Description',
      }),
      dataIndex: 'description',
      render: (_, entity) => entity.description || '-',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.createdAt',
        defaultMessage: 'Created At',
      }),
      dataIndex: 'createdAt',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.example.field.updatedAt',
        defaultMessage: 'Updated At',
      }),
      dataIndex: 'updatedAt',
    },
  ];

  return (
    <Drawer
      title={intl.formatMessage({
        id: 'pages.system.example.detail.title',
        defaultMessage: 'Example Detail',
      })}
      open={open}
      onClose={onClose}
      size={600}
      destroyOnHidden
    >
      {record && (
        <ProDescriptions<ExampleItem>
          column={1}
          dataSource={record}
          columns={columns}
        />
      )}
    </Drawer>
  );
};

export default ExampleDetailDrawer;
