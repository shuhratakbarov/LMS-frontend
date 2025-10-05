import {useNavigate} from 'react-router-dom';
import {Badge, Button, Dropdown, List, Typography, Tag} from 'antd';
import {BellOutlined, ClockCircleOutlined} from '@ant-design/icons';

const {Text, Title} = Typography;

const HomeworkNotificationDropdown = ({notificationCount, homeworkList, role}) => {
    const navigate = useNavigate();

    const getDaysLeftColor = (daysLeft) => {
        if (daysLeft <= 1) return 'red';
        if (daysLeft <= 3) return 'orange';
        return 'green';
    };

    const handleItemClick = (item) => {
        navigate(`/student/subjects/${item.groupId}/tasks`, {state: {record: item}});
    };

    const dropdownContent = (
        <div style={{
            width: 350,
            padding: '8px 0',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #d9d9d9'
        }}>
            <Title level={5} style={{margin: '8px 16px', color: '#666'}}>
                Upcoming Homework
            </Title>
            <List
                dataSource={homeworkList}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => handleItemClick(item)}
                    >
                        <div style={{width: '100%'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '4px'
                            }}>
                                <Text strong style={{fontSize: '14px'}}>{item.taskName}</Text>
                                <Tag color={getDaysLeftColor(item.daysLeft)} icon={<ClockCircleOutlined/>}>
                                    {item.daysLeft}d left
                                </Tag>
                            </div>
                            <Text type="secondary" style={{fontSize: '12px', display: 'block'}}>
                                {item.taskType} • {item.courseName} • {item.groupName}
                            </Text>
                            <Text type="secondary" style={{fontSize: '11px'}}>
                                Due: {new Date(item.deadline).toLocaleDateString()}
                            </Text>
                        </div>
                    </List.Item>
                )}
            />
            {homeworkList.length === 0 && (
                <div style={{padding: '20px', textAlign: 'center'}}>
                    <Text type="secondary">No pending homework</Text>
                </div>
            )}
        </div>
    );

    return (
        role === "STUDENT"
            ? <Dropdown
                overlay={dropdownContent}
                trigger={['click']}
                placement="bottomRight"
                arrow={{pointAtCenter: true}}
            >
                <Badge
                    count={notificationCount}
                    showZero={false}
                    size="small"
                    offset={[-8, 8]}
                >
                    <Button type="text" icon={<BellOutlined style={{fontSize: 20}}/>} size="large"/>
                </Badge>
            </Dropdown>
            : <Badge
                count={0}
                showZero={false}
                size="small"
                offset={[-8, 8]}
            >
                <Button type="text" icon={<BellOutlined style={{fontSize: 20}}/>} size="large"/>
            </Badge>
    );
};

export default HomeworkNotificationDropdown;