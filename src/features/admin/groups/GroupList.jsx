import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography, Card, Tag, Drawer, Descriptions, Avatar } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/FormatDate";
import { getGroupList } from "../../../services/api-client";
import UpdateGroupModal from "./UpdateGroup";
import DeleteGroupModal from "./DeleteGroup";
import CreateGroupModal from "./CreateGroup";
import SearchComponent from "../../const/SearchComponent";

const { Title, Text } = Typography;

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [selectedGroup, setSelectedGroup] = useState(null);
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

  const handleViewDetails = (group) => {
    setSelectedGroup(group);
    setDrawerVisible(true);
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
      responsive: ["sm"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
      render: (text) => (
          <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
            <TeamOutlined style={{ marginRight: 6, color: "#1890ff" }} />
            {text}
          </Text>
      ),
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
      ellipsis: true,
      render: (text) => (
          <Tag color="blue" icon={<BookOutlined />}>
            {text}
          </Tag>
      ),
      responsive: ["md"],
    },
    {
      title: "Teacher",
      dataIndex: "teacherUsername",
      key: "teacherUsername",
      ellipsis: true,
      render: (text) => (
          <Space size="small">
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#87d068" }} />
            <Text style={{ fontSize: 13 }}>{text}</Text>
          </Space>
      ),
      responsive: ["lg"],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ["xl"],
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => (
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      responsive: ["xl"],
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 120 : isTablet ? 140 : 180,
      fixed: isMobile ? "right" : undefined,
      render: (record) => (
          <Space size="small" wrap>
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
                onClick={() => handleEditGroup(record)}
                type="text"
                size="small"
            />
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteGroup(record)}
                type="text"
                danger
                size="small"
            />
            {!isMobile && (
                <Link to={`/admin/groups/${record.id}`}>
                  <Button
                      icon={<ArrowRightOutlined />}
                      type="primary"
                      size="small"
                      ghost
                  >
                    {isTablet ? "" : "Enter"}
                  </Button>
                </Link>
            )}
          </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? "8px" : "12px" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text strong>Description: </Text>
              <Text>{record.description || "No description available"}</Text>
            </div>
            {isMobile && (
                <>
                  <div>
                    <Text strong>Course: </Text>
                    <Tag color="blue">{record.courseName}</Tag>
                  </div>
                  <div>
                    <Text strong>Teacher: </Text>
                    <Text>{record.teacherUsername}</Text>
                  </div>
                </>
            )}
          </Space>
        </div>
    ),
    rowExpandable: (record) => !isMobile && record.description,
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {groups.map((group, index) => (
            <Card
                key={group.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #1890ff",
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{currentPage * pageSize + index + 1}
                    </Text>
                    <Title level={5} style={{ margin: "4px 0 8px 0", fontSize: 15 }}>
                      <TeamOutlined style={{ marginRight: 6, color: "#1890ff" }} />
                      {group.name}
                    </Title>
                  </div>
                </div>

                <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <BookOutlined style={{ color: "#1890ff" }} />
                    <Text style={{ fontSize: 12 }}>
                      <Text type="secondary">Course: </Text>
                      <Text strong>{group.courseName}</Text>
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <UserOutlined style={{ color: "#52c41a" }} />
                    <Text style={{ fontSize: 12 }}>
                      <Text type="secondary">Teacher: </Text>
                      <Text strong>{group.teacherUsername}</Text>
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Created: {formatDate(group.createdAt)}
                  </Text>
                </Space>

                {group.description && (
                    <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          // display: "block",
                          marginBottom: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                    >
                      {group.description}
                    </Text>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(group)}
                    size="small"
                    style={{ flex: "1 1 auto" }}
                >
                  View
                </Button>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditGroup(group)}
                    type="primary"
                    size="small"
                    style={{ flex: "1 1 auto" }}
                >
                  Edit
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteGroup(group)}
                    danger
                    size="small"
                />
                <Link to={`/admin/groups/${group.id}`} style={{ flex: "1 1 100%" }}>
                  <Button
                      icon={<ArrowRightOutlined />}
                      type="dashed"
                      size="small"
                      block
                  >
                    Enter Group
                  </Button>
                </Link>
              </div>
            </Card>
        ))}
      </Space>
  );

  return (
      <div style={{ padding: isMobile ? "4px" : "0" }}>
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
            👥 Groups
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
                placeholder={isMobile ? "Search..." : "Search groups... (Ctrl+K)"}
                handleSearch={handleSearch}
            />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                block={isMobile}
                size={isMobile ? "middle" : "default"}
            >
              New Group
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
                  <strong>Total Groups:</strong> {totalItems}
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
              ) : groups.length === 0 ? (
                  <Card>
                    <Text type="secondary">No groups found</Text>
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
                    Total: {totalItems} groups
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
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
                  showQuickJumper: !isTablet,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  responsive: true,
                  size: isTablet ? "small" : "default",
                }}
                loading={isLoading}
                scroll={{ x: isTablet ? 800 : "max-content", y: isMobile ? 400 : 340 }}
                sticky
                size={isTablet ? "small" : "middle"}
            />
        )}

        {/* Group Details Drawer (Mobile) */}
        <Drawer
            title="Group Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="75vh"
        >
          {selectedGroup && (
              <>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Name">
                    <Text strong>
                      <TeamOutlined style={{ marginRight: 6, color: "#1890ff" }} />
                      {selectedGroup.name}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Course">
                    <Tag color="blue" icon={<BookOutlined />}>
                      {selectedGroup.courseName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Teacher">
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#87d068" }} />
                      <Text>{selectedGroup.teacherUsername}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedGroup.description || "No description available"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {formatDate(selectedGroup.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Updated At">
                    {formatDate(selectedGroup.updatedAt)}
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link to={`/admin/groups/${selectedGroup.id}`}>
                    <Button
                        icon={<ArrowRightOutlined />}
                        type="primary"
                        size="large"
                        block
                    >
                      Enter Group
                    </Button>
                  </Link>
                  <Space style={{ width: "100%" }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleEditGroup(selectedGroup);
                        }}
                        type="default"
                        style={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleDeleteGroup(selectedGroup);
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