import { useState } from "react";
import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { deleteUser } from "../../../services/api-client";

const { Text } = Typography;

const DeleteStudentModal = ({ isOpen, onSuccess, onClose, student }) => {
  const [deleting, setDeleting] = useState(false);

  const onFinish = async () => {
    setDeleting(true);
    try {
      const response = await deleteUser(student.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success(`${student.lastName} ${student.firstName} successfully deleted`);
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to delete student");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while deleting the student");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    message.info("Deletion canceled");
    onClose();
  };

  return (
    <Modal
      title="Delete Student"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Text type="danger">
        Are you sure you want to delete {student.lastName} {student.firstName}?
      </Text>
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Button
          type="primary"
          danger
          onClick={onFinish}
          icon={<CheckOutlined />}
          loading={deleting}
          disabled={deleting}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteStudentModal;