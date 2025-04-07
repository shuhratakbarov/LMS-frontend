import { Modal, Button, message, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { deleteCourse } from "../../../services/api-client";
import { useCallback } from "react";

const { Text } = Typography;

const DeleteCourseModal = ({ isOpen, onClose, onSuccess, course  }) => {
  const handleSubmit = async () => {
    try {
      const response = await deleteCourse(course.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Course deleted successfully");
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage || "Failed to update the course");
      }
    } catch (error) {
      console.error("Error deleting the course:", error);
      message.error("An error occurred while deleting the course");
    }
  };
  const handleCancel = useCallback(() => {
    message.info("O'chirish bekor qilindi");
    onClose();
  }, [onClose]);


  return (
    <Modal
      title="Delete the course"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Text type="danger">
        Rostdan ham <b>{course.name}</b> kursini o'chirmoqchimisiz?
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

export default DeleteCourseModal;
