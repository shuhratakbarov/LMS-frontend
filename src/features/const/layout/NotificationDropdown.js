import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Dropdown, List, Typography, Tag, Drawer } from 'antd';
import { BellOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const HomeworkNotificationDropdown = ({ notificationCount, homeworkList, role }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getDaysLeftColor = (daysLeft) => {
        if (daysLeft <= 1) return 'red';
        if (daysLeft <= 3) return 'orange';
        return 'green';
    };

    const handleItemClick = (item) => {
        if (isMobile) setDrawerVisible(false);
        navigate(`/student/subjects/${item.groupId}/tasks`, { state: { record: item } });
    };

    const handleBellClick = () => {
        if (isMobile && role === "STUDENT") {
            setDrawerVisible(true);
        }
    };

    const NotificationContent = () => (
        <div style={{
            width: '100%',
            backgroundColor: '#fff'
        }}>
            <List
                dataSource={homeworkList}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: isMobile ? '12px 0' : '12px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                            if (!isMobile) e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => handleItemClick(item)}
                    >
                        <div style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: isMobile ? 6 : 4,
                                gap: 8
                            }}>
                                <Text strong style={{
                                    fontSize: isMobile ? 13 : 14,
                                    flex: 1,
                                    lineHeight: 1.4
                                }}>
                                    {item.taskName}
                                </Text>
                                <Tag
                                    color={getDaysLeftColor(item.daysLeft)}
                                    icon={<ClockCircleOutlined />}
                                    style={{
                                        fontSize: isMobile ? 10 : 11,
                                        padding: isMobile ? '0 6px' : '0 8px',
                                        flexShrink: 0
                                    }}
                                >
                                    {item.daysLeft}d
                                </Tag>
                            </div>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: isMobile ? 11 : 12,
                                    display: 'block',
                                    lineHeight: 1.5
                                }}
                            >
                                {item.taskType} • {item.courseName}
                            </Text>
                            {!isMobile && (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    {item.groupName}
                                </Text>
                            )}
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: isMobile ? 10 : 11,
                                    display: 'block',
                                    marginTop: 2
                                }}
                            >
                                Due: {new Date(item.deadline).toLocaleDateString()}
                            </Text>
                        </div>
                    </List.Item>
                )}
            />
            {homeworkList.length === 0 && (
                <div style={{
                    padding: isMobile ? '30px 20px' : '20px',
                    textAlign: 'center'
                }}>
                    <Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>
                        No pending homework
                    </Text>
                </div>
            )}
        </div>
    );

    const dropdownContent = (
        <div style={{
            width: isMobile ? 280 : 350,
            padding: '8px 0',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #d9d9d9',
            maxHeight: isMobile ? '60vh' : '500px',
            overflowY: 'auto'
        }}>
            <Title
                level={5}
                style={{
                    margin: isMobile ? '6px 12px' : '8px 16px',
                    color: '#666',
                    fontSize: isMobile ? 14 : 16
                }}
            >
                Upcoming Homework
            </Title>
            <NotificationContent />
        </div>
    );

    if (role !== "STUDENT") {
        return (
            <Badge
                count={0}
                showZero={false}
                size="small"
                offset={[-8, 8]}
            >
                <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: isMobile ? 18 : 20 }} />}
                    size={isMobile ? "middle" : "large"}
                />
            </Badge>
        );
    }

    return (
        <>
            {isMobile ? (
                <>
                    <Badge
                        count={notificationCount}
                        showZero={false}
                        size="small"
                        offset={[-8, 8]}
                    >
                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: 18 }} />}
                            size="middle"
                            onClick={handleBellClick}
                        />
                    </Badge>
                    <Drawer
                        title={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <span style={{ fontSize: 16, fontWeight: 600 }}>
                                    Upcoming Homework
                                </span>
                                {notificationCount > 0 && (
                                    <Badge
                                        count={notificationCount}
                                        style={{
                                            backgroundColor: '#1890ff',
                                            boxShadow: '0 0 0 1px #fff'
                                        }}
                                    />
                                )}
                            </div>
                        }
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        width="85%"
                        styles={{
                            body: { padding: '12px 16px' }
                        }}
                        closeIcon={<CloseOutlined />}
                    >
                        <NotificationContent />
                    </Drawer>
                </>
            ) : (
                <Dropdown
                    overlay={dropdownContent}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                >
                    <Badge
                        count={notificationCount}
                        showZero={false}
                        size="small"
                        offset={[-8, 8]}
                    >
                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: 20 }} />}
                            size="large"
                        />
                    </Badge>
                </Dropdown>
            )}
        </>
    );
};

export default HomeworkNotificationDropdown;