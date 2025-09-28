import { useState } from "react";
import { Modal, Form, Input, Button, message, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addUser } from "../../../../services/api-client";
import PasswordStrengthInput from "../../../const/PasswordStrengthInput";

const AddTeacherModal = ({ isOpen, onSuccess, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const teacher = {
        ...values,
        role: "TEACHER",
        birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null,
      };
      const response = await addUser(teacher);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Teacher successfully added");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to add teacher");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while adding the teacher");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    message.info("Adding teacher canceled");
    onCancel();
  };

  return (
    <Modal
      title="Add New Teacher"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        onFinish={onFinish}
        size="large"
        layout="vertical"
      >
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
          label="Birth Date"
          name="birthDate"
          rules={[{ required: true, message: "Please select birth date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select birth date"
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current > new Date()}
          />
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
            { required: true, message: "Please enter a password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
            { max: 32, message: "Password cannot exceed 32 characters!" },
            { pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/, message: "Password must contain uppercase, digit, and special character!" },
          ]}
        >
          <PasswordStrengthInput
            placeholder="Enter a password"
            showGenerator={true}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={submitting}
            disabled={submitting}
          >
            Add Teacher
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherModal;