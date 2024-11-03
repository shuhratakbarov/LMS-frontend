import {Card, Col, Statistic} from "antd";
import React from "react";
import {GroupOutlined, SolutionOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";


const dashElements = [
    { title: 'Courses', value: 0, prefix: <SolutionOutlined />, suffix: '', color: '#111111' },
    { title: 'Groups', value: 0, prefix: <GroupOutlined />, suffix: '', color: '#111111' },
    { title: 'Teachers', value: 0, prefix: <UserOutlined />, suffix: ' | 79% active', color: '#111111' },
    { title: 'Students', value: 0, prefix: <TeamOutlined />, suffix: ' | 90% active', color: '#111111' },
];
const returnDashCols = (stats) => {
    const cols = [];

    for (let i = 0; i < stats.length; i++) {
        for (let j = 0; j < dashElements.length; j++) {
            if (stats[i].title === dashElements[j].title) {
                dashElements[j].value = stats[i].value;
                cols.push(
                    <Col span={6} key={`${stats[i].title}-${i}`}>
                        <Card>
                            <Statistic
                                title={dashElements[j].title}
                                value={stats[i].value}
                                prefix={dashElements[j].prefix}
                                suffix={stats[i].suffix}
                                valueStyle={{ color: dashElements[j].color }}
                            />
                        </Card>
                    </Col>
                );
                break;
            }
        }
    }
    return <>{cols}</>;
};

export default returnDashCols;