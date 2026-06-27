import { useIntl } from '@umijs/max';
import { BizDetailDrawer, BizStatusTag } from '@/components';
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

  return (
    <BizDetailDrawer
      title={intl.formatMessage({
        id: 'pages.system.example.detail.title',
        defaultMessage: 'Example Detail',
      })}
      open={open}
      onClose={onClose}
      items={[
        {
          key: 'name',
          label: intl.formatMessage({
            id: 'pages.system.example.field.name',
            defaultMessage: 'Name',
          }),
          children: record?.name ?? '-',
        },
        {
          key: 'code',
          label: intl.formatMessage({
            id: 'pages.system.example.field.code',
            defaultMessage: 'Code',
          }),
          children: record?.code ?? '-',
        },
        {
          key: 'status',
          label: intl.formatMessage({
            id: 'pages.system.example.field.status',
            defaultMessage: 'Status',
          }),
          children: (
            <BizStatusTag value={record?.status} options={statusOptions} />
          ),
        },
        {
          key: 'owner',
          label: intl.formatMessage({
            id: 'pages.system.example.field.owner',
            defaultMessage: 'Owner',
          }),
          children: record?.owner ?? '-',
        },
        {
          key: 'description',
          label: intl.formatMessage({
            id: 'pages.system.example.field.description',
            defaultMessage: 'Description',
          }),
          children: record?.description || '-',
        },
        {
          key: 'createdAt',
          label: intl.formatMessage({
            id: 'pages.system.example.field.createdAt',
            defaultMessage: 'Created At',
          }),
          children: record?.createdAt ?? '-',
        },
        {
          key: 'updatedAt',
          label: intl.formatMessage({
            id: 'pages.system.example.field.updatedAt',
            defaultMessage: 'Updated At',
          }),
          children: record?.updatedAt ?? '-',
        },
      ]}
    />
  );
};

export default ExampleDetailDrawer;
