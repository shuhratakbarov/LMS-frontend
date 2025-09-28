import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/FormatDate";
import { getGroupList } from "../../../services/api-client";
import UpdateGroupModal from "./UpdateGroup";
import DeleteGroupModal from "./DeleteGroup";
import CreateGroupModal from "./CreateGroup";
import SearchComponent from "../../const/SearchComponent";

const { Title } = Typography;
const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupToUpdate, setGroupToUpdate] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getGroupList(searchQuery, currentPage, pageSize);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setGroups(data.content);
        setTotalItems(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch groups");
      }
    } catch (error) {
      message.error("Failed to load groups due to a network error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page - 1); // Adjust for 0-based index
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };
  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
  };

  const handleEditGroup = (group) => {
    setGroupToUpdate(group);
    setIsEditModalVisible(true);
  };

  const handleDeleteGroup = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalVisible(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  const handleSuccess = () => {
    fetchGroups();
    handleModalClose();
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 60,
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
      width: 150,
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
      filters: [
        { text: "Course 1", value: "Course 1" },
        { text: "Course 2", value: "Course 2" },
      ],
      onFilter: (value, record) => record.courseName === value,
      width: 180,
    },
    {
      title: "Teacher",
      dataIndex: "teacherUsername",
      key: "teacherUsername",
      filters: [
        { text: "teacher", value: "teacher" },
        { text: "Teacher 2", value: "Teacher 2" },
      ],
      onFilter: (value, record) => record.teacherUsername === value,
      width: 180,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      width: 180,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      width: 180,
    },
    {
      title: "Edit  |  Delete  |   Enter",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditGroup(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteGroup(record)}
            type="link"
            danger
          />
          <Link
            to={{
              pathname: `/admin/groups/${record.id}`,
            }}
          >
            <Button
              icon={<ArrowRightOutlined />}
              type="dashed"
              title={"Enter"}
            >
              Enter
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Description:</strong> {record.description}
        <br />
        <strong>Created At:</strong> {formatDate(record.createdAt)}
        <br />
        <strong>Updated At:</strong> {formatDate(record.updatedAt)}
      </p>
    ),
    rowExpandable: (record) => record.description !== "No expandable content",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Groups</Title>
        <div>
          <SearchComponent placeholder={"Search groups... (Press Ctrl+K)"} handleSearch={handleSearch}/>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ marginLeft: "16px" }}
          >
            New Group
          </Button>
        </div>
      </div>

      <Table
        dataSource={groups}
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
        scroll={{ x: "max-content", y: 340 }}
        sticky
        title={() => <strong>Group List</strong>}
        footer={() => `Total Groups: ${totalItems}`}
      />
      {isAddModalOpen && (
        <CreateGroupModal
          isOpen={isAddModalOpen}
          onSuccess={handleSuccess}
          onClose={handleModalClose}
        />
      )}
      {isEditModalVisible && (
      <UpdateGroupModal
        isOpen={isEditModalVisible}
        onSuccess={handleSuccess}
        onClose={handleModalClose}
        group={groupToUpdate}
      />
      )}
      {isDeleteModalVisible && (
      <DeleteGroupModal
        isOpen={isDeleteModalVisible}
        onSuccess={handleSuccess}
        onClose={handleModalClose}
        group={groupToDelete}
      />
      )}
    </div>
  );
};

export default GroupList;