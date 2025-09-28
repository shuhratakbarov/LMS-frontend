import { useState, useCallback, useEffect } from "react";
import {
  Col, Avatar, Empty, Row, Tag, Tooltip, message, Table,
  Button, Typography, Space, Card, Statistic
} from "antd";
import {
  ArrowRightOutlined, ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined, TeamOutlined,
  BookOutlined, StarOutlined, DownloadOutlined
} from "@ant-design/icons";
import { download, getTeacherTaskList } from "../../../../services/api-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TeacherTaskList = () => {
  const { groupId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState();
  const [totalElements, setTotalElements] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
  const [isDeleteTaskVisible, setIsDeleteTaskVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState({});
  const [taskToDelete, setTaskToDelete] = useState({});

  const record = state?.record;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTeacherTaskList(groupId);
      const { data } = response.data;
      setDataSource(data);
      setTotalElements(data.length);
    } catch (err) {
      message.error(err.message || "An error occurred while fetching tasks");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await download(groupId, fileId);
      const blob = new Blob([response.data]);
      const fileUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = fileUrl;
      tempLink.setAttribute("download", fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (err) {
      message.error(err.message || "Error downloading file");
    }
  };

  const handleAddTask = () => setIsAddTaskVisible(true);
  const handleEdit = (record) => {
    setTaskToEdit(record);
    setIsEditTaskVisible(true);
  };
  const handleDelete = (record) => {
    setTaskToDelete(record);
    setIsDeleteTaskVisible(true);
  };
  const handleBack = () => navigate("/teacher/groups");
  const hideModal = () => {
    setIsAddTaskVisible(false);
    setIsEditTaskVisible(false);
    setIsDeleteTaskVisible(false);
  };
  const handleSuccess = () => {
    fetchData();
    hideModal();
  };
  const handlePagination = (newPage) => setPage(newPage - 1);
  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#52c41a";
      case "medium":
        return "#faad14";
      case "hard":
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "assignment":
        return <FileTextOutlined />;
      case "lab report":
        return <BookOutlined />;
      case "quiz":
        return <TrophyOutlined />;
      case "project":
        return <StarOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
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
      title: "Task Details",
      dataIndex: "taskName",
      key: "taskName",
      width: 180,
      render: (text, record) => (
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8
          }}>
            <Avatar
              size={40}
              style={{
                backgroundColor: getDifficultyColor(record.maxBall >= 12 ? "hard" : record.maxBall >= 7 && record.maxBall < 12 ? "medium" : "easy"),
                fontSize: 16
              }}
              icon={getTypeIcon(record.type)}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 600,
                fontSize: 15,
                color: "#262626",
                marginBottom: 2
              }}>
                {text}
              </div>
              <div style={{
                fontSize: 12,
                color: "#8c8c8c",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <Tag
                  color={getDifficultyColor(record.maxBall >= 12 ? "hard" : record.maxBall >= 7 && record.maxBall < 12 ? "medium" : "easy")}
                  style={{ margin: 0, fontSize: 10, borderRadius: 8 }}
                >
                  {record.maxBall >= 12 ? "hard" : record.maxBall >= 7 && record.maxBall < 12 ? "medium" : "easy"}
                </Tag>
                <span>{record.type}</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Deadline",
      key: "deadline",
      width: 200,
      render: (record) => {
        const daysLeft = getDaysUntilDeadline(record.deadline);
        const overdue = isOverdue(record.deadline);

        return (
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8
            }}>
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <Text strong style={{ color: "#262626" }}>
                {dayjs(record.deadline).format("YYYY-MM-DD")}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!overdue && daysLeft >= 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
                </Text>
              )}
              {overdue && (
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                  Overdue
                </Text>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: "Max score",
      key: "progress",
      width: 150,
      render: (record) => (
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }}>
            <Text strong style={{ fontSize: 16 }}>
              {record.maxBall} pts
            </Text>
            {/*  <div style={{*/}
            {/*    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',*/}
            {/*    color: 'white',*/}
            {/*    padding: '2px 8px',*/}
            {/*    borderRadius: 12,*/}
            {/*    fontSize: 11,*/}
            {/*    fontWeight: 'bold'*/}
            {/*  }}>*/}
            {/*    MAX*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div style={{ marginBottom: 8 }}>*/}
            {/*  <div style={{*/}
            {/*    display: 'flex',*/}
            {/*    justifyContent: 'space-between',*/}
            {/*    marginBottom: 4*/}
            {/*  }}>*/}
            {/*    <Text type="secondary" style={{ fontSize: 12 }}>*/}
            {/*      Submissions*/}
            {/*    </Text>*/}
            {/*    <Text style={{ fontSize: 12, fontWeight: 500 }}>*/}
            {/*      {record.submissionCount}/{record.totalStudents}*/}
            {/*    </Text>*/}
            {/*  </div>*/}
            {/*  <Progress*/}
            {/*    percent={Math.round((record.submissionCount / record.totalStudents) * 100)}*/}
            {/*    size="small"*/}
            {/*    strokeColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"*/}
            {/*  />*/}
            {/*</div>*/}
            {/*{record.avgScore > 0 && (*/}
            {/*  <div style={{*/}
            {/*    display: 'flex',*/}
            {/*    alignItems: 'center',*/}
            {/*    gap: 4*/}
            {/*  }}>*/}
            {/*    <StarOutlined style={{ color: '#faad14', fontSize: 12 }} />*/}
            {/*    <Text style={{ fontSize: 12 }}>*/}
            {/*      Avg: <Text strong>{record.avgScore}</Text>*/}
            {/*    </Text>*/}
          </div>

        </div>
      )
    },
    {
      title: "Attachment",
      key: "fileName",
      width: 150,
      render: (record) => {
        const fileSize = record.size;
        const displaySize =
          fileSize < 1024
            ? `${fileSize} Bytes`
            : fileSize < 1024 * 1024
              ? `${(fileSize / 1024).toFixed(2)} KB`
              : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
        return record.fileName == null ? (
          <Button type="default" style={{ width: "100px" }} disabled>
            Not Uploaded
          </Button>
        ) : (
          <Tooltip title={record.fileName}>
            <Button
              type="primary"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: "100px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onClick={() => handleDownload(record.pkey, record.fileName)}
            >
              <DownloadOutlined /> {displaySize}
            </Button>
          </Tooltip>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button
            type="text"
            size="large"
            style={{ borderRadius: 8 }}
            onClick={() => handleEdit(record)}
          >
            <EditOutlined style={{ color: "#1890ff" }} />
          </Button>
          <Button
            type="text"
            size="large"
            style={{ borderRadius: 8 }}
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined style={{ color: "#ff4d4f" }} />
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(`/teacher/groups/${groupId}/tasks/${record.id}/homework`, { state: { record: record, oldPageRecord: state.record } })}
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none"
            }}
          >
            <ArrowRightOutlined />
          </Button>
        </div>
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
          <Col span={12}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Card size="small" style={{ borderRadius: 8 }}>
                  <Statistic
                    title="Created"
                    value={record.createdAt}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ fontSize: 14 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ borderRadius: 8 }}>
                  <Statistic
                    title="Updated"
                    value={record.updatedAt}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ fontSize: 14 }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
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
          alignItems: "flex-start",
          marginBottom: 32
        }}>
          <div>
            <Title level={1} style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 8
            }}>
              {record.groupName}
            </Title>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                <BookOutlined /> {record.courseName}
              </Text>
            </div>
          </div>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={handleAddTask}
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                border: "none",
                height: 48,
                padding: "0 24px",
                boxShadow: "0 4px 16px rgba(82, 196, 26, 0.3)"
              }}
            >
              <PlusOutlined /> New Task
            </Button>
            <Button
              size="large"
              onClick={handleBack}
              style={{
                borderRadius: 12,
                height: 48,
                padding: "0 24px"
              }}
            >
              <ArrowLeftOutlined /> Back to Groups
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={48} sm={24} lg={12}>
            <Card style={{
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white"
            }}>
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.8)" }}>Total Tasks</span>}
                value={record.taskCount}
                prefix={<FileTextOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          {/*<Col xs={32} sm={18} lg={8}>*/}
          {/*  <Card style={{*/}
          {/*    borderRadius: 12,*/}
          {/*    border: 'none',*/}
          {/*    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'*/}
          {/*  }}>*/}
          {/*    <Statistic*/}
          {/*      title={<span style={{ color: 'rgba(0,0,0,0.6)' }}>Completed</span>}*/}
          {/*      value={record.taskCount}*/}
          {/*      prefix={<CheckCircleOutlined />}*/}
          {/*      valueStyle={{ color: '#262626', fontWeight: 'bold' }}*/}
          {/*    />*/}
          {/*  </Card>*/}
          {/*</Col>*/}
          <Col xs={48} sm={24} lg={12}>
            <Card style={{
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            }}>
              <Statistic
                title={<span style={{ color: "rgba(0,0,0,0.6)" }}>Students</span>}
                value={record.studentCount}
                prefix={<TeamOutlined />}
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
          {/*      value={4}*/}
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
              `Showing ${range[0]}-${range[1]} of ${total} tasks`,
            style: { marginTop: 24 }
          }}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No tasks found"
              />
            )
          }}
        />
      </Card>
      <CreateTask isOpen={isAddTaskVisible} onSuccess={handleSuccess} onClose={hideModal} groupId={groupId} />
      <EditTask isOpen={isEditTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToEdit} />
      <DeleteTask isOpen={isDeleteTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToDelete} />
    </div>
  );
};

export default TeacherTaskList;