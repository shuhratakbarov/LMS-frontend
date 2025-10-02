import { Fragment, useState, useCallback, useEffect } from "react";
import {
  Table, Button, Typography, Space, Card, Statistic, Tag, Tooltip, Badge,
  Row, Col, Input, Select, Dropdown, Avatar, Progress, Divider, message
} from "antd";
import {
  ArrowRightOutlined, SearchOutlined, FilterOutlined, BookOutlined, TeamOutlined,
  FileTextOutlined, MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined,
  PlusOutlined, BarChartOutlined, CalendarOutlined, ClockCircleOutlined,
  StarOutlined, TrophyOutlined, UserOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "../../const/SearchComponent";
import { getTeacherGroups } from "../../../services/api-client";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for demonstration
// const mockData = [
//   {
//     id: 1,
//     courseName: "Advanced Mathematics",
//     groupName: "Math-A-101",
//     studentCount: 24,
//     taskCount: 12,
//     activeStudents: 22,
//     completionRate: 85,
//     lastActivity: "2 hours ago",
//     averageGrade: 4.3,
//     status: "active"
//   },
//   {
//     id: 2,
//     courseName: "Physics Fundamentals",
//     groupName: "PHY-B-202",
//     studentCount: 18,
//     taskCount: 8,
//     activeStudents: 16,
//     completionRate: 92,
//     lastActivity: "1 day ago",
//     averageGrade: 4.5,
//     status: "active"
//   },
//   {
//     id: 3,
//     courseName: "Computer Science",
//     groupName: "CS-C-303",
//     studentCount: 0,
//     taskCount: 5,
//     activeStudents: 0,
//     completionRate: 0,
//     lastActivity: "Never",
//     averageGrade: 0,
//     status: "inactive"
//   },
//   {
//     id: 4,
//     courseName: "Biology Basics",
//     groupName: "BIO-D-104",
//     studentCount: 31,
//     taskCount: 15,
//     activeStudents: 28,
//     completionRate: 78,
//     lastActivity: "5 minutes ago",
//     averageGrade: 3.6,
//     status: "active"
//   }
// ];

const TeacherGroupList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState();
  const [dataSource, setDataSource] = useState();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTeacherGroups(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch groups of teacher");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching groups");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalStudents = dataSource?.reduce((sum, group) => sum + group.studentCount, 0);
  const totalTasks = dataSource?.reduce((sum, group) => sum + group.taskCount, 0);
  const avgCompletionRate = dataSource?.length > 0
    ? dataSource?.reduce((sum, group) => sum + group.completionRate, 0) / dataSource.length
    : 0;
  const activeGroups = dataSource?.filter(group => group.studentCount !== 0).length;

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(0);
  };

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#52c41a";
      case "inactive":
        return "#faad14";
      default:
        return "#d9d9d9";
    }
  };

  const getCompletionColor = (rate) => {
    if (rate >= 90) return "#52c41a";
    if (rate >= 70) return "#1890ff";
    if (rate >= 50) return "#faad14";
    return "#ff4d4f";
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text, record, index) => (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: 12
        }}>
          {page * size + index + 1}
        </div>
      )
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      width: 280,
      render: (text, record) => (
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#262626",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <Avatar
              size={32}
              style={{
                backgroundColor: "#1890ff",
                fontSize: 12
              }}
            >
              {text.split(" ").map(word => word[0]).join("")}
            </Avatar>
            {text}
          </div>
          <div style={{
            fontSize: 13,
            color: "#8c8c8c",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}>
            <BookOutlined />
            {record.courseName}
          </div>
        </div>
      )
    },
    {
      title: "Students",
      key: "students",
      width: 180,
      render: (record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <UserOutlined style={{ fontSize: 16, color: "#1890ff" }} />
            <Text style={{ marginLeft: 8, fontSize: 13 }}>
              {record.studentCount} student{record.studentCount > 1 ? "s" : ""}
            </Text>
          </div>
          {/*<div style={{ fontSize: 12, color: '#8c8c8c' }}>*/}
          {/*  <ClockCircleOutlined style={{ marginRight: 4 }} />*/}
          {/*  {record.lastActivity}*/}
          {/*</div>*/}
        </div>
      )
    },
    {
      title: "Tasks",
      key: "tasks",
      width: 200,
      render: (record) => (
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8
          }}>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <Text strong>{record.taskCount}</Text>
            <Text type="secondary">{record.taskCount > 1 ? "tasks" : "task"}</Text>
          </div>
          {/*<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>*/}
          {/*  <Progress*/}
          {/*    percent={record.completionRate}*/}
          {/*    size="small"*/}
          {/*    strokeColor={getCompletionColor(record.completionRate)}*/}
          {/*    style={{ flex: 1 }}*/}
          {/*  />*/}
          {/*  <Text style={{ fontSize: 12, fontWeight: 500 }}>*/}
          {/*    {record.completionRate}%*/}
          {/*  </Text>*/}
          {/*</div>*/}
        </div>
      )
    },
    // {
    //   title: "Performance",
    //   key: "performance",
    //   width: 120,
    //   render: (record) => (
    //     <div style={{ textAlign: 'center' }}>
    //       <div style={{
    //         fontSize: 18,
    //         fontWeight: 'bold',
    //         color: record.averageGrade >= 4 ? '#52c41a' : record.averageGrade >= 3 ? '#1890ff' : '#ff4d4f',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         gap: 4
    //       }}>
    //         {record.averageGrade > 0 ? (
    //           <>
    //             <StarOutlined />
    //             {record.averageGrade}
    //           </>
    //         ) : (
    //           <Text type="secondary">—</Text>
    //         )}
    //       </div>
    //       <Text type="secondary" style={{ fontSize: 12 }}>
    //         avg grade
    //       </Text>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Status",
    //   key: "status",
    //   width: 100,
    //   render: (record) => (
    //     <Tag
    //       color={record.status === 'active' ? 'success' : 'warning'}
    //       style={{
    //         borderRadius: 12,
    //         fontWeight: 500,
    //         textTransform: 'capitalize'
    //       }}
    //     >
    //       {record.status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Action",
      key: "actions",
      width: 120,
      render: (record) => (
        <Space>
          <Tooltip title={record.studentCount === 0 ? "No students in group" : "Enter group tasks"}>
            <Button
              type="primary"
              size="large"
              disabled={record.studentCount === 0}
              style={{
                borderRadius: 8,
                background: record.studentCount === 0 ? undefined : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none"
              }}
              onClick={() => {
                navigate(`/teacher/groups/${record.id}/tasks`, { state: { record } });
              }}
            >
              <ArrowRightOutlined />
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <div style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 20,
        borderRadius: 12,
        margin: "8px 0"
      }}>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <Card size="small" style={{ borderRadius: 8 }}>
              <Statistic
                title="Total Students"
                value={record.studentCount}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          {/*<Col span={8}>*/}
          {/*  <Card size="small" style={{ borderRadius: 8 }}>*/}
          {/*    <Statistic*/}
          {/*      title="Active Students"*/}
          {/*      value={record.activeStudents}*/}
          {/*      prefix={<TeamOutlined />}*/}
          {/*      valueStyle={{ color: '#52c41a' }}*/}
          {/*    />*/}
          {/*  </Card>*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*  <Card size="small" style={{ borderRadius: 8 }}>*/}
          {/*    <Statistic*/}
          {/*      title="Completion Rate"*/}
          {/*      value={record.completionRate}*/}
          {/*      suffix="%"*/}
          {/*      prefix={<TrophyOutlined />}*/}
          {/*      valueStyle={{ color: getCompletionColor(record.completionRate) }}*/}
          {/*    />*/}
          {/*  </Card>*/}
          {/*</Col>*/}
        </Row>
      </div>
    ),
    rowExpandable: (record) => true
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: 24
    }}>
      {/* Header Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
        padding: "32px 40px",
        marginBottom: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32
        }}>
          <div>
            <Title level={1} style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: 36,
              fontWeight: 700
            }}>
              My Teaching Groups
            </Title>
            <Text type="secondary" style={{ fontSize: 16, marginTop: 8 }}>
              Manage and monitor your student groups
            </Text>
          </div>
          <SearchComponent placeholder={"Search groups... (Ctrl+K)"} handleSearch={handleSearch} />
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={32} sm={18} lg={8}>
            <Card style={{
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white"
            }}>
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Active Groups</span>}
                value={activeGroups}
                prefix={<TeamOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={32} sm={18} lg={8}>
            <Card style={{
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            }}>
              <Statistic
                title={<span style={{ color: "rgba(0,0,0,0.6)" }}>Total Students</span>}
                value={totalStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#262626", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={32} sm={18} lg={8}>
            <Card style={{
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            }}>
              <Statistic
                title={<span style={{ color: "rgba(0,0,0,0.6)" }}>Total Tasks</span>}
                value={totalTasks}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#262626", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          {/*<Col xs={24} sm={12} lg={6}>*/}
          {/*  <Card style={{*/}
          {/*    borderRadius: 12,*/}
          {/*    border: 'none',*/}
          {/*    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'*/}
          {/*  }}>*/}
          {/*    <Statistic*/}
          {/*      title={<span style={{ color: 'rgba(0,0,0,0.6)' }}>Avg Completion</span>}*/}
          {/*      value={avgCompletionRate.toFixed(1)}*/}
          {/*      suffix="%"*/}
          {/*      prefix={<BarChartOutlined />}*/}
          {/*      valueStyle={{ color: '#262626', fontWeight: 'bold' }}*/}
          {/*    />*/}
          {/*  </Card>*/}
          {/*</Col>*/}
        </Row>
      </div>

      {/* Main Table */}
      <Card style={{
        borderRadius: 16,
        border: "none",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          expandable={expandableConfig}
          loading={loading}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: totalElements,
            onChange: handlePagination,
            onShowSizeChange: handlePageSizeChange,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} groups`,
            style: { marginTop: 24 }
          }}
          scroll={{ x: "max-content" }}
          style={{
            ".ant-table-thead > tr > th": {
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              fontWeight: 600
            }
          }}
        />
      </Card>
    </div>
  );
};

export default TeacherGroupList;