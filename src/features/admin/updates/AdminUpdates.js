import { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Empty,
  Card, Tag, Typography, Tooltip, Row, Col, Statistic, Avatar, Divider, Drawer, Descriptions
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  BellOutlined, CalendarOutlined, FileTextOutlined,
} from "@ant-design/icons";
import { createUpdate, deleteUpdate, getUpdates, updateUpdate } from "../../../services/api-client";
import { convertRolesToTargetTag, roleConfig, updateTypeConfig } from "../../../utils/util";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const AdminUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [viewingUpdate, setViewingUpdate] = useState(null);
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    thisWeek: 0,
    byType: {}
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    const calculateStats = () => {
      const total = updates.length;
      const thisWeek = updates.filter(update => {
        const updateDate = new Date(update.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return updateDate >= weekAgo;
      }).length;

      const byType = updates.reduce((acc, update) => {
        acc[update.type] = (acc[update.type] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total,
        published: total,
        thisWeek,
        byType
      });
    };

    calculateStats();
  }, [updates]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const res = await getUpdates();
      setUpdates(res.data.data);
      setTotalItems(res.data.data.length);
    } catch (err) {
      message.error("Failed to load updates");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUpdate) {
        const res = await updateUpdate(editingUpdate.id, values);
        if (res.data.success) {
          message.success("Update edited successfully");
        }
      } else {
        const res = await createUpdate(values);
        if (res.data.success) {
          message.success("Update created successfully");
        }
      }

      setModalVisible(false);
      form.resetFields();
      setEditingUpdate(null);
      fetchUpdates();
    } catch (err) {
      message.error("Validation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteUpdate(id);
      if (res.data.success) {
        message.success("Deleted successfully");
      }
      fetchUpdates();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const handleView = (record) => {
    if (isMobile) {
      setSelectedUpdate(record);
      setDrawerVisible(true);
    } else {
      setViewingUpdate(record);
      setViewModalVisible(true);
    }
  };

  const handleViewDetails = (update) => {
    setSelectedUpdate(update);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => (
          <Text type="secondary">{currentPage * pageSize + index + 1}</Text>
      ),
      responsive: ["sm"],
    },
    {
      title: "Update",
      key: "update",
      render: (_, record) => (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <Avatar
                  size="small"
                  icon={updateTypeConfig[record.type]?.icon}
                  style={{
                    backgroundColor: updateTypeConfig[record.type]?.color,
                    marginRight: 8
                  }}
              />
              <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{record.title}</Text>
            </div>
            <Paragraph
                ellipsis={{ rows: 2, tooltip: record.body }}
                type="secondary"
                style={{ margin: 0, fontSize: 12 }}
            >
              {record.body}
            </Paragraph>
          </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => (
          <Tag
              icon={updateTypeConfig[type]?.icon}
              color={updateTypeConfig[type]?.color}
          >
            {updateTypeConfig[type]?.label}
          </Tag>
      ),
      filters: Object.keys(updateTypeConfig).map(key => ({
        text: updateTypeConfig[key].label,
        value: key,
      })),
      onFilter: (value, record) => record.type === value,
      responsive: ["md"],
    },
    {
      title: "Target",
      dataIndex: "roles",
      key: "roles",
      width: 150,
      render: (roles) => convertRolesToTargetTag(roles),
      responsive: ["lg"],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(date).toLocaleDateString()}
          </Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ["xl"],
    },
    {
      title: "Actions",
      key: "actions",
      width: isMobile ? 100 : 120,
      fixed: isMobile ? "right" : undefined,
      render: (_, record) => (
          <Space size="small">
            {isMobile && (
                <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                />
            )}
            {!isMobile && (
                <Tooltip title="View">
                  <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(record)}
                  />
                </Tooltip>
            )}
            <Tooltip title="Edit">
              <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(record)}
              />
            </Tooltip>
            <Popconfirm
                title="Delete this update?"
                description="This action cannot be undone."
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
            >
              <Tooltip title="Delete">
                <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
      ),
    },
  ];

  const openCreateModal = () => {
    form.resetFields();
    setEditingUpdate(null);
    setModalVisible(true);
  };

  const openEditModal = (update) => {
    form.setFieldsValue(update);
    setEditingUpdate(update);
    setModalVisible(true);
  };

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {updates.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((update, index) => (
            <Card
                key={update.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${updateTypeConfig[update.type]?.color}`,
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{currentPage * pageSize + index + 1}
                    </Text>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <Avatar
                          size={32}
                          icon={updateTypeConfig[update.type]?.icon}
                          style={{ backgroundColor: updateTypeConfig[update.type]?.color }}
                      />
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, fontSize: 14 }}>
                          {update.title}
                        </Title>
                      </div>
                    </div>
                  </div>
                </div>

                <Space size="small" wrap style={{ marginBottom: 8 }}>
                  <Tag
                      icon={updateTypeConfig[update.type]?.icon}
                      color={updateTypeConfig[update.type]?.color}
                  >
                    {updateTypeConfig[update.type]?.label}
                  </Tag>
                  {convertRolesToTargetTag(update.roles)}
                </Space>

                <Paragraph
                    ellipsis={{ rows: 3 }}
                    type="secondary"
                    style={{ fontSize: 12, marginBottom: 8 }}
                >
                  {update.body}
                </Paragraph>

                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(update.createdAt).toLocaleDateString()}
                </Text>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(update)}
                    size="small"
                    style={{ flex: 1 }}
                >
                  View
                </Button>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(update)}
                    type="primary"
                    size="small"
                    style={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Popconfirm
                    title="Delete?"
                    onConfirm={() => handleDelete(update.id)}
                    okText="Yes"
                    cancelText="No"
                >
                  <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                  />
                </Popconfirm>
              </div>
            </Card>
        ))}
      </Space>
  );

  return (
      <div style={{ padding: 0 }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: isMobile ? 16 : 24,
          gap: isMobile ? 12 : 0,
        }}>
          <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
            📢 Content Management
          </Title>
          {!isMobile && (
              <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreateModal}
                  size="large"
              >
                Create Update
              </Button>
          )}
        </div>

        {/* Statistics Cards */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 16 : 24 }}>
          <Col xs={12} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                  title="Total"
                  value={stats.total}
                  prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                  title="Published"
                  value={stats.published}
                  prefix={<BellOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                  title="This Week"
                  value={stats.thisWeek}
                  prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
                  valueStyle={{ color: "#fa8c16", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: "center" }}>
              <Statistic
                  title="Most Used"
                  value={Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b, 'NEWS')}
                  formatter={(value) => updateTypeConfig[value]?.label || value}
                  prefix={updateTypeConfig[Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b, 'NEWS')]?.icon}
                  valueStyle={{ color: "#722ed1", fontSize: isMobile ? 16 : 20 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Mobile Create Button */}
        {isMobile && (
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
                block
                size="large"
                style={{ marginBottom: 16 }}
            >
              Create New Update
            </Button>
        )}

        {/* Main Content */}
        {isMobile ? (
            <>
              {loading ? (
                  <Card loading={true} />
              ) : updates.length === 0 ? (
                  <Card>
                    <Empty description="No updates found" />
                  </Card>
              ) : (
                  <MobileCardView />
              )}

              {/* Mobile Pagination */}
              <Card size="small" style={{ marginTop: 16, textAlign: "center" }}>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Page {currentPage + 1} of {Math.ceil(totalItems / pageSize)}
                  </Text>
                  <Space size="small">
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage, pageSize)}
                        disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage + 2, pageSize)}
                        disabled={(currentPage + 1) * pageSize >= totalItems}
                    >
                      Next
                    </Button>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Total: {totalItems} updates
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>All Updates</Title>
              </div>

              <Table
                  dataSource={updates}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: currentPage + 1,
                    pageSize,
                    total: totalItems,
                    onChange: handlePaginationChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showQuickJumper: !isTablet,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: isTablet ? "small" : "default",
                  }}
                  scroll={{ x: isTablet ? 800 : "max-content" }}
                  size={isTablet ? "small" : "middle"}
              />
            </Card>
        )}

        {/* Update Details Drawer (Mobile) */}
        <Drawer
            title="Update Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="80vh"
        >
          {selectedUpdate && (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Avatar
                      size={64}
                      icon={updateTypeConfig[selectedUpdate.type]?.icon}
                      style={{ backgroundColor: updateTypeConfig[selectedUpdate.type]?.color, marginBottom: 12 }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedUpdate.title}
                  </Title>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Type">
                    <Tag
                        icon={updateTypeConfig[selectedUpdate.type]?.icon}
                        color={updateTypeConfig[selectedUpdate.type]?.color}
                    >
                      {updateTypeConfig[selectedUpdate.type]?.label}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Target Audience">
                    {convertRolesToTargetTag(selectedUpdate.roles)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Content">
                    {selectedUpdate.body}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {new Date(selectedUpdate.createdAt).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        openEditModal(selectedUpdate);
                      }}
                      type="primary"
                      block
                      size="large"
                  >
                    Edit Update
                  </Button>
                  <Popconfirm
                      title="Delete this update?"
                      description="This action cannot be undone."
                      onConfirm={() => {
                        setDrawerVisible(false);
                        handleDelete(selectedUpdate.id);
                      }}
                      okText="Yes"
                      cancelText="No"
                  >
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        block
                        size="large"
                    >
                      Delete Update
                    </Button>
                  </Popconfirm>
                </div>
              </>
          )}
        </Drawer>

        {/* Create/Edit Modal */}
        <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editingUpdate ? <EditOutlined style={{ marginRight: 8 }} /> : <PlusOutlined style={{ marginRight: 8 }} />}
                {editingUpdate ? "Edit Update" : "Create New Update"}
              </div>
            }
            open={modalVisible}
            onOk={handleSubmit}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
              setEditingUpdate(null);
            }}
            okText={editingUpdate ? "Update" : "Create"}
            cancelText="Cancel"
            width={isMobile ? "95%" : 600}
            centered={isMobile}
        >
          <Divider style={{ margin: '16px 0' }} />
          <Form layout="vertical" form={form}>
            <Row gutter={isMobile ? 8 : 16}>
              <Col span={isMobile ? 24 : 12}>
                <Form.Item
                    label="Update Type"
                    name="type"
                    rules={[{ required: true, message: "Please select update type" }]}
                >
                  <Select placeholder="Select type" size={isMobile ? "middle" : "large"}>
                    {Object.entries(updateTypeConfig).map(([key, config]) => (
                        <Option key={key} value={key}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {config.icon}
                            <span style={{ marginLeft: 8 }}>{config.label}</span>
                          </div>
                        </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={isMobile ? 24 : 12}>
                <Form.Item
                    label="Target Audience"
                    name="role"
                    rules={[{ required: true, message: "Please select target audience" }]}
                >
                  <Select placeholder="Select audience" size={isMobile ? "middle" : "large"}>
                    {Object.entries(roleConfig).map(([key, config]) => (
                        <Option key={key} value={config.label}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {config.icon}
                            <span style={{ marginLeft: 8 }}>{config.label}</span>
                          </div>
                        </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter the title" },
                  { max: 100, message: "Title cannot exceed 100 characters" }
                ]}
            >
              <Input size={isMobile ? "middle" : "large"} placeholder="Enter update title" />
            </Form.Item>

            <Form.Item
                label="Content"
                name="body"
                rules={[
                  { required: true, message: "Please enter the content" },
                  { max: 1000, message: "Content cannot exceed 1000 characters" }
                ]}
            >
              <TextArea
                  rows={isMobile ? 4 : 6}
                  placeholder="Enter update content..."
                  showCount
                  maxLength={1000}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal (Desktop) */}
        <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <EyeOutlined style={{ marginRight: 8 }} />
                View Update
              </div>
            }
            open={viewModalVisible}
            onCancel={() => {
              setViewModalVisible(false);
              setViewingUpdate(null);
            }}
            footer={[
              <Button key="close" onClick={() => setViewModalVisible(false)}>
                Close
              </Button>,
              <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setViewModalVisible(false);
                    openEditModal(viewingUpdate);
                  }}
              >
                Edit
              </Button>
            ]}
            width={700}
        >
          {viewingUpdate && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Tag
                        icon={updateTypeConfig[viewingUpdate.type]?.icon}
                        color={updateTypeConfig[viewingUpdate.type]?.color}
                    >
                      {updateTypeConfig[viewingUpdate.type]?.label}
                    </Tag>
                    {convertRolesToTargetTag(viewingUpdate.roles)}
                  </Space>
                </div>

                <Title level={4}>{viewingUpdate.title}</Title>

                <Paragraph style={{ fontSize: '16px', lineHeight: 1.6 }}>
                  {viewingUpdate.body}
                </Paragraph>

                <Divider />

                <Text type="secondary">
                  Created on {new Date(viewingUpdate.createdAt).toLocaleString()}
                </Text>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default AdminUpdates;