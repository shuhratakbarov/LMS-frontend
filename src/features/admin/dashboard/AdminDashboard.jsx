import { Fragment, useEffect, useState } from "react";
import {Row, message, Typography, Col, Card, Skeleton, Space, Divider, Empty, Tag} from "antd";
import { getAdminDashboardStats } from "../../../services/api-client";
import DashboardStats, {QuickStats, RecentActivity, StatCard} from "./AdminDashboardStats";
import LastUpdated from "../../const/LastUpdated";

const { Title, Text } = Typography;
const AdminDashboard = () => {
  const [generalStats, setGeneralStats] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const startFetching = async () => {
    setLoading(true);
    setGeneralStats([]);
    try {
      const response = await getAdminDashboardStats();
      if (response.data.success) {
        setGeneralStats(response.data.data);
      } else {
        message.error(response.data.message || "Failed to load stats");
      }
    } catch (error) {
      message.error("An error occurred while fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startFetching();
  }, []);

  if (loading) {
    return (
        <Fragment>
          <Title level={isMobile ? 3 : 2} style={{ textAlign: "center", marginBottom: 24 }}>
            General Statistics
          </Title>
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((item) => (
                <Col xs={24} sm={12} md={12} lg={6} key={item}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
            ))}
          </Row>
        </Fragment>
    );
  }

  if (!generalStats || generalStats.length === 0) {
    return (
        <Fragment>
          <Title level={isMobile ? 3 : 2} style={{ textAlign: "center", marginBottom: 24 }}>
            General Statistics
          </Title>
          <Empty description="No statistics available" />
        </Fragment>
    );
  }

  return (
      <div style={{padding: "6px"}}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: isMobile ? 20 : 32,
          padding: isMobile ? "2px 8px" : 0
        }}>
          <Title
              level={isMobile ? 3 : 2}
              style={{
                margin: 0,
                marginBottom: isMobile ? 8 : 12,
                fontSize: isMobile ? 20 : 28
              }}
          >
            📊 Admin Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>
            Welcome back! Here's what's happening with your platform today.
          </Text>
        </div>

        {/* Main Stats Cards */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 16 : 24 }}>
          {generalStats.map((stat, index) => (
              <Col xs={12} sm={6} md={12} lg={6} key={`${stat.title}-${index}`}>
                <StatCard stat={stat} isMobile={isMobile} isTablet={isTablet} />
              </Col>
          ))}
        </Row>

        {/* Quick Stats Section */}
        <div style={{ marginBottom: isMobile ? 16 : 24 }}>
          <QuickStats isMobile={isMobile} isTablet={isTablet} />
        </div>

        {/* Recent Activity & Additional Info */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
          <Col xs={24} md={24} lg={12}>
            <RecentActivity isMobile={isMobile} />
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Card
                title="System Information"
                style={{
                  borderRadius: isMobile ? 8 : 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  height: "100%"
                }}
                bodyStyle={{ padding: isMobile ? 12 : 16 }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={isMobile ? "small" : "middle"}>
                <div>
                  <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>Platform Version</Text>
                  <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500 }}>v1.0.1</div>
                </div>
                <Divider style={{ margin: isMobile ? "8px 0" : "12px 0" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>Server Status</Text>
                  <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500 }}>
                    <Tag color="success">Online</Tag>
                  </div>
                </div>
                <Divider style={{ margin: isMobile ? "8px 0" : "12px 0" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>Database Status</Text>
                  <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500 }}>
                    <Tag color="success">Connected</Tag>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Last Updated */}
        {/*<div style={{ marginTop: isMobile ? 16 : 24 }}>*/}
        {/*  <LastUpdated />*/}
        {/*</div>*/}
      </div>
  );
};

export default AdminDashboard;