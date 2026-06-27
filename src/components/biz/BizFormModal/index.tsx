import type { FormInstance, ModalProps } from 'antd';
import { Form, Modal } from 'antd';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

export interface BizFormModalProps<Values extends object>
  extends Omit<ModalProps, 'children' | 'onCancel' | 'onOk' | 'open'> {
  open: boolean;
  form?: FormInstance<Values>;
  initialValues?: Partial<Values>;
  children: ReactNode;
  onCancel: () => void;
  onSubmit: (values: Values) => void | Promise<void>;
}

const BizFormModal = <Values extends object>({
  open,
  form,
  initialValues,
  children,
  onCancel,
  onSubmit,
  confirmLoading,
  destroyOnHidden = true,
  width = 560,
  ...modalProps
}: BizFormModalProps<Values>) => {
  const [innerForm] = Form.useForm<Values>();
  const formInstance = form ?? innerForm;

  useEffect(() => {
    if (!open) {
      return;
    }

    formInstance.resetFields();
    if (initialValues) {
      const nextValues = initialValues as Parameters<
        typeof formInstance.setFieldsValue
      >[0];
      formInstance.setFieldsValue(nextValues);
    }
  }, [formInstance, initialValues, open]);

  return (
    <Modal
      confirmLoading={confirmLoading}
      destroyOnHidden={destroyOnHidden}
      open={open}
      width={width}
      onCancel={onCancel}
      onOk={() => formInstance.submit()}
      {...modalProps}
    >
      <Form<Values>
        form={formInstance}
        layout="vertical"
        preserve={false}
        onFinish={onSubmit}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default BizFormModal;
