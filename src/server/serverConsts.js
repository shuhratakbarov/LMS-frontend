import React from "react";
import {
    GroupOutlined,
    TeamOutlined,
    DashboardOutlined,
    SolutionOutlined,
    UserOutlined,
    MessageOutlined,
    TableOutlined,
    InfoCircleOutlined,
    InboxOutlined,
    MailOutlined,
    BarChartOutlined
} from "@ant-design/icons";

export const serverURL = "http://localhost:8082/api/";
// export const serverURL = "https://9402-95-214-211-53.ngrok-free.app/api/";
export const getItems = (role) => {
    let items;
    if (role === "ROLE_ADMIN") {
        items = [
            {
                key: 1,
                icon: <DashboardOutlined />,
                label: <p>Dashboard</p>,
                path: '/dashboard'
            },
            {
                key: 2,
                icon: <SolutionOutlined/>,
                label: <p>Courses</p>,
                path: '/courses'
            },
            {
                key: 3,
                icon: <GroupOutlined/>,
                label: <p>Groups</p>,
                path: '/groups'
            },
            {
                key: 4,
                icon: <UserOutlined/>,
                label: <p>Teachers</p>,
                path: '/teachers'
            },
            {
                key: 5,
                icon: <TeamOutlined/>,
                label: <p>Students</p>,
                path: '/students'
            },
            {
                key: 6,
                icon: <InboxOutlined />,
                label: <p>Messages</p>,
                path: '/messages'
            },
        ]
    } else if (role === 'ROLE_TEACHER') {
        items = [
            {
                key: 1,
                icon: <DashboardOutlined />,
                label: <p>Dashboard</p>,
                path: '/dashboard'
            },
            {
                key: 2,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
                path: '/my-groups'
            },
            {
                key: 3,
                icon: <TableOutlined />,
                label: <p>Lesson schedule</p>,
                path: '/my-lessons'
            },
            {
                key: 4,
                icon: <BarChartOutlined />,
                label: <p>Statistics</p>,
                path: '/stats'
            },
            {
                key: 5,
                icon: <InfoCircleOutlined />,
                label: <p>Info</p>,
                path: '/info'
            },
            {
                key: 6,
                icon: <MailOutlined/>,
                label: <p>Messages</p>,
                path: '/messages'
            },
        ]
    } else if (role === 'ROLE_STUDENT') {
        items = [
            {
                key: 1,
                icon: <DashboardOutlined />,
                label: <p>Dashboard</p>,
                path: '/dashboard'
            },
            {
                key: 2,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
                path: '/my-subjects'
            },
            {
                key: 3,
                icon: <TableOutlined />,
                label: <p>Lesson schedule</p>,
                path: '/my-lessons'
            },
            {
                key: 4,
                icon: <BarChartOutlined />,
                label: <p>Statistics</p>,
                path: '/stats'
            },
            {
                key: 5,
                icon: <InfoCircleOutlined />,
                label: <p>Info</p>,
                path: '/info'
            },
            {
                key: 6,
                icon: <MessageOutlined/>,
                label: <p>Messages</p>,
                path: '/messages'
            },
        ];
    } else {
        items = [];
    }
    return items;
}
