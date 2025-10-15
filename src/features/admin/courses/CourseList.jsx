import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography, Card, Tag, Drawer, Descriptions } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import CreateCourseModal from "./CreateCourse";
import UpdateCourseModal from "./UpdateCourse";
import DeleteCourseModal from "./DeleteCourse";
import { getCourseList } from "../../../services/api-client";
import { formatDate } from "../../../utils/FormatDate";
import SearchComponent from "../../const/SearchComponent";

const { Title, Text } = Typography;

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToUpdate, setCourseToUpdate] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCourseList(searchQuery, currentPage, pageSize);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setCourses(data.content);
        setTotalItems(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to load courses due to a network error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = (course) => {
    setCourseToUpdate(course);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id, name) => {
    setCourseToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setDrawerVisible(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setCourseToUpdate(null);
    setCourseToDelete({ id: null, name: "" });
  };

  const handleSuccess = () => {
    fetchCourses();
    handleModalClose();
  };

  // Desktop/Tablet columns
  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => currentPage * pageSize + index + 1,
      responsive: ["sm"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 140,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
      render: (text) => (
          <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
            {text}
          </Text>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: isTablet ? 100 : 120,
      sorter: (a, b) => a.duration - b.duration,
      render: (duration) => (
          <Tag color="blue">{duration} months</Tag>
      ),
      responsive: ["md"],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: isTablet ? 110 : 130,
      render: (date) => (
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ["lg"],
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: isTablet ? 110 : 130,
      render: (date) => (
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 100 : isTablet ? 120 : 140,
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
                icon={<EditOutlined />}
                onClick={() => handleUpdate(record)}
                type="text"
                size="small"
            />
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id, record.name)}
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
          <Text strong>Description: </Text>
          <Text>{record.description || "No description available"}</Text>
          {isMobile && (
              <div style={{ marginTop: 8 }}>
                <Text strong>Duration: </Text>
                <Tag color="blue">{record.duration} months</Tag>
              </div>
          )}
        </div>
    ),
    rowExpandable: (record) => !isMobile && record.description,
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {courses.map((course, index) => (
            <Card
                key={course.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{currentPage * pageSize + index + 1}
                    </Text>
                    <Title level={5} style={{ margin: "4px 0 8px 0", fontSize: 15 }}>
                      {course.name}
                    </Title>
                  </div>
                </div>

                <Space size="small" wrap style={{ marginBottom: 8 }}>
                  <Tag color="blue">{course.duration} months</Tag>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Created: {formatDate(course.createdAt)}
                  </Text>
                </Space>

                {course.description && (
                    <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          // display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                    >
                      {course.description}
                    </Text>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(course)}
                    size="small"
                    style={{ flex: 1 }}
                >
                  View
                </Button>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleUpdate(course)}
                    type="primary"
                    size="small"
                    style={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(course.id, course.name)}
                    danger
                    size="small"
                />
              </div>
            </Card>
        ))}
      </Space>
  );

  return (
      <div style={{ padding: isMobile ? 0 : "0" }}>
        {/* Header */}
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
          <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
            📚 Courses
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
                placeholder={isMobile ? "Search..." : "Search courses... (Ctrl+K)"}
                handleSearch={handleSearch}
            />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                block={isMobile}
                size={isMobile ? "middle" : "default"}
            >
              {isMobile ? "New Course" : "New Course"}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {!isMobile && (
            <Card
                size="small"
                style={{
                  marginBottom: 16,
                  background: "#fafafa",
                  borderRadius: 8,
                }}
            >
              <Space split="|" size="large">
                <Text>
                  <strong>Total Courses:</strong> {totalItems}
                </Text>
                <Text>
                  <strong>Showing:</strong> {currentPage * pageSize + 1}-
                  {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}
                </Text>
                <Text>
                  <strong>Page:</strong> {currentPage + 1}
                </Text>
              </Space>
            </Card>
        )}

        {/* Table or Card View */}
        {isMobile ? (
            <>
              {isLoading ? (
                  <Card loading={true} />
              ) : courses.length === 0 ? (
                  <Card>
                    <Text type="secondary">No courses found</Text>
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
                    Page {currentPage + 1} of {Math.ceil(totalItems / pageSize)}
                  </Text>
                  <Space size="small">
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage)}
                        disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage + 2)}
                        disabled={(currentPage + 1) * pageSize >= totalItems}
                    >
                      Next
                    </Button>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Total: {totalItems} courses
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Table
                dataSource={courses}
                columns={columns}
                rowKey="id"
                expandable={expandableConfig}
                pagination={{
                  current: currentPage + 1,
                  pageSize,
                  total: totalItems,
                  onChange: handlePaginationChange,
                  onShowSizeChange: handlePageSizeChange,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50", "100"],
                  showQuickJumper: !isTablet,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  responsive: true,
                  size: isTablet ? "small" : "default",
                }}
                loading={isLoading}
                scroll={{ x: isTablet ? 800 : "max-content", y: isMobile ? 400 : 325 }}
                sticky
                size={isTablet ? "small" : "middle"}
            />
        )}

        {/* Course Details Drawer (Mobile) */}
        <Drawer
            title="Course Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="70vh"
        >
          {selectedCourse && (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Name">
                  <Text strong>{selectedCourse.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                  <Tag color="blue">{selectedCourse.duration} months</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {selectedCourse.description || "No description available"}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {formatDate(selectedCourse.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {formatDate(selectedCourse.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
          )}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  handleUpdate(selectedCourse);
                }}
                type="primary"
                block
            >
              Edit Course
            </Button>
            <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  handleDelete(selectedCourse.id, selectedCourse.name);
                }}
                danger
                block
            >
              Delete
            </Button>
          </div>
        </Drawer>

        {/* Modals */}
        {isCreateModalOpen && (
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
            />
        )}
        {isUpdateModalOpen && (
            <UpdateCourseModal
                isOpen={isUpdateModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                course={courseToUpdate}
            />
        )}
        {isDeleteModalOpen && (
            <DeleteCourseModal
                isOpen={isDeleteModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                course={courseToDelete}
            />
        )}
      </div>
  );
};

export default CourseList;