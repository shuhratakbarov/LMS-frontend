import { useCallback } from "react";
import { Modal, Button, message, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteLessonSchedule } from "../../../../services/api-client";

const { Text } = Typography;
const DeleteLessonScheduleModal = ({ isOpen, onClose, onSuccess, schedule }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteLessonSchedule(schedule.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Lesson schedule deleted successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to delete lesson schedule");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error deleting lesson schedule");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Lesson schedule deletion canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Delete Lesson Schedule"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Text type={"danger"}>
        Are you sure you want to delete the lesson schedule for:
        <br/>
        Group : {schedule?.groupName},
        <br/>
        Day: {schedule?.day},
        <br/>
        Time: {schedule?.startTime}:00-{schedule?.endTime}:00,
        <br/>
        Room : {schedule?.roomName}?
      </Text>
      <div style={{ textAlign: "right" }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteLessonScheduleModal;