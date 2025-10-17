import { useCallback, useEffect, useState } from "react";
import {
  Card, Avatar, Row, Col, Input, Button, DatePicker, Switch,
  Statistic, Progress, Tag, Space, Typography, Tabs, Timeline, Alert, message
} from 'antd';
import {
  UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, CameraOutlined,
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

const UserProfile = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState({});
  const [formDataToUpdate, setFormDataToUpdate] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        message.error(errorMessage || "Failed to fetch user info");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching user info");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async (values) => {
    message.success("Profile updated successfully");
    setEditMode(false);
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
      <div style={{ padding: "6px", background: 'transparent', maxWidth: "99%" }}>
        {/* Header Section */}
        <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]} style={{ marginBottom: isMobile ? 16 : 24 }}>
          <Col span={24}>
            <Card
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: isMobile ? 12 : 16
                }}
                bodyStyle={{ padding: isMobile ? '20px' : '32px' }}
            >
              {isMobile ? (
                  // Mobile Layout - Centered vertical stack
                  <Row align="middle" gutter={[0, 16]}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            size={80}
                            icon={<RoleIcon role={formData.roleName} />}
                            style={{
                              backgroundColor: '#949494',
                              border: '4px solid rgba(255, 255, 255, 0.3)',
                              fontSize: 48
                            }}
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<CameraOutlined />}
                            size="small"
                            style={{
                              position: 'absolute',
                              bottom: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: '#667eea',
                              border: 'none'
                            }}
                            onClick={() => message.info('Photo upload functionality will be available soon')}
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ color: 'white', margin: 0, fontSize: '20px' }}>
                          {formData.firstName} {formData.lastName}
                        </Title>
                        <Space style={{ marginTop: 8 }}>
                          <Tag color={getRoleColor(formData.roleName)} style={{ fontSize: 12, padding: '2px 8px' }}>
                            {formData.roleName}
                          </Tag>
                        </Space>
                        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '12px 0 0', fontSize: 14, marginBottom: 0 }}>
                          <MailOutlined style={{ marginRight: 8 }} />
                          {formData.email}
                        </Paragraph>
                        {formData.lastSeen && (
                            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '8px 0 0', fontSize: 12, marginBottom: 0 }}>
                              Previous login: {formatLastSeen(formData.lastSeen).substring(9)}
                            </Paragraph>
                        )}
                      </div>
                    </Col>
                    <Col span={24}>
                      <Button
                          type={editMode ? 'default' : 'primary'}
                          icon={editMode ? <CloseOutlined /> : <EditOutlined />}
                          size="middle"
                          onClick={editMode ? handleCancel : () => setEditMode(true)}
                          block
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
              ) : (
                  // Desktop Layout - Horizontal
                  <Row align="middle" gutter={24}>
                    <Col>
                      <div style={{ position: 'relative' }}>
                        <Avatar
                            size={isTablet ? 100 : 120}
                            icon={<RoleIcon role={formData.roleName} />}
                            style={{
                              backgroundColor: '#949494',
                              border: '4px solid rgba(255, 255, 255, 0.3)',
                              fontSize: isTablet ? 60 : 72
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
                            onClick={() => message.info('Photo upload functionality will be available soon')}
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
                      {formData.lastSeen && (
                          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '8px 0 0', fontSize: 14 }}>
                            Previous login: {formatLastSeen(formData.lastSeen).substring(9)}
                          </Paragraph>
                      )}
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
              )}
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size={isMobile ? "middle" : "large"}
            tabBarStyle={{ marginBottom: isMobile ? 16 : 24, marginLeft: isMobile ? 10 : 20 }}
        >
          <Tabs.TabPane tab={isMobile ? "Info" : "Personal Information"} key="1">
            <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
              <Col xs={24} lg={16}>
                <Card
                    title="Basic Information"
                    extra={editMode && !isMobile && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={handleSave}
                        >
                          Save Changes
                        </Button>
                    )}
                    style={{ borderRadius: isMobile ? 8 : 12 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
                    <Row gutter={isMobile ? 8 : 16}>
                      <Col xs={24} sm={12}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                            First Name
                          </label>
                          <Input
                              prefix={<UserOutlined />}
                              disabled={!editMode}
                              size={isMobile ? "middle" : "large"}
                              value={formData.firstName}
                          />
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                            Last Name
                          </label>
                          <Input
                              prefix={<UserOutlined />}
                              disabled={!editMode}
                              size={isMobile ? "middle" : "large"}
                              value={formData.lastName}
                          />
                        </div>
                      </Col>
                    </Row>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                        Email
                      </label>
                      <Input
                          prefix={<MailOutlined />}
                          disabled={!editMode}
                          size={isMobile ? "middle" : "large"}
                          value={formData.email}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                        Username
                      </label>
                      <Input
                          prefix={<UserOutlined />}
                          disabled={true}
                          size={isMobile ? "middle" : "large"}
                          value={formData.username}
                          addonAfter={<SafetyOutlined />}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                        Phone
                      </label>
                      <Input
                          prefix={<PhoneOutlined />}
                          disabled={!editMode}
                          size={isMobile ? "middle" : "large"}
                          value={formData.phone}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                        Address
                      </label>
                      <Input.TextArea
                          disabled={!editMode}
                          rows={isMobile ? 2 : 3}
                          size={isMobile ? "middle" : "large"}
                          value={formData.address}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>
                        Birth Date
                      </label>
                      <DatePicker
                          disabled={!editMode}
                          style={{ width: '100%' }}
                          size={isMobile ? "middle" : "large"}
                          value={formData.birthDate ? dayjs(formData.birthDate) : null}
                      />
                    </div>

                    {/* Mobile save button */}
                    {editMode && isMobile && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={handleSave}
                            size="large"
                            block
                        >
                          Save Changes
                        </Button>
                    )}
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Quick Stats" style={{ borderRadius: isMobile ? 8 : 12 }}>
                  <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                    <Col xs={12} sm={12}>
                      <Statistic
                          title="Courses"
                          value={formData.courseCount || 0}
                          prefix={<BookOutlined />}
                          valueStyle={{ color: '#1677ff', fontSize: isMobile ? 20 : 24 }}
                      />
                    </Col>
                    <Col xs={12} sm={12}>
                      <Statistic
                          title="Groups"
                          value={formData.groupCount || 0}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: '#52c41a', fontSize: isMobile ? 20 : 24 }}
                      />
                    </Col>
                    <Col span={24}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>Overall Performance</Text>
                      </div>
                      <Progress
                          percent={87}
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          size={isMobile ? "small" : "default"}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Activity" key="3">
            <Card
                title="Recent Activity"
                style={{ borderRadius: isMobile ? 8 : 12 }}
                bodyStyle={{ padding: isMobile ? 16 : 24 }}
            >
              <Timeline
                  items={mockActivities.map((activity, index) => ({
                    dot: getActivityIcon(activity.type),
                    children: (
                        <div>
                          <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{activity.action}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                            {activity.course} • {activity.date}
                          </Text>
                        </div>
                    )
                  }))}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Security" key="4">
            <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
              <Col xs={24} lg={12}>
                <ChangePassword isMobile={isMobile} />
              </Col>

              <Col xs={24} lg={12}>
                <Card
                    title="Security Settings"
                    style={{ borderRadius: isMobile ? 8 : 12 }}
                    bodyStyle={{ padding: isMobile ? 16 : 24 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? "middle" : "large"}>
                    <Alert
                        message="Account Security"
                        description="Your account is secure. Last login was recorded successfully."
                        type="success"
                        showIcon
                        style={{ fontSize: isMobile ? 12 : 14 }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 8 : 0
                    }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>Two-factor Authentication</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                          Add extra security to your account
                        </Text>
                      </div>
                      <Switch />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 8 : 0
                    }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>Email Notifications</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                          Get notified about account activities
                        </Text>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button
                        type="default"
                        icon={<HistoryOutlined />}
                        style={{ width: '100%' }}
                        size={isMobile ? "middle" : "large"}
                    >
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