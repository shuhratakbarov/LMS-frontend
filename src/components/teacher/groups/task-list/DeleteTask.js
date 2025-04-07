import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { deleteTeacherTask } from "../../../../services/api-client";

const { Text } = Typography;

const DeleteTask = ({ isOpen, onSuccess, onClose, record }) => {
  const onFinish = async () => {
    try {
      const response = await deleteTeacherTask(record.id);
      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success("Task deleted successfully");
        onSuccess();
        onClose();
      } else {
        message.error(errorMessage || "Failed to delete task");
        onClose();
      }
    } catch (error) {
      message.error(error.message || "An error occurred while deleting the task");
    }
  };

  const handleCancel = () => {
    message.info("Task deletion cancelled");
    onClose();
  };

  return (
    <Modal
      title="Delete Task"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Text type="danger">
        Are you sure you want to delete the task <b>{record.taskName}</b>?
      </Text>
      <div style={{ marginTop: "16px" }}>
        <Button
          type="primary"
          danger
          onClick={onFinish}
          icon={<CheckOutlined />}
          style={{ marginRight: "8px" }}
        >
          Yes
        </Button>
        <Button onClick={handleCancel} type="default">
          No
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteTask;