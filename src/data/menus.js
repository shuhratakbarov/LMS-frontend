import {GroupOutlined, TeamOutlined, BookOutlined} from "@ant-design/icons";
import React from "react";
import {Link} from "react-router-dom";

export const menus=[
    {
        icon: <GroupOutlined />,
        label: <Link to={"/course/list"}>Courses</Link>
    },
    {
        icon: <GroupOutlined />,
        label: <Link to={"/group/list"}>Groups</Link>
    },
    {
        icon: <TeamOutlined />,
        label: <Link to={"/teacher/list"}>Teachers</Link>
    },
    {
        icon: <TeamOutlined />,
        label: <Link to={"/student/list"}>Students</Link>
    },
    {
        icon: <BookOutlined />,
        label: <Link to={"/my-tasks/list"}>My tasks</Link>
    },
]

{"_id":1, "fullname":"Toshmat", "age":20}