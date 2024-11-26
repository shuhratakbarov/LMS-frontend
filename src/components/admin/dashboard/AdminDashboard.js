import React, {useEffect, useState} from 'react';
import {Row, message} from 'antd';
import {useAxios} from "../../../server/AxiosProvider";
import {ENDPOINTS} from "../../../server/endpoints";
import returnDashCols from "./dashboardService";
import LastUpdated from "../../../pages/const/LastUpdated";

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
                    {returnDashCols(generalStats)}
                </Row>
                <LastUpdated />
            </div>
    );
};

export default AdminDashboard;
