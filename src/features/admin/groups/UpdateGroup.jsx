import { useCallback, useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { updateGroup, getCourseIdAndName, getTeacherIdAndUsername } from "../../../services/api-client";

const { Option } = Select;

const UpdateGroupModal = ({ isOpen, onClose, onSuccess, group }) => {
  const [form] = Form.useForm();
  const [courseOptions, setCourseOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        name: group.name,
        description: group.description,
        courseId: group.courseId,
        teacherId: group.teacherId,
        roomId: group.roomId,
        time: group.time,
        days: group.days,
      });
    }
  }, [group, form]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourseIdAndName();
      const dto = response.data;
      if (dto.success) {
        setCourseOptions(dto.data.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>
        )));
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
        setTeacherOptions(dto.data.map(item => (
          <Option key={item.id} value={item.id}>{item.username}</Option>
        )));
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
      const response = await updateGroup(group.id, values);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Group updated successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to update group");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred while updating the group");
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
          rules={[{ required: true, message: "Please enter name!" }]}
        >
          <Input placeholder="Enter name" maxLength={25} allowClear />
        </Form.Item>
        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: "Please select course!" }]}
        >
          <Select
            placeholder="Select course"
            allowClear
            onClick={fetchCourses}
            loading={loading}
          >
            {courseOptions}
          </Select>
        </Form.Item>
        <Form.Item
          label="Teacher"
          name="teacherId"
          rules={[{ required: true, message: "Please select a teacher!" }]}
        >
          <Select
            placeholder="Select teacher"
            allowClear
            onClick={fetchTeachers}
            loading={loading}
          >
            {teacherOptions}
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
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateGroupModal;