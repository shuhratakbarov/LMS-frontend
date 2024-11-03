import React from "react";
import {GroupOutlined, TeamOutlined, DashboardOutlined} from "@ant-design/icons";

export const serverURL = "http://localhost:8082/api/";
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
                icon: <GroupOutlined/>,
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
                icon: <TeamOutlined/>,
                label: <p>Students</p>,
                path: '/my-subjects'
            },
            {
                key: 5,
                icon: <TeamOutlined/>,
                label: <p>Teachers</p>,
                path: '/my-groups'
            },
        ]
    } else if (role === 'ROLE_TEACHER') {
        items = [
            {
                key: 1,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
                path: '/my-groups'
            }
        ]
    } else if (role === 'ROLE_STUDENT') {
        items = [
            {
                key: 1,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
                path: 'my-subjects'
            },
        ];
    } else {
        items = [];
    }
    return items;
}
