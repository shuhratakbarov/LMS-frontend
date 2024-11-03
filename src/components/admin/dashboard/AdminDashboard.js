import React, {useEffect, useState} from 'react';
import {Row, Col, Card, Statistic, message, Select} from 'antd';
import {UserOutlined, TeamOutlined, SolutionOutlined, GroupOutlined} from '@ant-design/icons';
import {useAxios} from "../../../server/AxiosProvider";
import {ENDPOINTS} from "../../../server/endpoints";
import {getItems} from "../../../server/serverConsts";
import returnDashCols from "./dashboardService";

const AdminDashboard = () => {
    const [generalStats, setGeneralStats] = useState([]);
    const {get, loading, error} = useAxios();

    const getGeneralStats = async ()  => {
        try {
            const stats = await get(ENDPOINTS.ADMIN_DASHBOARD_STATS);
            console.log("Stats: ",stats);
            setGeneralStats(stats);
        } catch (err) {
            console.error("Error:", err);
            message.error('Xatolik yuz berdi!');
        }
    };


    useEffect(() => {
        getGeneralStats();
    }, []);



    return (
        loading ? <p>Loading...</p> :
            <div style={{padding: '24px'}}>
                <Row gutter={16}>
                    {/*{generalStats?.toString()}*/}
                    {returnDashCols(generalStats)}
                    {/*<Col span={6}>*/}
                    {/*    <Card>*/}
                    {/*        <Statistic*/}
                    {/*            title="Courses"*/}
                    {/*            value={3}*/}
                    {/*            prefix={<SolutionOutlined/>}*/}
                    {/*            valueStyle={{color: '#3f8600'}}*/}
                    {/*        />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*<Col span={6}>*/}
                    {/*    <Card>*/}
                    {/*        <Statistic*/}
                    {/*            title="Groups"*/}
                    {/*            value={54}*/}
                    {/*            prefix={<GroupOutlined/>}*/}
                    {/*            valueStyle={{color: '#3f8600'}}*/}
                    {/*        />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*<Col span={6}>*/}
                    {/*    <Card>*/}
                    {/*        <Statistic*/}
                    {/*            title="Students"*/}
                    {/*            value={1003}*/}
                    {/*            prefix={<TeamOutlined/>}*/}
                    {/*            suffix=" | 90% faol"*/}
                    {/*            valueStyle={{color: '#3f8600'}}*/}
                    {/*        />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*<Col span={6}>*/}
                    {/*    <Card>*/}
                    {/*        <Statistic*/}
                    {/*            title="Teachers"*/}
                    {/*            value={63}*/}
                    {/*            prefix={<UserOutlined/>}*/}
                    {/*            suffix=" | 79% faol"*/}
                    {/*            valueStyle={{color: '#3f8600'}}*/}
                    {/*        />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*There is nothing here*/}
                </Row>
                <div style={{textAlign: 'right', marginTop: '16px'}}>
                    <span>Last updated: recently</span>
                </div>
            </div>
    );
};

export default AdminDashboard;
