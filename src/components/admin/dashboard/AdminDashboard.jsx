import { Fragment, useEffect, useState } from "react";
import { Row, message, Typography } from "antd";
import { getAdminDashboardStats } from "../../../services/api-client";
import DashboardStats from "./dashboardStats";
import LastUpdated from "../../../pages/const/LastUpdated";

const { Title } = Typography;
const AdminDashboard = () => {
  const [generalStats, setGeneralStats] = useState([]);

  useEffect(() => {
    async function startFetching() {
      setGeneralStats([]);
      const response = await getAdminDashboardStats();
      if (!ignore) {
        if (response.data.success) {
          setGeneralStats(response.data.data);
        } else {
          message.error(response.data.message || "Failed to load stats");
        }
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Fragment>
      <Title level={2} style={{textAlign: "center"}}>General statistics</Title>
      <div style={{ padding: 24 }}>
        <Row gutter={[16, 16]}>
          <DashboardStats stats={generalStats} />
        </Row>
        <LastUpdated />
      </div>
    </Fragment>
  );
}

export default AdminDashboard;