import { Fragment, useState } from "react";
import { Radio } from "antd";
import Title from "antd/lib/typography/Title";
import ChangePassword from "../../auth/ChangePassword";
import ChangeLanguage from "../../const/Prophylactics";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("change-password");

  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "2vh", textAlign: "center" }}>
        <Title level={2}>Profile Settings</Title>
        <Radio.Group
          value={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: "16px" }}
        >
          <Radio.Button value="change-password">Change Password</Radio.Button>
          <Radio.Button value="change-language">Change Language</Radio.Button>
        </Radio.Group>
      </div>

      {activeTab === "change-password" ? <ChangePassword /> : <ChangeLanguage />}
    </Fragment>
  );
};
export default Settings;
