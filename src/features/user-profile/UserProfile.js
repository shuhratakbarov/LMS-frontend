import { useCallback, useEffect, useState } from "react";
import { Card, Avatar, Row, Col, Input, Button, DatePicker, Select, Switch, Divider, Badge,
  Statistic, Progress, Tag, Space, Typography, Tabs, Timeline, Alert, message
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, CameraOutlined,
  BookOutlined, TeamOutlined, TrophyOutlined, CalendarOutlined, MailOutlined,
  PhoneOutlined, SafetyOutlined, HistoryOutlined
} from '@ant-design/icons';
import { RoleIcon } from "../../utils/util";
import ChangePassword from "../auth/ChangePassword";
import { editUser, getUserInfo } from "../../services/api-client";
import dayjs from "dayjs";
import { formatLastSeen } from "../../utils/FormatDate";

const mockActivities = [
  { date: "2024-03-15", action: "Submitted assignment", course: "CS-101", type: "assignment" },
  { date: "2024-03-14", action: "Attended lecture", course: "MATH-201", type: "attendance" },
  { date: "2024-03-13", action: "Quiz completed", course: "ENG-150", type: "quiz" },
  { date: "2024-03-12", action: "Joined group discussion", course: "CS-101", type: "discussion" }
];

const { Title, Text, Paragraph } = Typography;

const UserProfile = ({user}) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState({});
  const [formDataToUpdate, setFormDataToUpdate] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserInfo();
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setFormData(data);
      } else {
        message.error(errorMessage || "Failed to fetch students");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async (values) => {
    message.success("Profile updated successfully");
    // setLoading(true);
    // try {
    //   const response = await editUser(values, user.id);
    //   const { success, data, message: responseMessage } = response.data;
    //   if (success) {
    //     setFormData(data.content)
    //     setFormDataToUpdate(data.content)
    //     message.success("Student updated successfully");
    //   } else {
    //     message.error(responseMessage || "Failed to update student");
    //   }
    // } catch (error) {
    //   message.error(error.message || "An error occurred while updating the student");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleCancel = () => {
    setFormData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      roleName: formData.roleName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      birthDate: formData.birthDate,
      username: formData.username,
      courseCount: formData.courseCount,
      groupCount: formData.groupCount,
      lastSeen: formData.lastSeen
    });
    setEditMode(false);
  };

  // const handleInputChange = (field, value) => {
  //   setFormDataToUpdate(prev => ({ ...prev, [field]: value }));
  // };

  const getRoleColor = (role) => {
    const colors = {
      STUDENT: 'blue',
      TEACHER: 'green',
      ADMIN: 'red'
    };
    return colors[role] || 'default';
  };

  const getActivityIcon = (type) => {
    const icons = {
      assignment: <BookOutlined />,
      attendance: <CalendarOutlined />,
      quiz: <TrophyOutlined />,
      discussion: <TeamOutlined />
    };
    return icons[type] || <UserOutlined />;
  };

  return (
    <div style={{ padding: '0', background: 'transparent' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 16
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Row align="middle" gutter={24}>
              <Col>
                <div style={{ position: 'relative' }}>
                  <Avatar
                    size={120}
                    icon={<RoleIcon role={formData.roleName} />}
                    style={{
                      backgroundColor: '#949494',
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      fontSize: 72
                    }}
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#667eea',
                      border: 'none'
                    }}
                    onClick={() => message.info('Photo upload functionality will be available in the next version')}
                  />
                </div>
              </Col>
              <Col flex={1}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {formData.firstName} {formData.lastName}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag color={getRoleColor(formData.roleName)} style={{ fontSize: 14, padding: '4px 12px' }}>
                    {formData.roleName}
                  </Tag>
                </Space>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '12px 0 0', fontSize: 16 }}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {formData.email}
                </Paragraph>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '8px 0 0', fontSize: 14 }}>
                  Previous login: {formatLastSeen(formData.lastSeen).substring(9)}
                </Paragraph>
              </Col>
              <Col>
                <Button
                  type={editMode ? 'default' : 'primary'}
                  icon={editMode ? <CloseOutlined /> : <EditOutlined />}
                  size="large"
                  onClick={editMode ? handleCancel : () => setEditMode(true)}
                  style={{
                    backgroundColor: editMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'transparent',
                    color: editMode ? 'white' : '#667eea'
                  }}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <Tabs.TabPane tab="Personal Information" key="1">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                title="Basic Information"
                extra={editMode && (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                )}
                style={{ borderRadius: 12 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>First Name</label>
                        <Input
                          prefix={<UserOutlined />}
                          disabled={!editMode}
                          size="large"
                          value={formData.firstName}
                          // onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Last Name</label>
                        <Input
                          prefix={<UserOutlined />}
                          disabled={!editMode}
                          size="large"
                          value={formData.lastName}
                          // onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Email</label>
                    <Input
                      prefix={<MailOutlined />}
                      disabled={!editMode}
                      size="large"
                      value={formData.email}
                      // onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Username</label>
                    <Input
                      prefix={<UserOutlined />}
                      disabled={true}
                      size="large"
                      value={formData.username}
                      addonAfter={<SafetyOutlined />}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Phone</label>
                    <Input
                      prefix={<PhoneOutlined />}
                      disabled={!editMode}
                      size="large"
                      value={formData.phone}
                      // onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Address</label>
                    <Input.TextArea
                      disabled={!editMode}
                      rows={2}
                      size="large"
                      value={formData.address}
                      // onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Birth Date</label>
                    <DatePicker
                      disabled={!editMode}
                      style={{ width: '100%' }}
                      size="large"
                      value={formData.birthDate ? dayjs(formData.birthDate) : null}
                      // onChange={(date, dateString) => handleInputChange('birthDate', dateString)}
                    />
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Row gutter={[0, 24]}>
                {/*<Col span={24}>*/}
                {/*  <Card title="Account Status" style={{ borderRadius: 12 }}>*/}
                {/*    <Space direction="vertical" style={{ width: '100%' }}>*/}
                {/*      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                {/*        <Text>Account Active</Text>*/}
                {/*        <Badge status={mockUser.active ? "success" : "error"} />*/}
                {/*      </div>*/}
                {/*      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                {/*        <Text>Account Locked</Text>*/}
                {/*        <Badge status={mockUser.accountNonLocked ? "success" : "error"} />*/}
                {/*      </div>*/}
                {/*      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                {/*        <Text>Credentials Valid</Text>*/}
                {/*        <Badge status={mockUser.credentialsNonExpired ? "success" : "error"} />*/}
                {/*      </div>*/}
                {/*      <Divider style={{ margin: '12px 0' }} />*/}
                {/*      <Text type="secondary" style={{ fontSize: 12 }}>*/}
                {/*        Member since: {mockUser.createdAt}*/}
                {/*      </Text>*/}
                {/*    </Space>*/}
                {/*  </Card>*/}
                {/*</Col>*/}

                <Col span={24}>
                  <Card title="Quick Stats" style={{ borderRadius: 12 }}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic
                          title="Courses"
                          value={formData.courseCount}
                          prefix={<BookOutlined />}
                          valueStyle={{ color: '#1677ff' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Groups"
                          value={formData.groupCount}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={24}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Overall Performance</Text>
                        </div>
                        <Progress
                          percent={87}
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Activity" key="3">
          <Card title="Recent Activity" style={{ borderRadius: 12 }}>
            <Timeline
              items={mockActivities.map((activity, index) => ({
                dot: getActivityIcon(activity.type),
                children: (
                  <div>
                    <Text strong>{activity.action}</Text>
                    <br />
                    <Text type="secondary">{activity.course} • {activity.date}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Security" key="4">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <ChangePassword />
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Security Settings" style={{ borderRadius: 12 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Alert
                    message="Account Security"
                    description="Your account is secure. Last login was recorded successfully."
                    type="success"
                    showIcon
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Two-factor Authentication</Text>
                      <br />
                      <Text type="secondary">Add extra security to your account</Text>
                    </div>
                    <Switch />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Email Notifications</Text>
                      <br />
                      <Text type="secondary">Get notified about account activities</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button type="default" icon={<HistoryOutlined />} style={{ width: '100%' }}>
                    View Login History
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UserProfile;