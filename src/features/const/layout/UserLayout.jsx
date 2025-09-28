import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Dropdown, Badge, Spin, message } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  SettingOutlined,
  BellOutlined,
  VideoCameraOutlined,
  QuestionOutlined,
  CustomerServiceOutlined,
  AlertOutlined,
  ExportOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getMenuItems } from "./MenuItems";

import { handleLogout } from "../../../utils/auth";
import { RoleIcon } from "../../../utils/util";
import Clock from "../Clock";
import { getStudentHomeworkNotification, getUserInfo } from "../../../services/api-client";
import HomeworkNotificationDropdown from "./NotificationDropdown";

const { Header, Sider, Content } = Layout;

const UserLayout = ({ user, isConnected }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('1');
  const [notificationCount, setNotificationCount] = useState([]);
  const [homeworkNotifications, setHomeworkNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMemo(() => getMenuItems(user?.roleName || ''), [user]);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem && currentItem.key !== selectedMenuKey) {
      setSelectedMenuKey(currentItem.key);
    }
  }, [location.pathname, menuItems, selectedMenuKey]);

  useEffect(() => {
    fetchHomeworkNotification();
  }, []);

  const fetchHomeworkNotification = useCallback(async () => {
    try {
      const response = await getStudentHomeworkNotification();
      console.log(response);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setNotificationCount(data.length);
        setHomeworkNotifications(data);
      } else {
        message.error(errorMessage || "Failed to fetch students");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching students");
    } finally {
    }
  }, []);

  const dropdownMenu = [
    {
      key: "1",
      label: (
        <Link to="/settings">
          <SettingOutlined />&nbsp;&nbsp;Settings
        </Link>
      )
    },
    {
      key: "2",
      label: (
        <Link to="/settings">
          <CustomerServiceOutlined />&nbsp;&nbsp;Help & Support
        </Link>
      )
    },
    {
      key: "3",
      label: (
        <Link to="/settings">
          <AlertOutlined />&nbsp;&nbsp;Feedback / Report Issue
        </Link>
      )
    },
    {
      key: "4",
      label: (
        <Link to="/settings">
          <ExportOutlined />&nbsp;&nbsp;Export Data
        </Link>
      )
    },
    {
      type: 'divider',
    },
    {
      key: "5",
      label: (
        <span onClick={() => handleLogout(navigate)}>
          <LogoutOutlined />&nbsp;&nbsp;Log out
        </span>
      )
    }
  ];

  return (
    <Layout style={{ width: "100%", display: "flex" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          overflowY: "auto",
          zIndex: 1000
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0",
            textAlign: "center",
            width: "100%"
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <Avatar
              size={collapsed ? 48 : 64}
              icon={<RoleIcon role={user.roleName}/>}
              style={{
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isConnected
                  // ? '0 0 15px rgba(35, 165, 90, 0.4)'
                  ? '0 0 15px rgba(22, 119, 255, 0.4)'
                  : '0 0 10px rgba(255, 77, 79, 0.3)',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: "#949494",
                fontSize: collapsed ? 30 : 42
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: `${Math.max(14, (collapsed ? 48 : 64) * 0.28)}px`,
                height: `${Math.max(14, (collapsed ? 48 : 64) * 0.28)}px`,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#1677ff' : '#ff4d4f',
                border: '3px solid #001529',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
                zIndex: 10,
                transition: 'all 0.2s ease-in-out'
              }}
              title={isConnected ? "Connected" : "Disconnected"}
            />
          </div>
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: collapsed ? "16px" : "18px",
              width: "100%",
              textAlign: "center",
              padding: "0 10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {collapsed
              ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
              : `${user?.firstName || ""} ${user?.lastName || ""}`}
          </h2>
          {!collapsed && (
            <h3
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                margin: "8px 0 0",
                fontSize: "14px",
                textTransform: "capitalize"
              }}
            >
              {user?.roleName?.toLowerCase() || ""}
            </h3>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[`${selectedMenuKey}`]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>
          }))}
        />
        {!isConnected && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "gray",
              color: "white",
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Disconnected. Reconnecting... <Spin size={"small"} />
          </div>
        )}
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
          height: "100vh",
          display: "flex",
          flexDirection: "column"
        }}>
        <Header
          style={{
            height: "64px",
            padding: "0 16px",
            background: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 999,
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            flexShrink: 0,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          <Space size="small" align="center">
            <Clock />
            <HomeworkNotificationDropdown notificationCount={notificationCount} homeworkList={homeworkNotifications}/>
            <Button type="text" icon={<VideoCameraOutlined style={{ fontSize: 20 }} />} size="large" />
            <Button type="text" icon={<BarChartOutlined style={{ fontSize: 20 }} />} size="large" />
            <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} size="large" />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            padding: "16px",
            background: "#ffffff",
            borderRadius: 8,
            flex: 1,
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            overflow: "auto" // Add this to handle content overflow
          }}
        >
          <Outlet context={{
            refetchNotifications: fetchHomeworkNotification}} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;