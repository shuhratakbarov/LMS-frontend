import { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message,
  Card, Tag, Typography, Tooltip, Row, Col, Statistic, Avatar, Divider
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

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    thisWeek: 0,
    byType: {}
  });

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
    setViewingUpdate(record);
    setViewModalVisible(true);
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
            <Text strong style={{ fontSize: '14px' }}>{record.title}</Text>
          </div>
          <Paragraph
            ellipsis={{ rows: 2, tooltip: record.body }}
            type="secondary"
            style={{ margin: 0, fontSize: '12px' }}
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
    },
    {
      title: "Target",
      dataIndex: "roles",
      key: "roles",
      width: 200,
      render: (roles) => convertRolesToTargetTag(roles),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this update?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
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

  return (
    <div style={{ padding: 0 }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Content Management</Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Updates"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Published"
              value={stats.published}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Week"
              value={stats.thisWeek}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Most Used"
              value={Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b, 'NEWS')}
              formatter={(value) => updateTypeConfig[value]?.label || value}
              prefix={updateTypeConfig[Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b, 'NEWS')]?.icon}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>All Updates</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            size="large"
          >
            Create Update
          </Button>
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
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>

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
        width={600}
      >
        <Divider style={{ margin: '16px 0' }} />
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Update Type"
                name="type"
                rules={[{ required: true, message: "Please select update type" }]}
              >
                <Select placeholder="Select type" size="large">
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
            <Col span={12}>
              <Form.Item
                label="Target Audience"
                name="role"
                rules={[{ required: true, message: "Please select target audience" }]}
              >
                <Select placeholder="Select audience" size="large">
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
            <Input size="large" placeholder="Enter update title" />
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
              rows={6}
              placeholder="Enter update content..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
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