import { Fragment, useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography, Avatar, Badge, Card,
  Row, Col, Statistic, Drawer, Descriptions } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, EyeOutlined,
  UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined
} from "@ant-design/icons";
import AddStudentModal from "./AddStudent";
import ViewGroupsOfStudent from "./ViewGroupsOfStudent";
import UpdateStudentModal from "./UpdateStudent";
import DeleteStudentModal from "./DeleteStudent";
import { getStudentList } from "../../../../services/api-client";
import { formatDate } from "../../../../utils/FormatDate";
import SearchComponent from "../../../const/SearchComponent";

const { Title, Text } = Typography;
const StudentList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewGroupsModalVisible, setIsViewGroupsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [studentToViewGroups, setStudentToViewGroups] = useState({});
  const [studentToUpdate, setStudentToUpdate] = useState({});
  const [studentToDelete, setStudentToDelete] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentList(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch students");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hideModal = () => {
    setIsAddModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsViewGroupsModalVisible(false);
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    setPage(0);
  };

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const handleSuccess = () => {
    fetchData();
    hideModal();
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setStudentToUpdate(record);
    setIsUpdateModalVisible(true);
  };

  const handleDelete = (record) => {
    setStudentToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleViewGroup = (record) => {
    setStudentToViewGroups(record);
    setIsViewGroupsModalVisible(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text, record, index) => page * size + index + 1,
      responsive: ["sm"],
    },
    {
      title: "Student",
      dataIndex: "firstName",
      key: "firstName",
      width: 180,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      ellipsis: true,
      render: (text, record) => (
          <Space>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
                {record.firstName} {record.lastName}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                @{record.username}
              </Text>
            </Space>
          </Space>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 180,
      ellipsis: true,
      render: (record) => (
          <Space direction="vertical" size={0}>
            <a href={`tel:${record.phone}`} style={{ fontSize: 12 }}>
              <PhoneOutlined /> {record.phone}
            </a>
            <a href={`mailto:${record.email}`} style={{ fontSize: 12 }}>
              <MailOutlined /> {record.email}
            </a>
          </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: 100,
      render: (value) => (
          <Badge
              status={value ? "success" : "error"}
              text={value ? "Active" : "Inactive"}
          />
      ),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 100 : 140,
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
                icon={<EyeOutlined />}
                onClick={() => handleViewGroup(record)}
                type="text"
                size="small"
                title="View groups"
            />
            <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                type="text"
                size="small"
            />
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                type="text"
                danger
                size="small"
            />
          </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? "8px" : "12px" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text strong>Address: </Text>
              <Text>{record.address}</Text>
            </div>
            <div>
              <Text strong>Birth Date: </Text>
              <Text>{record.birthDate}</Text>
            </div>
            <div>
              <Text strong>Added: </Text>
              <Text type="secondary">{formatDate(record.createdAt)}</Text>
            </div>
          </Space>
        </div>
    ),
    rowExpandable: (record) => !isMobile && record.username !== "No expandable content",
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {dataSource.map((student, index) => (
            <Card
                key={student.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${student.active ? "#52c41a" : "#ff4d4f"}`,
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{page * size + index + 1}
                    </Text>
                    <Title level={5} style={{ margin: 0, fontSize: 15 }}>
                      {student.firstName} {student.lastName}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      @{student.username}
                    </Text>
                  </div>
                  <Badge
                      status={student.active ? "success" : "error"}
                      text={student.active ? "Active" : "Inactive"}
                  />
                </div>

                <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: 12 }}>
                  <a href={`tel:${student.phone}`} style={{ fontSize: 12 }}>
                    <PhoneOutlined /> {student.phone}
                  </a>
                  <a href={`mailto:${student.email}`} style={{ fontSize: 12 }}>
                    <MailOutlined /> {student.email}
                  </a>
                  {student.address && (
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        <EnvironmentOutlined /> {student.address}
                      </Text>
                  )}
                </Space>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(student)}
                    size="small"
                    style={{ flex: 1 }}
                >
                  Details
                </Button>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(student)}
                    type="primary"
                    size="small"
                    style={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(student)}
                    danger
                    size="small"
                />
              </div>
            </Card>
        ))}
      </Space>
  );

  // Calculate statistics
  const activeCount = dataSource.filter(s => s.active).length;
  const inactiveCount = dataSource.filter(s => s.active === false).length;

  return (
      <Fragment>
        <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              marginBottom: isMobile ? 16 : 20,
              gap: isMobile ? 12 : 0,
            }}
        >
          <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
            🎓 Students
          </Title>
          <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 8 : 12,
                alignItems: "stretch",
              }}
          >
            <SearchComponent
                placeholder={isMobile ? "Search..." : "Search students... (Ctrl+K)"}
                handleSearch={handleSearch}
            />
            <Button
                type="primary"
                onClick={handleAdd}
                icon={<UserAddOutlined />}
                block={isMobile}
                size={isMobile ? "middle" : "default"}
            >
              New Student
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {!isMobile && (
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={8} sm={8} md={8}>
                <Card size="small">
                  <Statistic title="Total" value={totalElements} prefix={<TeamOutlined />} />
                </Card>
              </Col>
              <Col xs={8} sm={8} md={8}>
                <Card size="small">
                  <Statistic
                      title="Active"
                      value={activeCount}
                      valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={8} sm={8} md={8}>
                <Card size="small">
                  <Statistic
                      title="Inactive"
                      value={inactiveCount}
                      valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
            </Row>
        )}

        {/* Table or Card View */}
        {isMobile ? (
            <>
              {loading ? (
                  <Card loading={true} />
              ) : dataSource.length === 0 ? (
                  <Card>
                    <Text type="secondary">No students found</Text>
                  </Card>
              ) : (
                  <MobileCardView />
              )}

              {/* Mobile Pagination */}
              <Card size="small" style={{ marginTop: 16, textAlign: "center" }}>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Page {page + 1} of {Math.ceil(totalElements / size)}
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
            <Table
                dataSource={dataSource}
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
                scroll={{ x: isTablet ? 800 : "max-content", y: 360 }}
                sticky
                size={isTablet ? "small" : "middle"}
            />
        )}

        {/* Student Details Drawer */}
        <Drawer
            title="Student Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="70vh"
        >
          {selectedStudent && (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff", marginBottom: 12 }} />
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Title>
                  <Text type="secondary">@{selectedStudent.username}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Badge
                        status={selectedStudent.active ? "success" : "error"}
                        text={selectedStudent.active ? "Active" : "Inactive"}
                    />
                  </div>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Phone">
                    <a href={`tel:${selectedStudent.phone}`}>{selectedStudent.phone}</a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <a href={`mailto:${selectedStudent.email}`}>{selectedStudent.email}</a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedStudent.address || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Date">
                    {selectedStudent.birthDate || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Added">
                    {formatDate(selectedStudent.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {formatDate(selectedStudent.updatedAt)}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleViewGroup(selectedStudent);
                      }}
                      type="primary"
                      block
                      size="large"
                  >
                    View Groups
                  </Button>
                  <Space style={{ width: "100%" }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleEdit(selectedStudent);
                        }}
                        style={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleDelete(selectedStudent);
                        }}
                        danger
                        style={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              </>
          )}
        </Drawer>

        {/* Modals */}
        <AddStudentModal
            isOpen={isAddModalVisible}
            onSuccess={handleSuccess}
            hideModal={hideModal}
        />
        <ViewGroupsOfStudent
            isOpen={isViewGroupsModalVisible}
            student={studentToViewGroups}
            onClose={hideModal}
        />
        <UpdateStudentModal
            isOpen={isUpdateModalVisible}
            onSuccess={handleSuccess}
            onClose={hideModal}
            student={studentToUpdate}
        />
        <DeleteStudentModal
            isOpen={isDeleteModalVisible}
            onSuccess={handleSuccess}
            onClose={hideModal}
            student={studentToDelete}
        />
      </Fragment>
  );
};

export default StudentList;