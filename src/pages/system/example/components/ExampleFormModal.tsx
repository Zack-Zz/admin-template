import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
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
    <ModalForm<ExampleFormValues>
      key={values?.id ?? 'create'}
      title={intl.formatMessage({
        id:
          mode === 'create'
            ? 'pages.system.example.form.createTitle'
            : 'pages.system.example.form.editTitle',
        defaultMessage: mode === 'create' ? 'New Example' : 'Edit Example',
      })}
      open={open}
      initialValues={values ?? { status: 1 }}
      modalProps={{
        destroyOnHidden: true,
        okButtonProps: { loading: confirmLoading },
        onCancel,
      }}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
      onFinish={async (formValues) => {
        await onSubmit(formValues);

        return true;
      }}
    >
      <ProFormText
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
        fieldProps={{
          maxLength: 40,
        }}
        placeholder={intl.formatMessage({
          id: 'pages.system.example.placeholder.name',
          defaultMessage: 'Input name',
        })}
      />
      <ProFormText
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
        fieldProps={{
          maxLength: 40,
        }}
        placeholder={intl.formatMessage({
          id: 'pages.system.example.placeholder.code',
          defaultMessage: 'Input code',
        })}
      />
      <ProFormSelect
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
        options={statusOptions}
        placeholder={intl.formatMessage({
          id: 'pages.system.example.placeholder.status',
          defaultMessage: 'Select status',
        })}
      />
      <ProFormText
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
        fieldProps={{
          maxLength: 40,
        }}
        placeholder={intl.formatMessage({
          id: 'pages.system.example.placeholder.owner',
          defaultMessage: 'Input owner',
        })}
      />
      <ProFormTextArea
        name="description"
        label={intl.formatMessage({
          id: 'pages.system.example.field.description',
          defaultMessage: 'Description',
        })}
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
        placeholder={intl.formatMessage({
          id: 'pages.system.example.placeholder.description',
          defaultMessage: 'Input description',
        })}
      />
    </ModalForm>
  );
};

export default ExampleFormModal;
