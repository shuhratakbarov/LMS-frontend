import React, {useEffect, useMemo, useState} from 'react';
import {Layout, Menu, Button, Avatar, Space, Dropdown, Badge, message} from 'antd';
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoreOutlined,
    SettingOutlined,
    BellOutlined
} from '@ant-design/icons';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {useAxios} from '../../server/AxiosProvider';
import {ENDPOINTS} from '../../server/endpoints';
import {deleteToken, getToken} from '../../util/TokenUtil';
import {getItems} from '../../server/serverConsts';
import Clock from '../const/Clock';
import DashboardService from "../../components/admin/dashboard/dashboardService";
import AdminDashboard from "../../components/admin/dashboard/AdminDashboard";
import { useNavigate } from 'react-router-dom';

const imagePath = `../images/tuit.png`;
const {Header, Sider, Content} = Layout;

const UserLayout = ({user}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [menuSelectedKey, setMenuSelectedKey] = useState('1');
    // const [user, setUser] = useState(null);
    // const [menuItems, setMenuItems] = useState([]);
    const [notificationCount, setNotificationCount] = useState([]);
    const location = useLocation();
    const {get, loading} = useAxios();
    const navigate = useNavigate();

    // const getUserInfo = async () => {
    //     try {
    //         const user = await get(ENDPOINTS.USERINFO);
    //         setUser(user);
    //         // setMenuItems(getItems(user ? user.roleName : ''));
    //     } catch (err) {
    //         message.error('Failed to fetch user information');
    //     }
    // };
    //
    //
    // useEffect(() => {
    //     getUserInfo(); // Fetch user info when component mounts
    // }, []);

    // const getCount = async () => {
    //     const {user} = this.state;
    //     if (user?.roleName === 'ROLE_STUDENT') {
    //         let url = `${serverURL}student/get-count`;
    //         axios({
    //             url: url,
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${getToken()}`
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

    const menuItems = useMemo(() => {
        return getItems(user ? user.roleName : '');
    }, [user]);

    useEffect(() => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        if (currentItem && currentItem.key !== menuSelectedKey) {
            setMenuSelectedKey(currentItem.key);
        }
    }, [location.pathname, menuItems, menuSelectedKey]);

    const handleLogOut = () => {
        navigate("/")
        deleteToken();
        window.location.reload();
    };

    const dropDownItems = [
        {
            key: '1',
            label: (
                <Link to="/settings">
                    <p>
                        <SettingOutlined />&nbsp;&nbsp;Settings
                    </p>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <p onClick={handleLogOut}>
                    <LogoutOutlined />&nbsp;&nbsp;Logout
                </p>
            )
        },
    ];

    return (
        loading?<div>Loading...</div>:
        <Layout style={{minHeight: '100vh', margin: 0, padding: 0}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Space direction="vertical" size={16}>
                    <Space
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            flexDirection: "column",
                            paddingTop: '10%',
                            height: '100%',
                        }}
                        wrap size={16}>
                        <Avatar style={{
                            width: '100%',
                            alignItems: "center",
                        }} size={64} icon={collapsed ?
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                src={imagePath}
                                alt="tuit"
                            />
                            : <img
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                src={imagePath}
                                alt="tuit"
                            />
                        }/>
                        <h2
                            style={{
                                color: 'white',
                                textAlign: "center",
                                float: "center",
                            }}>
                            {
                                collapsed ? `   ${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}` :
                                    `   ${user?.firstName} ${user?.lastName}`
                            }
                        </h2>
                        <h2
                            style={{
                                color: 'white',
                                textAlign: "center",
                                float: "center",
                            }}> {collapsed ? '' : user?.roleName.substring(5)}
                        </h2>
                    </Space>
                </Space>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[`${menuSelectedKey}`]}
                    items={menuItems.map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: <Link to={item.path}>{item.label}</Link>,
                    }))}
                    // onClick={handleMenuClick}
                />
            </Sider>
            <Layout style={{minHeight: '100%'}}>
                <Header style={{
                    height: "10vh",
                    padding: 0,
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', marginRight: "5vh", height: "2vh"}}>
                        {user?.roleName === 'ROLE_STUDENT' && notificationCount !== 0 ? <Badge count={notificationCount}>
                            <BellOutlined style={{fontSize: "3vh"}}/>
                        </Badge> : ''}
                        <Clock/>
                        <Dropdown
                            menu={{
                                items: dropDownItems,
                            }}
                            placement="bottomRight"
                        >
                            <p style={{fontSize: "4vh"}}><MoreOutlined /></p>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#ffffff',
                        borderRadius: 8,
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserLayout;
