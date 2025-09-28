import { useState, useCallback } from "react";
import { Modal, Form, Button, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addStudentToGroup, searchStudent } from "../../../services/api-client";

const AddStudentToGroupModal = ({ isOpen, onSuccess, onClose, groupId }) => {
  const [student, setStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const searchingStudent = useCallback(async (searchText) => {
    if (!searchText.trim()) return;
    setSearching(true);
    try {
      const response = await searchStudent(searchText);
      const { success, data, message: responseMessage } = response.data;
      if (success) {
        setStudent(data);
        message.success("Student found successfully");
      } else {
        setStudent(null);
        message.error(responseMessage || "Student not found");
      }
    } catch (error) {
      setStudent(null);
      message.error("Error searching student: " + error.message);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
    searchingStudent(value);
  };

  const handleSubmit = async () => {
    if (!student || student === "Student not found") {
      message.error("Please search and select a valid student first");
      return;
    }
    try {
      const response = await addStudentToGroup(student.id, groupId);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Student added successfully");
        setStudent(null);
        setSearchQuery("");
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage);
      }
    } catch (error) {
      message.error("An error occurred while adding the student: " + error.message);
    }
  };

  const handleCancel = () => {
    message.info("Adding student canceled");
    setStudent(null);
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      title="Add New Student"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form onFinish={handleSubmit} size="large" layout="vertical">
        <Form.Item label="Search Student" name="search">
          <Input.Search
            value={searchQuery}
            onSearch={handleSearch}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter username to search"
            enterButton
            loading={searching}
            disabled={searching}
          />
        </Form.Item>
        <Form.Item label="Selected Student:" name="studentId">
          <p><b>{student ? `${student.firstName} ${student.lastName}` : "No student selected"}</b></p>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            disabled={!student || searching}
          >
            Add Student
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStudentToGroupModal;