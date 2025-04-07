import {
  GroupOutlined,
  TeamOutlined,
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  MessageOutlined,
  TableOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  MailOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const serverURL = "http://localhost:8082/api/";
export const getMenuItems = (role) => {
  let items;
  if (role === "ROLE_ADMIN") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/dashboard",
      },
      {
        key: 2,
        icon: <UserOutlined />,
        label: "Profile",
        path: "/profile",
      },
      {
        key: 3,
        icon: <BookOutlined />,
        label: <p>Courses</p>,
        path: "/courses",
      },
      {
        key: 4,
        icon: <GroupOutlined />,
        label: <p>Groups</p>,
        path: "/groups",
      },
      {
        key: 5,
        icon: <TeamOutlined />,
        label: <p>Teachers</p>,
        path: "/teachers",
      },
      {
        key: 6,
        icon: <TeamOutlined />,
        label: <p>Students</p>,
        path: "/students",
      },
      {
        key: 7,
        icon: <InboxOutlined />,
        label: <p>Inbox</p>,
        path: "/inbox",
      },
    ];
  } else if (role === "ROLE_TEACHER") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/dashboard",
      },
      {
        key: 2,
        icon: <UserOutlined />,
        label: "Profile",
        path: "/profile",
      },
      {
        key: 3,
        icon: <GroupOutlined />,
        label: <p>My groups</p>,
        path: "/my-groups",
      },
      {
        key: 4,
        icon: <TableOutlined />,
        label: <p>Lesson schedule</p>,
        path: "/my-lessons",
      },
      {
        key: 5,
        icon: <BarChartOutlined />,
        label: <p>Statistics</p>,
        path: "/stats",
      },
      {
        key: 6,
        icon: <InfoCircleOutlined />,
        label: <p>Info</p>,
        path: "/info",
      },
      {
        key: 7,
        icon: <MailOutlined />,
        label: <p>Messages</p>,
        path: "/messages",
      },
    ];
  } else if (role === "ROLE_STUDENT") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/dashboard",
      },
      {
        key: 2,
        icon: <UserOutlined />,
        label: "Profile",
        path: "/profile",
      },
      {
        key: 3,
        icon: <GroupOutlined />,
        label: <p>My groups</p>,
        path: "/my-subjects",
      },
      {
        key: 4,
        icon: <TableOutlined />,
        label: <p>Lesson schedule</p>,
        path: "/my-lessons",
      },
      {
        key: 5,
        icon: <BarChartOutlined />,
        label: <p>Statistics</p>,
        path: "/stats",
      },
      {
        key: 6,
        icon: <InfoCircleOutlined />,
        label: <p>Info</p>,
        path: "/info",
      },
      {
        key: 7,
        icon: <MessageOutlined />,
        label: <p>Messages</p>,
        path: "/messages",
      },
    ];
  } else {
    items = [];
  }
  return items;
};
