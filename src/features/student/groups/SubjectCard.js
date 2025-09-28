import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import Title from "antd/lib/typography/Title";
import { ArrowRightOutlined, BookOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;
export const SubjectCard = ({ record, index, page, size }) => (
  <Card
    hoverable
    className="subject-card"
    style={{
      marginBottom: 16,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}
    bodyStyle={{ padding: '20px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Badge count={page * size + index + 1} style={{ backgroundColor: '#52c41a', marginRight: 12 }} />
          <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
            <BookOutlined style={{ marginRight: 8 }} />
            {record.courseName}
          </Title>
        </div>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TeamOutlined style={{ color: '#faad14', marginRight: 8 }} />
            <Text strong>Group:</Text>
            <Tag color="orange" style={{ marginLeft: 8 }}>{record.groupName}</Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#722ed1', marginRight: 8 }} />
            <Text strong>Teacher:</Text>
            <Text style={{ marginLeft: 8 }}>{record.teacherName}</Text>
          </div>
        </Space>
      </div>

      <a href={`/student/subjects/${record.id}/tasks`}>
        <Button type="primary" icon={<ArrowRightOutlined />} size="large">
          View Tasks
        </Button>
      </a>
    </div>
  </Card>
);