import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { editUser } from "../../../../services/api-client";

const UpdateTeacherModal = ({ isOpen, onSuccess, onClose, teacher }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && teacher) {
      form.setFieldsValue({
        ...teacher,
        password: "", // Clear password field for security
      });
    }
  }, [isOpen, teacher, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        id: teacher.id,
        roleId: 2,
      };
      console.log(payload);
      const response = await editUser(payload);

      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Teacher updated successfully");
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage || "Failed to update teacher");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while updating the teacher");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    message.info("Editing canceled");
    onClose();
  };

  return (
    <Modal
      title="Update Teacher"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        layout="vertical"
        initialValues={{ roleId: 2 }}
      >
        <Form.Item name="roleId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            { required: true, message: "Please enter first name!" },
            { max: 30, message: "First name cannot exceed 30 characters!" },
            { pattern: /^[A-Za-z]+$/, message: "First name must contain only letters!" },
          ]}
        >
          <Input placeholder="Enter first name" allowClear />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            { required: true, message: "Please enter last name!" },
            { max: 30, message: "Last name cannot exceed 30 characters!" },
            { pattern: /^[A-Za-z]+$/, message: "Last name must contain only letters!" },
          ]}
        >
          <Input placeholder="Enter last name" allowClear />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone number!" },
            { pattern: /^\+?[1-9]\d{1,14}$/, message: "Please enter a valid phone number!" },
          ]}
        >
          <Input placeholder="Enter phone number (e.g., +998901234567)" allowClear />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email!" },
            { type: "email", message: "Please enter a valid email!" },
            { max: 40, message: "Email cannot exceed 40 characters!" },
          ]}
        >
          <Input placeholder="Enter email (e.g., example@domain.com)" allowClear />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Please enter address!" },
            { max: 40, message: "Address cannot exceed 40 characters!" },
          ]}
        >
          <Input placeholder="Enter address" allowClear />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please enter username!" },
            { min: 3, message: "Username must be at least 3 characters!" },
            { max: 32, message: "Username cannot exceed 32 characters!" },
            { pattern: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores!" },
          ]}
        >
          <Input placeholder="Enter username" allowClear />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: false },
            { min: 5, message: "Password must be at least 5 characters!" },
            { max: 32, message: "Password cannot exceed 32 characters!" },
            { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{5,}$/, message: "Password must contain at least one letter and one number!" },
          ]}
        >
          <Input.Password placeholder="Leave empty to keep unchanged" allowClear />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<EditOutlined />}
            loading={submitting}
            disabled={submitting}
          >
            Update Teacher
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateTeacherModal;