import React from "react";
import {GroupOutlined, TeamOutlined} from "@ant-design/icons";

export const serverURL = "http://localhost:8082/api/";

export let getItems = (role) => {
    let items = [];
    if (role === "ROLE_TEACHER") {
        items = [
            {
                key: 1,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
            },
            // {
            //     key: 2,
            //     icon: <GroupOutlined/>,
            //     label: <p>Students of group</p>,
            // }
            // ,{
            //     key: undefined,
            //     icon: <GroupOutlined/>,
            //     label: <p>Not found</p>,
            // }

        ]
    } else if (role === 'ROLE_ADMIN') {
        items = [
            {
                key: 1,
                icon: <GroupOutlined/>,
                label: <p>Courses</p>,
            },
            {
                key: 2,
                icon: <GroupOutlined/>,
                label: <p>Groups</p>,
            },
            {
                key: 3,
                icon: <TeamOutlined/>,
                label: <p>Students</p>,
            },
            {
                key: 4,
                icon: <TeamOutlined/>,
                label: <p>Teachers</p>
            },
        ]
    } else {
        items = [
            {
                key: 1,
                icon: <GroupOutlined/>,
                label: <p>My groups</p>,
            },
        ];
    }
    return items;
}
