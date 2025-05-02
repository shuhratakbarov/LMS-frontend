import { useCallback } from "react";
import { Modal, Form, Input, Button, message, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createCourse } from "../../../services/api-client";

const CreateCourseModal = ({ isOpen, onClose, onSuccess }) => {
  const handleSubmit = async (values) => {
    try {
      const response = await createCourse(JSON.stringify(values));
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Course added successfully");
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage || "Failed to add course");
      }
    } catch (error) {
      message.error("An error occurred while adding the course");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Course creation canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Add New Course"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ name: "", description: "" }}
        size="large"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the course name!" }]}
        >
          <Input
            placeholder="Enter course name"
            maxLength={25}
            allowClear
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Duration (in months)"
          rules={[{ required: true, message: "Please enter the duration of the course!" }]}
        >
          <InputNumber
            style={{width: "100%"}}
            placeholder="Enter duration"
            maxLength={2}
            allowClear
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <Input.TextArea
            placeholder="Enter description about the course"
            maxLength={60}
            allowClear
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
          >
            Add Course
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourseModal;