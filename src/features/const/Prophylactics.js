import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Prophylactics = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // goes back one step in the browser history
  };
  return <div>
    <h1>Profilaktika</h1>
    <Button onClick={goBack}><ArrowLeftOutlined/></Button>
  </div>;
}

export default Prophylactics;