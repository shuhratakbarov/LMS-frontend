import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { removeStudentFromGroup } from "../../../services/api-client";

const { Text } = Typography;

const RemoveStudentModal = ({ isOpen, onSuccess, onClose, student,  groupId }) => {
  const handleSubmit = async () => {
      try {
        const response = await removeStudentFromGroup(student.id, groupId);
        const { success, message: responseMessage } = response.data;
        if (success) {
          message.success("Student removed from the group");
          onSuccess();
        } else {
          message.error(responseMessage);
        }
      } catch (error) {
        message.error("An error occurred while removing the student. " + error);
      }
  };

  const handleCancel = () => {
    message.info("Removing student canceled");
    onClose();
  };

  return (
    <Modal
      title="Remove the student"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Text type="danger">
        Rostdan ham <strong>{student.lastName} {student.firstName}</strong>ni guruhdan chiqarmoqchimisiz?
      </Text>
      <br />
      <br />
      <Button
        type="primary"
        danger
        htmlType="submit"
        onClick={handleSubmit}
        icon={<CheckOutlined />}
      >
        Ha
      </Button>
    </Modal>
  );
};

export default RemoveStudentModal;
