import { useCallback, useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { getCourseIdAndName, getTeacherIdAndUsername, updateGroup } from "../../../services/api-client";

const UpdateGroupModal = ({ isOpen, onClose, onSuccess, group }) => {
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
      const response = await updateGroup(group.id, JSON.stringify(values));
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Group updated successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to update group");
      }
    } catch (error) {
      message.error("An error occurred while updating the group");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Tahrirlash bekor qilindi");
    onClose();
  }, [onClose]);

  return (
    <Modal
      title="Update the group"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      onOk={onSuccess}
      destroyOnClose={true}
    >
      <Form
        onFinish={handleSubmit}
        size={"large"}
        initialValues={group}
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input placeholder="Enter name" maxLength={25} allowClear />
        </Form.Item>
        <Form.Item
          label="Course name"
          name="courseId"
          rules={[{ required: true, message: "Please select courses name!" }]}
        >
          <Select
            placeholder="Select course"
            allowClear
            onClick={fetchCourses}
            loading={loading}
            defaultValue={group.courseName}
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
            placeholder="Select course"
            allowClear
            onClick={fetchTeachers}
            loading={loading}
            defaultValue={group.teacherUsername}
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

export default UpdateGroupModal;
