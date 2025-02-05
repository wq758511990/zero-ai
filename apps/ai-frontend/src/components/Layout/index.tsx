import { MenuEnum } from "@/enums/menu";
import { useMount } from "ahooks";
import { Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.less";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "grp",
    label: "Group",
    type: "group",
    children: [
      { key: MenuEnum.Index, label: "首页" },
      { key: MenuEnum.Chat, label: "聊天" },
    ],
  },
];

const LayoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = ({ keyPath, key }) => {
    navigate(key);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  useMount(() => {
    console.log("side bar");
  });

  return (
    <div className="layout-container">
      <Menu
        onClick={onClick}
        style={{ width: 256, height: "100vh" }}
        selectedKeys={selectedKeys}
        defaultOpenKeys={["grp"]}
        mode="inline"
        items={items}
      />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutPage;
