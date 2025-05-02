import { useCallback, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { updateRoom } from "../../../services/api-client";

const UpdateRoomModal = ({ isOpen, onClose, onSuccess, room }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (room) {
      form.setFieldsValue({
        name: room.name,
        description: room.description,
      });
    }
  }, [room, form]);

  const handleSubmit = async (values) => {
    try {
      const response = await updateRoom(room.id, values);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Room updated successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to update room");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred while updating the room");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Room update canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Update Room"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
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
            icon={<CheckOutlined />}
          >
            Update Room
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoomModal;