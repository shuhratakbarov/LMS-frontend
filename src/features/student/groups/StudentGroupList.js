import { Fragment, useState, useEffect, useCallback } from "react";
import {
  Avatar, Badge, Button, Card, Col, message, Row, Skeleton, Space,
  Table, Tag, Tooltip, Typography, Drawer, Descriptions
} from "antd";
import {
  ArrowRightOutlined, BookOutlined, EyeOutlined, ReloadOutlined,
  TeamOutlined, UserOutlined
} from "@ant-design/icons";
import { getStudentSubjectList } from "../../../services/api-client";
import SearchComponent from "../../const/SearchComponent";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const StudentGroupList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

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
      const response = await getStudentSubjectList(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;

      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch subjects");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching subjects");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchData();
    message.success('Data refreshed successfully');
  };

  const handleViewDetails = (record) => {
    setSelectedSubject(record);
    setDrawerVisible(true);
  };

  const handleNavigateToTasks = (record) => {
    navigate(`/student/subjects/${record.id}/tasks`, {
      state: { record },
    });
  };

  const getUniqueFilters = (dataKey) => {
    const uniqueValues = [...new Set(dataSource.map(item => item[dataKey]))];
    return uniqueValues.map(value => ({
      text: value,
      value: value,
    }));
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 70,
      fixed: 'left',
      render: (text, record, index) => (
          <Badge
              count={page * size + index + 1}
              style={{ backgroundColor: '#52c41a' }}
          />
      ),
      responsive: ["sm"],
    },
    {
      title: (
          <span>
          <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Course
        </span>
      ),
      dataIndex: "courseName",
      key: "courseName",
      ellipsis: true,
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
      filters: getUniqueFilters('courseName'),
      onFilter: (value, record) => record.courseName.includes(value),
      render: (text) => (
          <Tooltip title={text}>
            <Text strong style={{ color: '#1890ff', fontSize: isMobile ? 13 : 14 }}>{text}</Text>
          </Tooltip>
      ),
    },
    {
      title: (
          <span>
          <TeamOutlined style={{ marginRight: 8, color: '#faad14' }} />
          Group
        </span>
      ),
      dataIndex: "groupName",
      key: "groupName",
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
      filters: getUniqueFilters('groupName'),
      onFilter: (value, record) => record.groupName.includes(value),
      render: (text) => <Tag color="orange">{text}</Tag>,
      responsive: ["md"],
    },
    {
      title: (
          <span>
          <UserOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          Teacher
        </span>
      ),
      dataIndex: "teacherName",
      key: "teacherName",
      sorter: (a, b) => a.teacherName.localeCompare(b.teacherName),
      filters: getUniqueFilters('teacherName'),
      onFilter: (value, record) => record.teacherName.includes(value),
      render: (text) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" style={{ backgroundColor: '#722ed1', marginRight: 8 }}>
              {text.charAt(0)}
            </Avatar>
            <Text style={{ fontSize: isMobile ? 13 : 14 }}>{text}</Text>
          </div>
      ),
      responsive: ["lg"],
    },
    {
      title: "Action",
      key: "action",
      width: isMobile ? 100 : 150,
      fixed: "right",
      render: (_, record) => (
          <Space size="small">
            {isMobile && (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handleViewDetails(record)}
                />
            )}
            <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                size="small"
                onClick={() => handleNavigateToTasks(record)}
            >
              {isMobile ? "" : "Tasks"}
            </Button>
          </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? '12px 0' : '16px 0' }}>
          <Row gutter={[isMobile ? 8 : 16, 8]}>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                <Text strong style={{ fontSize: isMobile ? 12 : 13 }}>Teacher:</Text>
              </div>
              <Text style={{ marginLeft: 24, fontSize: isMobile ? 12 : 14 }}>{record.teacherName}</Text>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ color: '#faad14', marginRight: 8 }} />
                <Text strong style={{ fontSize: isMobile ? 12 : 13 }}>Group:</Text>
              </div>
              <Text style={{ marginLeft: 24, fontSize: isMobile ? 12 : 14 }}>{record.groupName}</Text>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text strong style={{ fontSize: isMobile ? 12 : 13 }}>Course:</Text>
              </div>
              <Text style={{ marginLeft: 24, fontSize: isMobile ? 12 : 14 }}>{record.courseName}</Text>
            </Col>
          </Row>
        </div>
    ),
    rowExpandable: (record) => !isMobile,
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {dataSource.map((subject, index) => (
            <Card
                key={subject.id}
                size="small"
                className="subject-card"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #1890ff",
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Badge
                        count={page * size + index + 1}
                        style={{ backgroundColor: '#52c41a', marginBottom: 8 }}
                    />
                    <Title level={5} style={{ margin: "4px 0 8px 0", fontSize: 15, color: '#1890ff' }}>
                      <BookOutlined style={{ marginRight: 6 }} />
                      {subject.courseName}
                    </Title>
                  </div>
                </div>

                <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <TeamOutlined style={{ color: "#faad14" }} />
                    <Text style={{ fontSize: 12 }}>
                      <Text type="secondary">Group: </Text>
                      <Tag color="orange" style={{ marginLeft: 4 }}>{subject.groupName}</Tag>
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Avatar size="small" style={{ backgroundColor: '#722ed1' }}>
                      {subject.teacherName.charAt(0)}
                    </Avatar>
                    <Text style={{ fontSize: 12 }}>
                      <Text type="secondary">Teacher: </Text>
                      <Text strong>{subject.teacherName}</Text>
                    </Text>
                  </div>
                </Space>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(subject)}
                    size="small"
                    style={{ flex: 1 }}
                >
                  Details
                </Button>
                <Button
                    icon={<ArrowRightOutlined />}
                    onClick={() => handleNavigateToTasks(subject)}
                    type="primary"
                    size="small"
                    style={{ flex: 1 }}
                >
                  View Tasks
                </Button>
              </div>
            </Card>
        ))}
      </Space>
  );

  if (loading && dataSource.length === 0) {
    return (
        <div style={{ padding: isMobile ? '16px' : '24px' }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
    );
  }

  return (
      <div style={{padding: "8px"}}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '20px' : '32px',
          marginBottom: isMobile ? '16px' : '24px',
          color: 'white'
        }}>
          <Row justify="space-between" align="middle" gutter={[0, isMobile ? 12 : 0]}>
            <Col xs={24} md={12}>
              <Title level={isMobile ? 3 : 2} style={{ color: 'white', margin: 0, fontSize: isMobile ? '20px' : undefined }}>
                <BookOutlined style={{ marginRight: isMobile ? 8 : 12 }} />
                My Subjects
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '13px' : '16px' }}>
                {isMobile ? 'Manage your courses' : 'Manage your enrolled courses and assignments'}
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <SearchComponent
                  placeholder={isMobile ? "Search..." : "Search subjects... (Ctrl+K)"}
                  handleSearch={handleSearch}
                  loading={loading}
              />
            </Col>
          </Row>
        </div>

        {/* Table or Card View */}
        {dataSource.length === 0 && !loading ? (
            <Card style={{ textAlign: 'center', padding: isMobile ? '32px' : '48px', borderRadius: isMobile ? '8px' : '12px' }}>
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <BookOutlined style={{ fontSize: isMobile ? 48 : 64, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={isMobile ? 4 : 3} type="secondary">
                  {searchText ? `No subjects found for "${searchText}"` : "No subjects available"}
                </Title>
                {searchText && (
                    <Button type="primary" onClick={() => handleSearch('')} size={isMobile ? "middle" : "large"}>
                      Clear Search
                    </Button>
                )}
              </div>
            </Card>
        ) : isMobile ? (
            <>
              <MobileCardView />

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
                    Total: {totalElements} subjects
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Card style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
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
                    showTotal: (total, range) =>
                        `Showing ${range[0]}-${range[1]} of ${total} subjects`,
                    responsive: true,
                    style: { padding: '16px 24px' },
                    size: isTablet ? "small" : "default",
                  }}
                  loading={loading}
                  scroll={{ x: isTablet ? 800 : 'max-content', y: 400 }}
                  sticky
                  size={isTablet ? "small" : "middle"}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
              />
            </Card>
        )}

        {/* Subject Details Drawer */}
        <Drawer
            title="Subject Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="60vh"
        >
          {selectedSubject && (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Avatar
                      size={64}
                      icon={<BookOutlined />}
                      style={{ backgroundColor: "#1890ff", marginBottom: 12 }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedSubject.courseName}
                  </Title>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={<><BookOutlined /> Course</>}>
                    <Text strong>{selectedSubject.courseName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<><TeamOutlined /> Group</>}>
                    <Tag color="orange">{selectedSubject.groupName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={<><UserOutlined /> Teacher</>}>
                    <Space>
                      <Avatar size="small" style={{ backgroundColor: '#722ed1' }}>
                        {selectedSubject.teacherName.charAt(0)}
                      </Avatar>
                      <Text>{selectedSubject.teacherName}</Text>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16 }}>
                  <Button
                      icon={<ArrowRightOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleNavigateToTasks(selectedSubject);
                      }}
                      type="primary"
                      block
                      size="large"
                  >
                    View Tasks
                  </Button>
                </div>
              </>
          )}
        </Drawer>

        {/* Custom Styles */}
        <style jsx={true}>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-bottom: 2px solid #e8e8e8;
          font-weight: 600;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f0f9ff !important;
        }
        
        .subject-card {
          transition: all 0.3s ease;
        }
        
        .subject-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        
        .ant-badge-count {
          font-weight: 600;
        }
        
        .ant-btn-primary {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }
      `}</style>
      </div>
  );
};

export default StudentGroupList;