import { useCallback } from "react";
import { Modal, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteRoom } from "../../../services/api-client";

const DeleteRoomModal = ({ isOpen, onClose, onSuccess, room }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteRoom(room.id);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Room deleted successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to delete room");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred while deleting the room");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Room deletion canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Confirm Deletion"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <p>Are you sure you want to delete the room "{room?.name}"?</p>
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

export default DeleteRoomModal;