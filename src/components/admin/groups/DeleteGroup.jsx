import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { deleteGroup } from "../../../services/api-client";
import { useCallback } from "react";

const { Text } = Typography;

const DeleteGroupModal = ({ isOpen, onClose, onSuccess, group }) => {
  const handleSubmit = async () => {
    try {
      const response = await deleteGroup(group.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Group deleted successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to delete group");
      }
    } catch (error) {
      message.error("An error occurred while deleting the group");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("O'chirish bekor qilindi");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Delete the group"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Text type="danger">Rostan ham <b>{group.name}</b> guruhini o'chirmoqchimisiz?</Text>
      <br />
      <br />
      <Button
        type="primary"
        danger
        htmlType="submit"
        onClick={handleSubmit}
        icon={<CheckOutlined />}
      >
        Submit
      </Button>
    </Modal>
  );
};

export default DeleteGroupModal;
