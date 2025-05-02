import { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Dropdown, Badge, message } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  SettingOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getMenuItems } from "../../const/MenuItems";
import Clock from "../const/Clock";
import { deleteAuthData, getAccessToken } from "../../utils/auth";
import { logout } from "../../services/api-client";

const { Header, Sider, Content } = Layout;
const logoImagePath = "../images/tuit.png";

const UserLayout = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('1');
  const [notificationCount, setNotificationCount] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // const getCount = async () => {
  //     const {user} = this.state;
  //     if (user?.roleName === 'ROLE_STUDENT') {
  //         let url = `${serverURL}students/get-count`;
  //         axios({
  //             url: url,
  //             method: "GET",
  //             headers: {
  //                 Authorization: `Bearer ${getAccessToken()}`
  //             }
  //         })
  //             .then((res) => {
  //                 let dto = res.data;
  //                 console.log(dto);
  //                 if (dto.success) {
  //                     this.setState({
  //                         count: dto.data[0],
  //                     })
  //                 } else {
  //                     alert(dto.message)
  //                 }
  //             })
  //             .catch((err) => {
  //                 alert(url)
  //                 message.error(err);
  //             });
  //         this.setState({})
  //     }
  // }

  const menuItems = useMemo(() => getMenuItems(user?.roleName || ''), [user]);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem && currentItem.key !== selectedMenuKey) {
      setSelectedMenuKey(currentItem.key);
    }
  }, [location.pathname, menuItems, selectedMenuKey]);

  const handleLogout = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        deleteAuthData();
        navigate("/login");
        message.info("Session already expired");
        return;
      }
      const response = await logout(token); // Await the logout call
      if (response.data.success) {
        deleteAuthData();
        navigate("/login");
        message.success("Logged out successfully");
      } else {
        deleteAuthData();
        navigate("/login");
        message.error(response.data.message || "Logout failed");
      }
    } catch (error) {
      deleteAuthData();
      navigate("/login");
      message.error("Logout failed: " + error.message);
    }
  };

  const dropdownMenu = [
    {
      key: "1",
      label: (
        <Link to="/settings">
          <SettingOutlined /> Settings
        </Link>
      )
    },
    {
      key: "2",
      label: (
        <span onClick={handleLogout}>
          <LogoutOutlined /> Log out
        </span>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
        <Space
          direction="vertical"
          style={{
            padding: "20px 0",
            textAlign: "center"
          }}
        >
          <Avatar
            size={64}
            src={<img src={logoImagePath} alt="Logo" style={{ width: "100%", height: "100%" }} />}
            style={{ marginBottom: 16 }}
          />
          <h2 style={{ color: "white", margin: 0 }}>
            {collapsed
              ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
              : `${user?.firstName} ${user?.lastName}`}
          </h2>
          {!collapsed && (
            <h3 style={{ color: "white", margin: "8px 0 0" }}>
              {user?.roleName?.substring(5)}
            </h3>
          )}
        </Space>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[`${selectedMenuKey}`]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>
          }))}
          style={{ marginTop: 24 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header
          style={{
            height: "8vh",
            padding: "0 2vh",
            background: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 999
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
          <Space size="middle">
            {/*{user?.roleName === "ROLE_STUDENT" && notificationCount > 0 && (*/}
              <Badge count={notificationCount}>
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            {/*)}*/}
            <Clock />
            <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight">
              <MoreOutlined style={{ fontSize: 24, cursor: "pointer" }} />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: "1vh 1vh",
            padding: 24,
            background: "#ffffff",
            borderRadius: 8,
            minHeight: "calc(100vh - 112px)",
            overflow: "hidden" // Add this to prevent Content from handling overflow
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;