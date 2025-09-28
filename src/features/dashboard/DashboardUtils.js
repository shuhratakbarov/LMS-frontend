import { Avatar, Card, Col, Empty, Row, Statistic, Tag, Timeline, Typography } from "antd";
import { getTimeAgo, updateTypeConfig } from "../../utils/util";
import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FireOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export const UpdateCard = ({ update, readUpdates, markAsRead }) => {
  const isRead = readUpdates.has(update.id);
  const isUrgent = update.type === 'NOTICE' || update.type === 'ANNOUNCEMENT';

  return (
    <Card
      hoverable
      style={{
        marginBottom: 16,
        border: isUrgent && !isRead ? '2px solid #ff4d4f' : '1px solid #f0f0f0',
        boxShadow: !isRead ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
      onClick={() => !isRead && markAsRead(update.id)}
    >
      {!isRead && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            zIndex: 1
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar
          icon={updateTypeConfig[update.type]?.icon}
          style={{
            backgroundColor: updateTypeConfig[update.type]?.color,
            flexShrink: 0
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
            <Tag
              icon={updateTypeConfig[update.type]?.icon}
              color={updateTypeConfig[update.type]?.color}
              style={{ margin: 0 }}
            >
              {updateTypeConfig[update.type]?.label}
            </Tag>

            {isUrgent && !isRead && (
              <Tag color="red" icon={<FireOutlined />}>
                Urgent
              </Tag>
            )}

            <Text type="secondary" style={{ fontSize: '12px', marginLeft: 'auto' }}>
              {getTimeAgo(update.createdAt)}
            </Text>
          </div>

          <Title
            level={5}
            style={{
              margin: '0 0 8px 0',
              fontWeight: isRead ? 400 : 600,
              color: isRead ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.85)'
            }}
          >
            {update.title}
          </Title>

          <Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
            style={{
              margin: 0,
              color: isRead ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.65)'
            }}
          >
            {update.body}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export const QuickStats = ({stats}) => (
  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
    <Col xs={12} sm={6}>
      <Card>
        <Statistic
          title="Total Updates"
          value={stats.totalUpdates}
          prefix={<FileTextOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Card>
    </Col>
    <Col xs={12} sm={6}>
      <Card>
        <Statistic
          title="Unread"
          value={stats.unreadUpdates}
          prefix={<EyeOutlined />}
          valueStyle={{ color: stats.unreadUpdates > 0 ? '#fa8c16' : '#52c41a' }}
        />
      </Card>
    </Col>
    <Col xs={12} sm={6}>
      <Card>
        <Statistic
          title="This Week"
          value={stats.thisWeekUpdates}
          prefix={<CalendarOutlined />}
          valueStyle={{ color: '#52c41a' }}
        />
      </Card>
    </Col>
    <Col xs={12} sm={6}>
      <Card>
        <Statistic
          title="Important"
          value={stats.urgentUpdates}
          prefix={<ExclamationCircleOutlined />}
          valueStyle={{ color: '#f5222d' }}
        />
      </Card>
    </Col>
  </Row>
);

export const RecentActivity = ({updates}) => {
  const recentUpdates = updates.slice(0, 5);

  return (
    <Card title="Recent Activity" size="small">
      {recentUpdates.length === 0 ? (
        <Empty description="No recent activity" />
      ) : (
        <Timeline
          size="small"
          items={recentUpdates.map(update => ({
            key: update.id,
            dot: (
              <Avatar
                size="small"
                icon={updateTypeConfig[update.type]?.icon}
                style={{ backgroundColor: updateTypeConfig[update.type]?.color }}
              />
            ),
            children: (
              <div>
                <Text strong style={{ fontSize: '12px' }}>
                  {updateTypeConfig[update.type]?.label}
                </Text>
                <br />
                <Text style={{ fontSize: '11px' }} ellipsis>
                  {update.title}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {getTimeAgo(update.createdAt)}
                </Text>
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
};