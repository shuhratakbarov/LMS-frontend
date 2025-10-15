import {useCallback, useEffect, useMemo, useState} from "react";
import {Layout, Menu, Button, Avatar, Space, Dropdown, Badge, Spin, message, Drawer} from "antd";
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoreOutlined,
    SettingOutlined,
    VideoCameraOutlined,
    CustomerServiceOutlined,
    AlertOutlined,
    ExportOutlined,
    BarChartOutlined,
    CloseOutlined
} from "@ant-design/icons";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {getMenuItems} from "./MenuItems";

import {handleLogout} from "../../../utils/auth";
import {dropdownMenu, RoleIcon} from "../../../utils/util";
import Clock from "../Clock";
import {getStudentHomeworkNotification} from "../../../services/api-client";
import HomeworkNotificationDropdown from "./NotificationDropdown";

const {Header, Sider, Content} = Layout;

const SystemLayout = ({user, isConnected}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const [selectedMenuKey, setSelectedMenuKey] = useState('1');
    const [notificationCount, setNotificationCount] = useState([]);
    const [homeworkNotifications, setHomeworkNotifications] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = useMemo(() => getMenuItems(user?.roleName || ''), [user]);

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);

            // Auto-collapse on tablet
            if (width >= 768 && width < 1024) {
                setCollapsed(true);
            }

            // Close mobile drawer on resize to desktop
            if (width >= 768) {
                setMobileDrawerVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const currentItem = menuItems.find((item) => item.path === location.pathname);
        if (currentItem && currentItem.key !== selectedMenuKey) {
            setSelectedMenuKey(currentItem.key);
        }
    }, [location.pathname, menuItems, selectedMenuKey]);

    useEffect(() => {
        if (user?.roleName === "STUDENT") {
            fetchHomeworkNotification();
        }
    }, []);

    const fetchHomeworkNotification = useCallback(async () => {
        try {
            const response = await getStudentHomeworkNotification();
            const {success, data, message: errorMessage} = response.data;
            if (success) {
                setNotificationCount(data.length);
                setHomeworkNotifications(data);
            } else {
                message.error(errorMessage || "Failed to fetch notifications");
            }
        } catch (err) {
            message.error(err.message || "An error occurred while fetching notifications");
        }
    }, []);

    // Sidebar content component (reusable for both Sider and Drawer)
    const SidebarContent = ({onMenuClick}) => (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? "16px 0" : "20px 0",
                    textAlign: "center",
                    width: "100%"
                }}
            >
                <div style={{position: 'relative', display: 'inline-block', marginBottom: isMobile ? 12 : 16}}>
                    <Avatar
                        size={collapsed && !isMobile ? 48 : isMobile ? 56 : 64}
                        icon={<RoleIcon role={user.roleName}/>}
                        style={{
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: isConnected
                                ? '0 0 15px rgba(22, 119, 255, 0.4)'
                                : '0 0 10px rgba(255, 77, 79, 0.3)',
                            transition: 'all 0.2s ease-in-out',
                            backgroundColor: "#949494",
                            fontSize: collapsed && !isMobile ? 30 : isMobile ? 36 : 42
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                            width: isMobile ? '12px' : `${Math.max(14, (collapsed && !isMobile ? 48 : 64) * 0.28)}px`,
                            height: isMobile ? '12px' : `${Math.max(14, (collapsed && !isMobile ? 48 : 64) * 0.28)}px`,
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
                        fontSize: collapsed && !isMobile ? "16px" : isMobile ? "17px" : "18px",
                        width: "100%",
                        textAlign: "center",
                        padding: "0 10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {collapsed && !isMobile
                        ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
                        : `${user?.firstName || ""} ${user?.lastName || ""}`}
                </h2>
                {(!collapsed || isMobile) && (
                    <h3
                        style={{
                            color: "rgba(255, 255, 255, 0.65)",
                            margin: "8px 0 0",
                            fontSize: isMobile ? "13px" : "14px",
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
                onClick={onMenuClick}
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
                        padding: isMobile ? "8px 12px" : "6px 12px",
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: 500,
                        textAlign: "center",
                    }}
                >
                    Disconnected. Reconnecting... <Spin size="small"/>
                </div>
            )}
        </>
    );

    const handleMobileMenuClick = () => {
        if (isMobile) {
            setMobileDrawerVisible(false);
        }
    };

    return (
        <Layout style={{width: "100%", display: "flex", minHeight: "100vh"}}>
            {/* Desktop/Tablet Sidebar */}
            {!isMobile && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    trigger={null}
                    width={250}
                    collapsedWidth={80}
                    breakpoint="lg"
                    style={{
                        position: "fixed",
                        height: "100vh",
                        left: 0,
                        top: 0,
                        overflowY: "auto",
                        zIndex: 1000,
                        boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <SidebarContent onMenuClick={handleMobileMenuClick}/>
                </Sider>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    title={
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '16px', fontWeight: 'bold'}}>Menu</span>
                        </div>
                    }
                    placement="left"
                    onClose={() => setMobileDrawerVisible(false)}
                    open={mobileDrawerVisible}
                    width={280}
                    styles={{
                        body: {padding: 0, background: '#001529'},
                        header: {background: '#001529', borderBottom: '1px solid rgba(255,255,255,0.1)'}
                    }}
                    closeIcon={<CloseOutlined style={{color: 'white'}}/>}
                >
                    <SidebarContent onMenuClick={handleMobileMenuClick}/>
                </Drawer>
            )}

            <Layout
                style={{
                    marginLeft: isMobile ? 0 : (collapsed ? 80 : 250),
                    transition: "margin-left 0.2s",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Header
                    style={{
                        height: isMobile ? "56px" : "64px",
                        padding: isMobile ? "0 12px" : "0 16px",
                        background: "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 999,
                        boxShadow: "0 2px 8px rgba(0,21,41,0.08)",
                        flexShrink: 0,
                    }}
                >
                    {/* Left side - Menu toggle */}
                    <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px'}}>
                        <Button
                            type="text"
                            icon={isMobile ? <MenuUnfoldOutlined/> : (collapsed ? <MenuUnfoldOutlined/> :
                                <MenuFoldOutlined/>)}
                            onClick={() => isMobile ? setMobileDrawerVisible(true) : setCollapsed(!collapsed)}
                            style={{
                                fontSize: isMobile ? 18 : 16,
                                width: isMobile ? 40 : 48,
                                height: isMobile ? 40 : 48
                            }}
                        />
                        {/* Show user info on mobile header */}
                        {isMobile && (
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar
                                        size={32}
                                        icon={<RoleIcon role={user.roleName}/>}
                                        style={{
                                            border: '2px solid rgba(255, 255, 255, 0.1)',
                                            boxShadow: isConnected
                                                ? '0 0 10px rgba(22, 119, 255, 1)'
                                                : '0 0 8px rgba(255, 77, 79, 1)',
                                            transition: 'all 0.2s ease-in-out',
                                            backgroundColor: "#949494",
                                            fontSize: 20
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            right: '0px',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: isConnected ? '#1677ff' : '#ff4d4f',
                                            border: '1px solid gray',
                                            boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)',
                                            zIndex: 10,
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                        title={isConnected ? "Connected" : "Disconnected"}
                                    />
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    maxWidth: '120px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {user?.firstName}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right side - Actions */}
                    <Space size={isMobile ? "small" : "middle"} align="center">
                        {!isMobile && <Clock/>}

                        <HomeworkNotificationDropdown
                            notificationCount={notificationCount}
                            homeworkList={homeworkNotifications}
                            role={user.roleName}
                        />


                        <>
                            <Button
                                type="text"
                                icon={<VideoCameraOutlined style={{fontSize: 20}}/>}
                                size="large"
                                title="Video Conference"
                            />
                            <Button
                                type="text"
                                icon={<BarChartOutlined style={{fontSize: 20}}/>}
                                size="large"
                                title="Analytics"
                            />
                        </>


                        <Dropdown
                            menu={{items: dropdownMenu(navigate)}}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined style={{fontSize: 20}}/>}
                                size={isMobile ? "middle" : "large"}
                            />
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        // padding: isMobile ? "12px" : isTablet ? "14px" : "16px",
                        background: "#f0f2f5",
                        flex: 1,
                        overflow: "auto",
                        minHeight: "calc(100vh - 64px)"
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: isMobile ? 6 : 8,
                            padding: isMobile ? "12px" : isTablet ? "16px" : "20px",
                            minHeight: "100%",
                            boxShadow: "0 1px 4px rgba(0,21,41,0.08)"
                        }}
                    >
                        <Outlet context={{refetchNotifications: fetchHomeworkNotification}}/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SystemLayout;