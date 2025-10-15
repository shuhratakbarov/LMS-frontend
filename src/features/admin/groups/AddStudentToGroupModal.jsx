import { useState, useCallback } from "react";
import { Modal, Form, Button, message, Input, Card, Space, Avatar, Typography, Empty, Spin, Alert } from "antd";
import { PlusOutlined, UserOutlined, SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { addStudentToGroup, searchStudent } from "../../../services/api-client";

const { Text } = Typography;

const AddStudentToGroupModal = ({ isOpen, onSuccess, onClose, groupId }) => {
  const [student, setStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchingStudent = useCallback(async (searchText) => {
    if (!searchText.trim()) {
      message.warning("Please enter a username to search");
      return;
    }
    setSearching(true);
    setSearchAttempted(true);
    try {
      const response = await searchStudent(searchText);
      const { success, data, message: responseMessage } = response.data;
      if (success) {
        setStudent(data);
        message.success("Student found successfully!");
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
    searchingStudent(value);
  };

  const handleSubmit = async () => {
    if (!student) {
      message.error("Please search and select a valid student first");
      return;
    }

    setSubmitting(true);
    try {
      const response = await addStudentToGroup(student.id, groupId);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Student added successfully!");
        setStudent(null);
        setSearchQuery("");
        setSearchAttempted(false);
        onSuccess();
        onClose();
      } else {
        message.error(responseMessage);
      }
    } catch (error) {
      message.error("An error occurred while adding the student: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (student || searchQuery) {
      Modal.confirm({
        title: "Discard changes?",
        content: "Are you sure you want to close? Any unsaved changes will be lost.",
        okText: "Yes, close",
        cancelText: "Cancel",
        onOk: () => {
          setStudent(null);
          setSearchQuery("");
          setSearchAttempted(false);
          onClose();
        },
      });
    } else {
      setStudent(null);
      setSearchQuery("");
      setSearchAttempted(false);
      onClose();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setStudent(null);
    setSearchAttempted(false);
  };

  return (
      <Modal
          title={
            <Space>
              <UserOutlined style={{ color: "#1890ff" }} />
              <span>Add Student to Group</span>
            </Space>
          }
          open={isOpen}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose={true}
          width={isMobile ? "95%" : 520}
          centered
          styles={{
            body: { paddingTop: 20 }
          }}
      >
        <Form onFinish={handleSubmit} layout="vertical">
          {/* Search Section */}
          <Form.Item
              label={
                <Space>
                  <SearchOutlined />
                  <Text strong>Search Student by Username</Text>
                </Space>
              }
          >
            <Input.Search
                value={searchQuery}
                onSearch={handleSearch}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username (e.g., john_doe)"
                enterButton="Search"
                size={isMobile ? "middle" : "large"}
                loading={searching}
                disabled={searching || submitting}
                allowClear
                onClear={handleClearSearch}
            />
            {searchQuery && (
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                  Press Enter or click Search to find the student
                </Text>
            )}
          </Form.Item>

          {/* Loading State */}
          {searching && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spin size="large" />
                <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
                  Searching for student...
                </Text>
              </div>
          )}

          {/* Student Found - Display Card */}
          {!searching && student && (
              <Card
                  size="small"
                  style={{
                    marginBottom: 20,
                    borderRadius: 8,
                    border: "2px solid #52c41a",
                    boxShadow: "0 2px 8px rgba(82, 196, 26, 0.2)",
                  }}
              >
                <Space direction={isMobile ? "vertical" : "horizontal"} style={{ width: "100%" }} size="middle">
                  <Avatar
                      size={isMobile ? 60 : 64}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#52c41a" }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: isMobile ? 15 : 16, display: "block" }}>
                      {student.firstName} {student.lastName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                      Username: <Text code>{student.username}</Text>
                    </Text>
                    {student.email && (
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13, display: "block" }}>
                          Email: {student.email}
                        </Text>
                    )}
                  </div>
                  <Button
                      icon={<CloseCircleOutlined />}
                      onClick={handleClearSearch}
                      type="text"
                      size="small"
                      danger
                      title="Clear selection"
                  />
                </Space>
              </Card>
          )}

          {/* No Student Found */}
          {!searching && searchAttempted && !student && (
              <Alert
                  message="Student Not Found"
                  description="No student found with that username. Please try a different search term."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 20 }}
              />
          )}

          {/* Initial State - No Search Yet */}
          {!searching && !searchAttempted && !student && (
              <Card
                  size="small"
                  style={{
                    marginBottom: 20,
                    background: "#fafafa",
                    textAlign: "center",
                    border: "1px dashed #d9d9d9",
                  }}
              >
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                        Search for a student by username to add them to this group
                      </Text>
                    }
                />
              </Card>
          )}

          {/* Action Buttons */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space
                style={{ width: "100%", justifyContent: "flex-end" }}
                size="middle"
                direction={isMobile ? "vertical" : "horizontal"}
            >
              <Button
                  onClick={handleCancel}
                  disabled={submitting}
                  block={isMobile}
                  size={isMobile ? "middle" : "default"}
              >
                Cancel
              </Button>
              <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  disabled={!student || searching || submitting}
                  loading={submitting}
                  block={isMobile}
                  size={isMobile ? "middle" : "default"}
              >
                {submitting ? "Adding Student..." : "Add to Group"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default AddStudentToGroupModal;