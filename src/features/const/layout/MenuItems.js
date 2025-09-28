import {
  GroupOutlined, DashboardOutlined, BookOutlined, MessageOutlined,
  TableOutlined, MailOutlined, BarChartOutlined, BankOutlined,
  ScheduleOutlined, TeamOutlined, FileTextOutlined,
  ReadOutlined, LoginOutlined, ProfileOutlined
} from "@ant-design/icons";

export const getMenuItems = (role) => {
  let items;
  if (role === "ADMIN") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/admin/dashboard",
      },
      {
        key: 2,
        icon: <BookOutlined />,
        label: <p>Courses</p>,
        path: "/admin/courses",
      },
      {
        key: 3,
        icon: <GroupOutlined />,
        label: <p>Groups</p>,
        path: "/admin/groups",
      },
      {
        key: 4,
        icon: <ScheduleOutlined />,
        label: <p>Lesson schedules</p>,
        path: "/admin/lesson-schedules/time-table",
      },
      {
        key: 5,
        icon: <TeamOutlined />,
        label: <p>Users</p>,
        path: "/admin/users",
      },
      {
        key: 6,
        icon: <ReadOutlined />,
        label: <p>Updates</p>,
        path: "/admin/updates",
      },
      {
        key: 7,
        icon: <BankOutlined />,
        label: <p>Rooms</p>,
        path: "/admin/rooms",
      },
      {
        key: 8,
        icon: <MessageOutlined />,
        label: <p>Messages</p>,
        path: "/admin/messages",
      },
    ];
  } else if (role === "TEACHER") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/teacher/dashboard",
      },
      {
        key: 2,
        icon: <ProfileOutlined />,
        label: "Profile",
        path: "/teacher/profile",
      },
      {
        key: 3,
        icon: <GroupOutlined />,
        label: <p>My groups</p>,
        path: "/teacher/groups",
      },
      {
        key: 4,
        icon: <TableOutlined />,
        label: <p>Lesson schedule</p>,
        path: "/teacher/lessons",
      },
      {
        key: 5,
        icon: <FileTextOutlined />,
        label: <p>Exam</p>,
        path: "/teacher/exam",
      },
      {
        key: 6,
        icon: <MessageOutlined />,
        label: <p>Messages</p>,
        path: "/teacher/messages",
      },
    ];
  } else if (role === "STUDENT") {
    items = [
      {
        key: 1,
        icon: <DashboardOutlined />,
        label: <p>Dashboard</p>,
        path: "/student/dashboard",
      },
      {
        key: 2,
        icon: <ProfileOutlined />,
        label: "Profile",
        path: "/student/profile",
      },
      {
        key: 3,
        icon: <BookOutlined />,
        label: <p>My courses</p>,
        path: "/student/subjects",
      },
      {
        key: 4,
        icon: <TableOutlined />,
        label: <p>Lesson schedule</p>,
        path: "/student/lessons",
      },
      {
        key: 5,
        icon: <FileTextOutlined />,
        label: <p>Exam</p>,
        path: "/student/exam",
      },
      {
        key: 6,
        icon: <MessageOutlined />,
        label: <p>Messages</p>,
        path: "/student/messages",
      },
    ];
  } else {
    items = [{
      key: 1,
      icon: <LoginOutlined />,
      label: <p>Login</p>,
      path: "/login",
    }];
  }
  return items;
};
