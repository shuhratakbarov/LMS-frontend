import {useState, Fragment, useEffect} from "react";
import {Card, Radio, Typography} from "antd";
import StudentList from "././students/StudentList";
import TeacherList from "./teachers/TeacherList";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";

const { Title } = Typography;

const UserList = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
      <Fragment>
        <Card
            style={{
              marginBottom: isMobile ? 16 : 20,
              textAlign: "center",
              borderRadius: isMobile ? 8 : 12,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: isMobile ? 16 : 24 }}
        >
          <Title
              level={isMobile ? 4 : 2}
              style={{ margin: 0, marginBottom: isMobile ? 12 : 16, color: "white" }}
          >
            👥 User Management
          </Title>

          <Radio.Group
              value={activeTab}
              onChange={handleTabChange}
              size={isMobile ? "middle" : "large"}
              buttonStyle="solid"
          >
            <Radio.Button value="students">
              <TeamOutlined /> {!isMobile && "Students"}
            </Radio.Button>
            <Radio.Button value="teachers">
              <UserOutlined /> {!isMobile && "Teachers"}
            </Radio.Button>
          </Radio.Group>
        </Card>

        {activeTab === "students" ? <StudentList /> : <TeacherList />}
      </Fragment>
  );
};

export default UserList;