import {Card, Col, Progress, Row, Space, Statistic, Tag, Typography} from "antd";
import {
  BookOutlined, CheckCircleOutlined, ClockCircleOutlined, FallOutlined,
  GroupOutlined, RiseOutlined, SyncOutlined,
  TeamOutlined, TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";

const {Text, Title} = Typography;

const DASHBOARD_ELEMENTS = {
  Courses: {
    title: "Courses",
    icon: <BookOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    trend: "+12%",
    trendType: "up"
  },
  Groups: {
    title: "Groups",
    icon: <GroupOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    trend: "+8%",
    trendType: "up"
  },
  Teachers: {
    title: "Teachers",
    icon: <UserOutlined />,
    color: "#722ed1",
    bgColor: "#f9f0ff",
    trend: "+5%",
    trendType: "up"
  },
  Students: {
    title: "Students",
    icon: <TeamOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    trend: "+15%",
    trendType: "up"
  },
};

export const StatCard = ({ stat, isMobile, isTablet }) => {
  const element = DASHBOARD_ELEMENTS[stat.title];
  if (!element) return null;

  // Calculate a mock percentage for progress (you can replace with real data)
  const progressPercent = Math.min((stat.value / 100) * 100, 100);

  return (
      <Card
          hoverable
          style={{
            borderRadius: isMobile ? 8 : 12,
            border: `1px solid ${element.color}20`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            height: "100%",
            transition: "all 0.3s ease",
          }}
          bodyStyle={{ padding: isMobile ? 16 : 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header with icon and trend */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: isMobile ? 12 : 16
          }}>
            <div
                style={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  borderRadius: isMobile ? 8 : 10,
                  background: element.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? 20 : 24,
                  color: element.color,
                }}
            >
              {element.icon}
            </div>
            {!isMobile && (
                <Tag
                    icon={element.trendType === "up" ? <RiseOutlined /> : <FallOutlined />}
                    color={element.trendType === "up" ? "success" : "error"}
                    style={{ margin: 0 }}
                >
                  {element.trend}
                </Tag>
            )}
          </div>

          {/* Title and Value */}
          <div style={{ marginBottom: isMobile ? 8 : 12 }}>
            <Text
                type="secondary"
                style={{
                  fontSize: isMobile ? 12 : 14,
                  display: "block",
                  marginBottom: 4
                }}
            >
              {element.title}
            </Text>
            <Title
                level={isMobile ? 3 : 2}
                style={{
                  margin: 0,
                  color: element.color,
                  fontSize: isMobile ? 24 : 32,
                  fontWeight: 600,
                }}
            >
              {stat.value?.toLocaleString() || 0}
            </Title>
          </div>

          {/* Progress bar (optional - shows capacity/growth) */}
          {!isMobile && (
              <div style={{ marginTop: "auto" }}>
                <Progress
                    percent={progressPercent}
                    strokeColor={element.color}
                    showInfo={false}
                    size="small"
                />
              </div>
          )}
        </div>
      </Card>
  );
};

export const QuickStats = ({ isMobile, isTablet }) => {
  // Mock data - replace with real API data
  const quickStats = [
    {
      label: "Active Today",
      value: "245",
      icon: <CheckCircleOutlined />,
      color: "#52c41a"
    },
    {
      label: "Pending Tasks",
      value: "12",
      icon: <ClockCircleOutlined />,
      color: "#faad14"
    },
    {
      label: "Completion Rate",
      value: "87%",
      icon: <TrophyOutlined />,
      color: "#1890ff"
    },
    {
      label: "System Status",
      value: "Healthy",
      icon: <SyncOutlined spin />,
      color: "#52c41a"
    }
  ];

  return (
      <Card
          title={
            <Space>
              <TrophyOutlined style={{ color: "#1890ff" }} />
              <span>Quick Overview</span>
            </Space>
          }
          style={{
            borderRadius: isMobile ? 8 : 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
          bodyStyle={{ padding: isMobile ? 12 : 16 }}
      >
        <Row gutter={[12, 12]}>
          {quickStats.map((stat, index) => (
              <Col xs={12} sm={12} md={6} key={index}>
                <div
                    style={{
                      textAlign: "center",
                      padding: isMobile ? "12px 8px" : "16px 12px",
                      background: "#fafafa",
                      borderRadius: 8,
                      transition: "all 0.3s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                  <div style={{ fontSize: isMobile ? 20 : 24, color: stat.color, marginBottom: 8 }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, marginBottom: 4 }}>
                    {stat.value}
                  </div>
                  <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                    {stat.label}
                  </Text>
                </div>
              </Col>
          ))}
        </Row>
      </Card>
  );
};

export const RecentActivity = ({ isMobile }) => {
  // Mock data - replace with real API data
  const activities = [
    { action: "New course created", time: "2 minutes ago", type: "success" },
    { action: "5 students enrolled", time: "15 minutes ago", type: "info" },
    { action: "Assignment submitted", time: "1 hour ago", type: "default" },
    { action: "Teacher added", time: "3 hours ago", type: "success" }
  ];

  return (
      <Card
          title="Recent Activity"
          style={{
            borderRadius: isMobile ? 8 : 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            height: "100%"
          }}
          bodyStyle={{ padding: isMobile ? 12 : 16 }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={isMobile ? "small" : "middle"}>
          {activities.map((activity, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: activity.type === "success" ? "#52c41a" : activity.type === "info" ? "#1890ff" : "#d9d9d9"
                      }}
                  />
                  <Text style={{ fontSize: isMobile ? 13 : 14 }}>{activity.action}</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                  {activity.time}
                </Text>
              </div>
          ))}
        </Space>
      </Card>
  );
};