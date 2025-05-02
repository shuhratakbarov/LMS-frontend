import { useState } from "react";
import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { deleteUser } from "../../../../services/api-client";

const { Text } = Typography;

const DeleteTeacherModal = ({ isOpen, onSuccess, onClose, teacher }) => {
  const [deleting, setDeleting] = useState(false);

  const onFinish = async () => {
    setDeleting(true);
    try {
      const response = await deleteUser(teacher.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success(`${teacher.lastName} ${teacher.firstName} successfully deleted`);
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage || "Failed to delete teacher");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while deleting the teacher");
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
      title="Delete Teacher"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Text type="danger">
        Are you sure you want to delete {teacher.lastName} {teacher.firstName}?
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

export default DeleteTeacherModal;