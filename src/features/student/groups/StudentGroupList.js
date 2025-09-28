import { Fragment, useState, useEffect, useCallback } from "react";
import {
  Avatar, Badge, Button, Card, Col, Dropdown, message, Row, Skeleton, Space,
  Table, Tag, Tooltip, Typography
} from "antd";
import {
  ArrowRightOutlined, BookOutlined, EyeOutlined, FilterOutlined,
  MoreOutlined, ReloadOutlined, TeamOutlined, UserOutlined
} from "@ant-design/icons";
import { getStudentSubjectList } from "../../../services/api-client";
import SearchComponent from "../../const/SearchComponent";
import { useNavigate } from "react-router-dom";

const { Title, Text, Empty } = Typography;

const StudentGroupList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
          <Text strong style={{ color: '#1890ff' }}>{text}</Text>
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
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => {

        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              size="small"
              onClick={() =>
                navigate(`/student/subjects/${record.id}/tasks`, {
                  state: { record },
                })
              }
            >
              Tasks
            </Button>
          </Space>
        );
      },
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <div style={{ padding: '16px 0' }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ color: '#722ed1', marginRight: 8 }} />
              <Text strong>Teacher:</Text>
            </div>
            <Text style={{ marginLeft: 24 }}>{record.teacherName}</Text>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TeamOutlined style={{ color: '#faad14', marginRight: 8 }} />
              <Text strong>Group:</Text>
            </div>
            <Text style={{ marginLeft: 24 }}>{record.groupName}</Text>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BookOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              <Text strong>Course:</Text>
            </div>
            <Text style={{ marginLeft: 24 }}>{record.courseName}</Text>
          </Col>
        </Row>
      </div>
    ),
    rowExpandable: (record) => true,
  };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: setSelectedRowKeys,
  // };

  if (loading && dataSource.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <Fragment>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <BookOutlined style={{ marginRight: 12 }} />
              My Subjects
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
              Manage your enrolled courses and assignments
            </Text>
          </Col>
          <Col>
            <SearchComponent
              placeholder="Search subjects... (Ctrl+K)"
              handleSearch={handleSearch}
              loading={loading}
            />
          </Col>
        </Row>
      </div>

      {/* Controls Section */}
      <Card
        style={{ marginBottom: '16px', borderRadius: '12px' }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="middle">
              <Text strong>
                Total Subjects: <Badge count={totalElements} style={{ backgroundColor: '#52c41a' }} />
              </Text>
              {selectedRowKeys.length > 0 && (
                <Text>
                  Selected: <Badge count={selectedRowKeys.length} style={{ backgroundColor: '#1890ff' }} />
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title="Refresh data">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table Section */}
      {dataSource.length === 0 && !loading ? (
        <Card style={{ textAlign: 'center', padding: '48px', borderRadius: '12px' }}>
          <Empty
            description={
              <span>
                {searchText ? `No subjects found for "${searchText}"` : "No subjects available"}
              </span>
            }
          >
            {searchText && (
              <Button type="primary" onClick={() => handleSearch('')}>
                Clear Search
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        <Card style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            expandable={expandableConfig}
            // rowSelection={rowSelection}
            pagination={{
              current: page + 1,
              pageSize: size,
              total: totalElements,
              onChange: handlePagination,
              onShowSizeChange: handlePageSizeChange,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} subjects`,
              responsive: true,
              style: { padding: '16px 24px' }
            }}
            loading={loading}
            scroll={{ x: 'max-content', y: 400 }}
            sticky
            size="middle"
            style={{
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          />
        </Card>
      )}

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
        
        .subject-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transition: all 0.3s ease;
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
    </Fragment>
  );
};

export default StudentGroupList;