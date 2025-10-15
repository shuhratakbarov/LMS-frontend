import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Card, Typography, Tag, Drawer, Descriptions, Avatar, Statistic, Row, Col } from "antd";
import { ArrowLeftOutlined, UserDeleteOutlined, UserAddOutlined, EyeOutlined, TeamOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import AddStudentToGroupModal from "./AddStudentToGroupModal";
import RemoveStudentModal from "./RemoveStudentModal";
import { getGroupData } from "../../../services/api-client";

const { Title, Text } = Typography;

const ActionsInGroup = () => {
  const [groupData, setGroupData] = useState({ groupDetails: null, students: [] });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [isRemoveStudentModalVisible, setIsRemoveStudentModalVisible] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchGroupData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupData(groupId, page, size);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setGroupData({
          groupDetails: data.group,
          students: data.page.content
        });
        setTotalElements(data.page.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch group data");
        navigate("/admin/groups");
      }
    } catch (error) {
      message.error("Failed to load group data: " + error.message);
      navigate("/admin/groups");
    } finally {
      setLoading(false);
    }
  }, [groupId, page, size, navigate]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const handleAddStudent = () => {
    setIsAddStudentModalVisible(true);
  };

  const handleRemoveStudent = (student) => {
    setStudentToRemove(student);
    setIsRemoveStudentModalVisible(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDrawerVisible(true);
  };

  const hideModal = () => {
    setIsAddStudentModalVisible(false);
    setIsRemoveStudentModalVisible(false);
    setStudentToRemove(null);
  };

  const handleSuccess = () => {
    fetchGroupData();
    hideModal();
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => page * size + index + 1,
      responsive: ["sm"],
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      ellipsis: true,
      render: (text) => (
          <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
            {text}
          </Text>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      ellipsis: true,
      render: (text) => (
          <Tag color="blue">{text}</Tag>
      ),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 100 : 120,
      fixed: isMobile ? "right" : undefined,
      render: (record) => (
          <Space size="small">
            {isMobile && (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                    type="text"
                    size="small"
                />
            )}
            <Button
                icon={<UserDeleteOutlined />}
                onClick={() => handleRemoveStudent(record)}
                type="text"
                danger
                size="small"
            />
          </Space>
      )
    }
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? "8px" : "12px" }}>
          <Space direction="vertical" size="small">
            <div>
              <Text strong>Username: </Text>
              <Tag color="blue">{record.username}</Tag>
            </div>
            <div>
              <Text strong>Full Name: </Text>
              <Text>{record.firstName} {record.lastName}</Text>
            </div>
          </Space>
        </div>
    ),
    rowExpandable: (record) => !isMobile && record.username
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {groupData.students.map((student, index) => (
            <Card
                key={student.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #52c41a",
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{page * size + index + 1}
                    </Text>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <Avatar
                          icon={<UserOutlined />}
                          size={40}
                          style={{ backgroundColor: "#87d068" }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0, fontSize: 15 }}>
                          {student.firstName} {student.lastName}
                        </Title>
                        <Tag color="blue" style={{ marginTop: 4, fontSize: 11 }}>
                          {student.username}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(student)}
                    size="small"
                    style={{ flex: 1 }}
                >
                  View
                </Button>
                <Button
                    icon={<UserDeleteOutlined />}
                    onClick={() => handleRemoveStudent(student)}
                    danger
                    size="small"
                    style={{ flex: 1 }}
                >
                  Remove
                </Button>
              </div>
            </Card>
        ))}
      </Space>
  );

  return (
      <div style={{ padding: isMobile ? 0 : 0 }}>
        {/* Header Section */}
        <Card
            style={{
              marginBottom: isMobile ? 16 : 20,
              borderRadius: isMobile ? 8 : 12,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: isMobile ? 16 : 20 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/admin/groups")}
                  size="small"
                  style={{ marginBottom: 12, background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                Back to Groups
              </Button>
              <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: "white" }}>
                <TeamOutlined /> {groupData.groupDetails?.name || "Loading..."}
              </Title>
              {groupData.groupDetails && (
                  <Space size="small" style={{ marginTop: 8 }} wrap>
                    <Tag color="blue" icon={<BookOutlined />} style={{ margin: 0 }}>
                      {groupData.groupDetails.course.name}
                    </Tag>
                    <Tag color="green" icon={<UserOutlined />} style={{ margin: 0 }}>
                      {groupData.groupDetails.teacher.username}
                    </Tag>
                  </Space>
              )}
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 16 : 20 }}>
          <Col xs={12} sm={8} md={8}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Total Students"
                  value={totalElements}
                  prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={8}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Current Page"
                  value={page + 1}
                  suffix={`/ ${Math.ceil(totalElements / size) || 1}`}
                  valueStyle={{ fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Showing"
                  value={`${page * size + 1}-${Math.min((page + 1) * size, totalElements)}`}
                  valueStyle={{ fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Add Student Button - Top on mobile */}
        <div style={{ marginBottom: 16 }}>
          <Button
              type="primary"
              onClick={handleAddStudent}
              icon={<UserAddOutlined />}
              block={isMobile}
              size={isMobile ? "middle" : "large"}
          >
            Add Student to Group
          </Button>
        </div>

        {/* Table or Card View */}
        {isMobile ? (
            <>
              {loading ? (
                  <Card loading={true} />
              ) : groupData.students.length === 0 ? (
                  <Card>
                    <Text type="secondary">No students in this group yet</Text>
                  </Card>
              ) : (
                  <MobileCardView />
              )}

              {/* Mobile Pagination */}
              <Card
                  size="small"
                  style={{ marginTop: 16, textAlign: "center" }}
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Page {page + 1} of {Math.ceil(totalElements / size) || 1}
                  </Text>
                  <Space size="small">
                    <Button
                        size="small"
                        onClick={() => handlePagination(page)}
                        disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handlePagination(page + 2)}
                        disabled={(page + 1) * size >= totalElements}
                    >
                      Next
                    </Button>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Total: {totalElements} students
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 8 }}>
              <Table
                  dataSource={groupData.students}
                  columns={columns}
                  rowKey="id"
                  expandable={expandableConfig}
                  pagination={{
                    current: page + 1,
                    pageSize: size,
                    total: totalElements,
                    onChange: handlePagination,
                    onShowSizeChange: handlePageSizeChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    showQuickJumper: !isTablet,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    responsive: true,
                    size: isTablet ? "small" : "default",
                  }}
                  loading={loading}
                  scroll={{ x: isTablet ? 600 : "max-content", y: 325 }}
                  sticky
                  size={isTablet ? "small" : "middle"}
              />
            </Card>
        )}

        {/* Student Details Drawer (Mobile) */}
        <Drawer
            title="Student Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="60vh"
        >
          {selectedStudent && (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Avatar
                      icon={<UserOutlined />}
                      size={80}
                      style={{ backgroundColor: "#87d068", marginBottom: 12 }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Title>
                  <Tag color="blue" style={{ marginTop: 8 }}>
                    {selectedStudent.username}
                  </Tag>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="First Name">
                    <Text strong>{selectedStudent.firstName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Name">
                    <Text strong>{selectedStudent.lastName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Username">
                    <Tag color="blue">{selectedStudent.username}</Tag>
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16 }}>
                  <Button
                      icon={<UserDeleteOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleRemoveStudent(selectedStudent);
                      }}
                      danger
                      block
                      size="large"
                  >
                    Remove from Group
                  </Button>
                </div>
              </>
          )}
        </Drawer>

        {/* Modals */}
        {isAddStudentModalVisible && (
            <AddStudentToGroupModal
                isOpen={isAddStudentModalVisible}
                onSuccess={handleSuccess}
                onClose={hideModal}
                groupId={groupId}
            />
        )}
        {isRemoveStudentModalVisible && (
            <RemoveStudentModal
                isOpen={isRemoveStudentModalVisible}
                onSuccess={handleSuccess}
                onClose={hideModal}
                student={studentToRemove}
                groupId={groupId}
            />
        )}
      </div>
  );
};

export default ActionsInGroup;