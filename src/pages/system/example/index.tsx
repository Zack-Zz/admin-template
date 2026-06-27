import { PlusOutlined } from '@ant-design/icons';
import { type ActionType, PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { BizPermissionButton } from '@/components';
import ExampleDetailDrawer from './components/ExampleDetailDrawer';
import ExampleFormModal from './components/ExampleFormModal';
import ExampleTable from './components/ExampleTable';
import { createExample, deleteExample, updateExample } from './service';
import type { ExampleFormValues, ExampleItem } from './types';

const ExamplePage = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ExampleItem>();
  const [detailOpen, setDetailOpen] = useState(false);

  const closeForm = () => {
    setFormOpen(false);
    setCurrentRecord(undefined);
  };

  const handleSubmit = async (values: ExampleFormValues) => {
    setSaving(true);
    try {
      if (currentRecord) {
        await updateExample(currentRecord.id, values);
        messageApi.success(
          intl.formatMessage({
            id: 'pages.system.example.message.updated',
            defaultMessage: 'Example data updated',
          }),
        );
      } else {
        await createExample(values);
        messageApi.success(
          intl.formatMessage({
            id: 'pages.system.example.message.created',
            defaultMessage: 'Example data created',
          }),
        );
      }
      closeForm();
      await actionRef.current?.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: ExampleItem) => {
    await deleteExample(record.id);
    messageApi.success(
      intl.formatMessage({
        id: 'pages.system.example.message.deleted',
        defaultMessage: 'Example data deleted',
      }),
    );
    await actionRef.current?.reload();
  };

  return (
    <PageContainer>
      {contextHolder}
      <ExampleTable
        actionRef={actionRef}
        toolBarRender={() => [
          <BizPermissionButton
            key="create"
            hiddenWhenDenied
            permissionCode="system:example:create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRecord(undefined);
              setFormOpen(true);
            }}
          >
            {intl.formatMessage({
              id: 'pages.system.example.action.create',
              defaultMessage: 'New',
            })}
          </BizPermissionButton>,
        ]}
        onView={(record) => {
          setCurrentRecord(record);
          setDetailOpen(true);
        }}
        onEdit={(record) => {
          setCurrentRecord(record);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />
      <ExampleFormModal
        open={formOpen}
        mode={currentRecord ? 'edit' : 'create'}
        values={currentRecord}
        confirmLoading={saving}
        onCancel={closeForm}
        onSubmit={handleSubmit}
      />
      <ExampleDetailDrawer
        open={detailOpen}
        record={currentRecord}
        onClose={() => {
          setDetailOpen(false);
          setCurrentRecord(undefined);
        }}
      />
    </PageContainer>
  );
};

export default ExamplePage;
