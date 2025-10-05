import { Card, Col, Statistic } from "antd";
import {
  BookOutlined,
  GroupOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const DASHBOARD_ELEMENTS = {
  Courses: {
    title: "Courses",
    prefix: <BookOutlined />,
    suffix: "",
    color: "#111111",
  },
  Groups: {
    title: "Groups",
    prefix: <GroupOutlined />,
    suffix: "",
    color: "#111111",
  },
  Teachers: {
    title: "Teachers",
    prefix: <UserOutlined />,
    suffix: "",
    color: "#111111",
  },
  Students: {
    title: "Students",
    prefix: <TeamOutlined />,
    suffix: "",
    color: "#111111",
  },
};

const DashboardStats = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return stats.map((stat, index) => {
    const element = DASHBOARD_ELEMENTS[stat.title];
    if (!element) return null;

    return (
      <Col span={6} key={`${stat.title}-${index}`}>
        <Card>
          <Statistic
            title={element.title}
            value={stat.value || 0}
            prefix={element.prefix}
            suffix={stat.suffix}
            valueStyle={{ color: element.color }}
          />
        </Card>
      </Col>
    );
  });
};

export default DashboardStats;