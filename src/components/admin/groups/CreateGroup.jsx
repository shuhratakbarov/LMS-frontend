import { useCallback, useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createGroup, getCourseIdAndName, getTeacherIdAndUsername } from "../../../services/api-client";

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourseIdAndName();
      const dto = response.data;
      if (dto.success) {
        const jsonData = dto.data;
        const mappedOptions = jsonData.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ));
        setOptions(mappedOptions);
      } else {
        message.error(dto.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTeacherIdAndUsername();
      const dto = response.data;
      if (dto.success) {
        const jsonData = dto.data;
        const mappedOptions = jsonData.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.username}
          </Select.Option>
        ));
        setOptions(mappedOptions);
      } else {
        message.error(dto.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const response = await createGroup(JSON.stringify(values));
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Group added successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to add group");
      }
    } catch (error) {
      message.error("An error occurred while adding the group");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Group creation canceled");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Add New Group"
      open={isOpen}
      onCancel={handleCancel}
      footer={"Bu footer"}
      onOk={onSuccess}
      destroyOnClose={true}
    >
      <Form onFinish={handleSubmit} size={"large"} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input placeholder="Enter name" maxLength={25} allowClear />
        </Form.Item>
        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: "Please select courses name!" }]}
        >
          <Select
            placeholder="Select course"
            allowClear
            onClick={fetchCourses}
            loading={loading}
          >
            {options}
          </Select>
        </Form.Item>
        <Form.Item
          label="Teacher"
          name="teacherId"
          rules={[{ required: true, message: "Please select a teachers!" }]}
        >
          <Select
            placeholder="Select teacher"
            allowClear
            onClick={fetchTeachers}
            loading={loading}
          >
            {options}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <Input.TextArea
            placeholder="Enter description about the group"
            maxLength={60}
            allowClear
            style={{ height: "50px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Group
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
