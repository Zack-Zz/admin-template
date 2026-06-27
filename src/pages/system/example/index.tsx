import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { BizPermissionButton, BizToolbar } from '@/components';
import type { PageResult } from '@/types';
import ExampleDetailDrawer from './components/ExampleDetailDrawer';
import ExampleFormModal from './components/ExampleFormModal';
import ExampleSearchForm from './components/ExampleSearchForm';
import ExampleTable from './components/ExampleTable';
import { DEFAULT_PAGE_SIZE } from './constants';
import {
  createExample,
  deleteExample,
  queryExampleList,
  updateExample,
} from './service';
import type { ExampleFormValues, ExampleItem, ExampleQuery } from './types';

const defaultQuery: ExampleQuery = {
  pageNo: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

const ExamplePage = () => {
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<ExampleQuery>(defaultQuery);
  const [data, setData] = useState<PageResult<ExampleItem>>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ExampleItem>();
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = useCallback(async (nextQuery: ExampleQuery) => {
    setLoading(true);
    try {
      const result = await queryExampleList(nextQuery);
      setData(result);
      setQuery(nextQuery);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(defaultQuery);
  }, [loadData]);

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
      await loadData({ ...query, pageNo: 1 });
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
    await loadData(query);
  };

  return (
    <PageContainer>
      {contextHolder}
      <div className="rounded bg-white p-6">
        <BizToolbar
          title={intl.formatMessage({
            id: 'pages.system.example.title',
            defaultMessage: 'Example Management',
          })}
          extra={
            <BizPermissionButton
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
            </BizPermissionButton>
          }
        />
        <div className="mb-4">
          <ExampleSearchForm
            loading={loading}
            onSearch={(values) => {
              void loadData({ ...query, ...values, pageNo: 1 });
            }}
            onReset={() => {
              void loadData(defaultQuery);
            }}
          />
        </div>
        <ExampleTable
          data={data}
          loading={loading}
          onPageChange={(pageNo, pageSize) => {
            void loadData({ ...query, pageNo, pageSize });
          }}
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
      </div>
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
