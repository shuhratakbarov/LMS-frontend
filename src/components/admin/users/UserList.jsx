import { useState, Fragment } from "react";
import { Radio, Typography } from "antd";
import StudentList from "././students/StudentList";
import TeacherList from "./teachers/TeacherList";

const { Title } = Typography;

const UserList = () => {
  const [activeTab, setActiveTab] = useState("students");

  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "2vh", textAlign: "center" }}>
        <Title level={2}>User Management</Title>

        <Radio.Group
          value={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: "16px" }}
        >
          <Radio.Button value="students">Students</Radio.Button>
          <Radio.Button value="teachers">Teachers</Radio.Button>
        </Radio.Group>
      </div>

      {activeTab === "students" ? <StudentList /> : <TeacherList />}
    </Fragment>
  );
};

export default UserList;