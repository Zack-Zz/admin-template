import { useIntl } from '@umijs/max';
import { Form, Input } from 'antd';
import { BizDictSelect, BizFormModal } from '@/components';
import { EXAMPLE_STATUS_OPTIONS } from '../constants';
import type { ExampleFormValues, ExampleItem } from '../types';

interface ExampleFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  values?: ExampleItem;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: ExampleFormValues) => void | Promise<void>;
}

const ExampleFormModal = ({
  open,
  mode,
  values,
  confirmLoading,
  onCancel,
  onSubmit,
}: ExampleFormModalProps) => {
  const intl = useIntl();
  const statusOptions = EXAMPLE_STATUS_OPTIONS.map((item) => ({
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
    <BizFormModal<ExampleFormValues>
      title={intl.formatMessage({
        id:
          mode === 'create'
            ? 'pages.system.example.form.createTitle'
            : 'pages.system.example.form.editTitle',
        defaultMessage: mode === 'create' ? 'New Example' : 'Edit Example',
      })}
      open={open}
      confirmLoading={confirmLoading}
      initialValues={values ?? { status: 1 }}
      onCancel={onCancel}
      onSubmit={onSubmit}
    >
      <Form.Item
        name="name"
        label={intl.formatMessage({
          id: 'pages.system.example.field.name',
          defaultMessage: 'Name',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.example.validation.name',
              defaultMessage: 'Please input a name',
            }),
          },
        ]}
      >
        <Input
          maxLength={40}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.name',
            defaultMessage: 'Input name',
          })}
        />
      </Form.Item>
      <Form.Item
        name="code"
        label={intl.formatMessage({
          id: 'pages.system.example.field.code',
          defaultMessage: 'Code',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.example.validation.code',
              defaultMessage: 'Please input a code',
            }),
          },
        ]}
      >
        <Input
          maxLength={40}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.code',
            defaultMessage: 'Input code',
          })}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label={intl.formatMessage({
          id: 'pages.system.example.field.status',
          defaultMessage: 'Status',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.example.validation.status',
              defaultMessage: 'Please select a status',
            }),
          },
        ]}
      >
        <BizDictSelect
          options={statusOptions}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.status',
            defaultMessage: 'Select status',
          })}
        />
      </Form.Item>
      <Form.Item
        name="owner"
        label={intl.formatMessage({
          id: 'pages.system.example.field.owner',
          defaultMessage: 'Owner',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.system.example.validation.owner',
              defaultMessage: 'Please input an owner',
            }),
          },
        ]}
      >
        <Input
          maxLength={40}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.owner',
            defaultMessage: 'Input owner',
          })}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label={intl.formatMessage({
          id: 'pages.system.example.field.description',
          defaultMessage: 'Description',
        })}
      >
        <Input.TextArea
          maxLength={200}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.description',
            defaultMessage: 'Input description',
          })}
          showCount
        />
      </Form.Item>
    </BizFormModal>
  );
};

export default ExampleFormModal;
