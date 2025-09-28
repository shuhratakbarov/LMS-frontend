import { useCallback } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createRoom } from "../../../services/api-client";

const CreateRoomModal = ({ isOpen, onClose, onSuccess }) => {
  const handleSubmit = async (values) => {
    try {
      const response = await createRoom(values);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Room added successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to add room");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred while adding the room");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Room creation canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Add New Room"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        onFinish={handleSubmit}
        size="large"
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter room name!" }]}
        >
          <Input placeholder="Enter room name" maxLength={25} allowClear />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: false }]}
        >
          <Input.TextArea
            placeholder="Enter description about the room"
            maxLength={60}
            allowClear
            style={{ height: "50px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
          >
            Add Room
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;