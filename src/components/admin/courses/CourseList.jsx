import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import CreateCourseModal from "./CreateCourse";
import UpdateCourseModal from "./UpdateCourse";
import DeleteCourseModal from "./DeleteCourse";
import { getCourseList, getCourseListBySearch } from "../../../services/api-client";
import { formatDate } from "../../../const/FormatDate";
import Search from "antd/es/input/Search";

const { Title } = Typography;
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

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = searchQuery
        ? await getCourseListBySearch(searchQuery, currentPage, pageSize)
        : await getCourseList(currentPage, pageSize);
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
    setCurrentPage(0); // Reset to first page on size change
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(0); // Reset to first page on search
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

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setCourseToUpdate(null);
    setCourseToDelete({ id: null, name: "" });
  };

  const handleSuccess = () => {
    fetchCourses();
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => currentPage * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: [
        { text: "Name starts with A", value: "A" },
        { text: "Name starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.name)}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Description:</strong> {record.description}
      </p>
    ),
    rowExpandable: (record) => record.description !== "No expandable content",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Courses</Title>
        <div>
          <Search
            placeholder="Search courses..."
            onSearch={handleSearch}
            enterButton
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ marginLeft: "16px" }}
          >
            New Course
          </Button>
        </div>
      </div>
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
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
        }}
        loading={isLoading}
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Course List</strong>}
        footer={() => `Total Courses: ${totalItems}`}
      />

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