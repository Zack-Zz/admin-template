import { ForkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import useHeaderActionStyles from './style';

const versionItems: MenuProps['items'] = [
  { key: '/welcome', label: 'Project Docs' },
  { key: '/system/example', label: 'Example Management' },
];

const onVersionClick: MenuProps['onClick'] = ({ key }) => {
  window.location.href = String(key);
};

export const VersionDropdown: React.FC = () => {
  const { styles } = useHeaderActionStyles();
  return (
    <HeaderDropdown
      placement="bottomRight"
      arrow
      menu={{
        selectedKeys: [],
        onClick: onVersionClick,
        items: versionItems,
        style: { minWidth: 120 },
      }}
    >
      <Button type="text" className={styles.action} aria-label="Project links">
        <ForkOutlined />
      </Button>
    </HeaderDropdown>
  );
};
