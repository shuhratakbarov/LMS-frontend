import { useState, useEffect } from 'react';
import {
  Card, Row, Col, Typography, Space, Badge, Button,
  Empty, Spin, Progress, Alert
} from 'antd';
import {
  BellOutlined, CalendarOutlined, BookOutlined,
  TrophyOutlined, TeamOutlined, FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { getUserUpdates } from "../../services/api-client";
import { getGreeting } from "../../utils/util";
import { QuickStats, RecentActivity, UpdateCard } from "./DashboardUtils";

const { Title, Text } = Typography;

const Dashboard = ({user}) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUpdates: 0,
    unreadUpdates: 0,
    thisWeekUpdates: 0,
    urgentUpdates: 0
  });
  const [readUpdates, setReadUpdates] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      // Get read updates from localStorage first
      const saved = localStorage.getItem(`readUpdates_${user.username}`);
      const savedReadUpdates = saved ? new Set(JSON.parse(saved)) : new Set();

      // Update state with localStorage data
      setReadUpdates(savedReadUpdates);

      // Now fetch updates and calculate stats using the actual localStorage data
      setLoading(true);
      try {
        const res = await getUserUpdates(user.roleName);
        const userUpdates = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUpdates(userUpdates);

        const total = userUpdates.length;
        // Use savedReadUpdates directly instead of readUpdates state
        const unread = userUpdates.filter(update => !savedReadUpdates.has(update.id)).length;
        const thisWeek = userUpdates.filter(update => {
          const updateDate = new Date(update.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return updateDate >= weekAgo;
        }).length;
        const urgent = userUpdates.filter(update =>
          update.type === 'NOTICE' || update.type === 'ANNOUNCEMENT'
        ).length;

        setStats({
          totalUpdates: total,
          unreadUpdates: unread,
          thisWeekUpdates: thisWeek,
          urgentUpdates: urgent
        });
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const markAsRead = (updateId) => {
    const newReadUpdates = new Set([...readUpdates, updateId]);
    setReadUpdates(newReadUpdates);
    localStorage.setItem(`readUpdates_${user.username}`, JSON.stringify([...newReadUpdates]));

    setStats(prev => ({
      ...prev,
      unreadUpdates: Math.max(0, prev.unreadUpdates - 1)
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          {getGreeting()}, {user.firstName}! 👋
        </Title>
        <Text type="secondary">
          Here's what's happening in your {user.roleName.toLowerCase() === 'student' ? 'studies' : 'classes'} today
        </Text>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats}/>

      {/* Urgent Alerts */}
      {stats.unreadUpdates > 0 && (
        <Alert
          message={`You have ${stats.unreadUpdates} unread update${stats.unreadUpdates > 1 ? 's' : ''}`}
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          icon={<BellOutlined />}
        />
      )}

      <Row gutter={[16, 16]}>
        {/* Main Updates Feed */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <BellOutlined style={{ marginRight: 8 }} />
                  Updates & Announcements
                </span>
                {stats.unreadUpdates > 0 && (
                  <Badge count={stats.unreadUpdates} />
                )}
              </div>
            }
            extra={
              <Button
                type="text"
                size="small"
                onClick={() => {
                  const allIds = new Set(updates.map(u => u.id));
                  setReadUpdates(allIds);
                  localStorage.setItem(`readUpdates_${user.username}`, JSON.stringify([...allIds]));
                  setStats(prev => ({ ...prev, unreadUpdates: 0 }));
                }}
                disabled={stats.unreadUpdates === 0}
              >
                Mark all as read
              </Button>
            }
            bodyStyle={{ padding: '16px' }}
          >
            {updates.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No updates available"
              />
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {updates.map(update => (
                  <UpdateCard key={update.id} update={update} readUpdates={readUpdates} markAsRead={markAsRead} />
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {/* Recent Activity */}
            <RecentActivity updates={updates}/>

            {/* Reading Progress */}
            <Card title="Reading Progress" size="small">
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={Math.round(((stats.totalUpdates - stats.unreadUpdates) / Math.max(stats.totalUpdates, 1)) * 100)}
                  format={() => `${stats.totalUpdates - stats.unreadUpdates}/${stats.totalUpdates}`}
                  size={80}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Updates read this week
                  </Text>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            {/*<Card title="Quick Actions" size="small">*/}
            {/*  <Space direction="vertical" style={{ width: '100%' }}>*/}
            {/*    {user.roleName.toLowerCase() === 'student' ? (*/}
            {/*      <>*/}
            {/*        <Button block icon={<BookOutlined />}>*/}
            {/*          My Courses*/}
            {/*        </Button>*/}
            {/*        <Button block icon={<CalendarOutlined />}>*/}
            {/*          Schedule*/}
            {/*        </Button>*/}
            {/*        <Button block icon={<TrophyOutlined />}>*/}
            {/*          Grades*/}
            {/*        </Button>*/}
            {/*      </>*/}
            {/*    ) : (*/}
            {/*      <>*/}
            {/*        <Button block icon={<TeamOutlined />}>*/}
            {/*          My Classes*/}
            {/*        </Button>*/}
            {/*        <Button block icon={<FileTextOutlined />}>*/}
            {/*          Assignments*/}
            {/*        </Button>*/}
            {/*        <Button block icon={<BarChartOutlined />}>*/}
            {/*          Reports*/}
            {/*        </Button>*/}
            {/*      </>*/}
            {/*    )}*/}
            {/*  </Space>*/}
            {/*</Card>*/}

          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;