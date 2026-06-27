import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Form, Input, Space } from 'antd';
import { BizDictSelect } from '@/components';
import { EXAMPLE_STATUS_OPTIONS } from '../constants';
import type { ExampleQuery } from '../types';

interface ExampleSearchFormProps {
  loading?: boolean;
  onSearch: (values: ExampleQuery) => void;
  onReset: () => void;
}

const ExampleSearchForm = ({
  loading,
  onSearch,
  onReset,
}: ExampleSearchFormProps) => {
  const intl = useIntl();
  const [form] = Form.useForm<ExampleQuery>();
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
    <Form<ExampleQuery> form={form} layout="inline" onFinish={onSearch}>
      <Form.Item
        name="keyword"
        label={intl.formatMessage({
          id: 'pages.system.example.field.keyword',
          defaultMessage: 'Keyword',
        })}
      >
        <Input
          allowClear
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.keyword',
            defaultMessage: 'Name / Code / Owner',
          })}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label={intl.formatMessage({
          id: 'pages.system.example.field.status',
          defaultMessage: 'Status',
        })}
      >
        <BizDictSelect
          options={statusOptions}
          placeholder={intl.formatMessage({
            id: 'pages.system.example.placeholder.status',
            defaultMessage: 'Select status',
          })}
          style={{ width: 160 }}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.system.example.action.search',
              defaultMessage: 'Search',
            })}
          </Button>
          <Button
            icon={<UndoOutlined />}
            onClick={() => {
              form.resetFields();
              onReset();
            }}
          >
            {intl.formatMessage({
              id: 'pages.system.example.action.reset',
              defaultMessage: 'Reset',
            })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ExampleSearchForm;
