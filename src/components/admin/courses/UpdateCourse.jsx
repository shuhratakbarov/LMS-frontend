import { Modal, Form, Input, Button, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { updateCourse } from "../../../services/api-client";
import { useCallback } from "react";

const UpdateCourseModal = ({ isOpen, onClose, onSuccess, course }) => {
  const handleSubmit = async (values) => {
    try {
      const response = await updateCourse(course.id, JSON.stringify(values));
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Course updated successfully");
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage || "Failed to update the course");
      }
    } catch (error) {
      console.error("Error updating the course:", error);
      message.error("An error occurred while updating the course");
    }
  };
  const handleCancel = useCallback(() => {
    message.info("Tahrirlash bekor qilindi");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Update the course"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      onOk={onSuccess}
      destroyOnClose={true}
    >
      <Form onFinish={handleSubmit} size={"large"} initialValues={course} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input placeholder="Enter name" maxLength={25} allowClear />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <Input.TextArea
            placeholder="Enter description about the course"
            maxLength={60}
            allowClear
            style={{ height: "5vh" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCourseModal;
