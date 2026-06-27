import type { DescriptionsProps, DrawerProps } from 'antd';
import { Descriptions, Drawer } from 'antd';

export interface BizDetailDrawerProps
  extends Omit<DrawerProps, 'children' | 'open' | 'title' | 'width'> {
  title: DrawerProps['title'];
  open: boolean;
  items: DescriptionsProps['items'];
  column?: DescriptionsProps['column'];
}

const BizDetailDrawer = ({
  title,
  open,
  items,
  column = 1,
  size = 520,
  ...drawerProps
}: BizDetailDrawerProps) => {
  return (
    <Drawer title={title} open={open} size={size} {...drawerProps}>
      <Descriptions bordered column={column} items={items} />
    </Drawer>
  );
};

export default BizDetailDrawer;
