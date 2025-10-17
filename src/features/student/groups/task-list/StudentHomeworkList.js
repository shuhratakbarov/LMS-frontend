import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Badge, Button, Card, Empty, Col, message, Progress, Row, Space, Statistic,
  Table, Tag, Tooltip, Typography, Drawer, Descriptions, Avatar
} from "antd";
import {
  ArrowLeftOutlined, BookOutlined, CalendarOutlined, CloudUploadOutlined,
  DownloadOutlined, FileOutlined, FileTextOutlined, InfoCircleOutlined,
  ReloadOutlined, TrophyOutlined, UploadOutlined, EyeOutlined
} from "@ant-design/icons";
import { download, getStudentHomework } from "../../../../services/api-client";
import UploadHomeworkModal from "./UploadHomeworkModal";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const StudentHomeworkList = () => {
  const { groupId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const record = state?.record || {};
  const groupName = record.groupName || "Unknown Group";

  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [currentBall, setCurrentBall] = useState(0);
  const [maxBall, setMaxBall] = useState(0);
  const [percentBall, setPercentBall] = useState(0);
  const [currentGrade, setCurrentGrade] = useState(0);
  const [isUploadHomeworkModalVisible, setIsUploadHomeworkModalVisible] = useState(false);
  const [homeworkId, setHomeworkId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
      const response = await getStudentHomework(groupId);
      const { success, data, message: errorMessage } = response.data;

      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);

        let currentBall = 0;
        let maxBall = 0;
        data.content.forEach((item) => {
          currentBall += item.homeworkBall || 0;
          maxBall += item.maxBall || 0;
        });
        const percentBall = maxBall > 0 ? ((currentBall / maxBall) * 100).toFixed(2) : 0;
        const currentGrade =
            percentBall >= 90 ? 5 : percentBall >= 70 ? 4 : percentBall >= 60 ? 3 : 2;

        setCurrentBall(currentBall);
        setMaxBall(maxBall);
        setPercentBall(percentBall);
        setCurrentGrade(currentGrade);
      } else {
        message.error(errorMessage || "Failed to fetch tasks");
      }
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
      message.success(`Downloaded ${fileName}`);
    } catch (err) {
      message.error(err.message || "Error downloading file");
    }
  };

  const handleUpload = (homeworkId, taskId, taskName) => {
    setHomeworkId(homeworkId);
    setTaskId(taskId);
    setSelectedTaskName(taskName);
    setIsUploadHomeworkModalVisible(true);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDrawerVisible(true);
  };

  const handleBack = () => {
    navigate("/student/subjects");
  };

  const hideModal = () => {
    setIsUploadHomeworkModalVisible(false);
  };

  const handleSuccess = () => {
    fetchData();
    hideModal();
  };

  const handleRefresh = () => {
    fetchData();
    message.success('Data refreshed successfully');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getGradeColor = (grade) => {
    if (grade >= 5) return '#52c41a';
    if (grade >= 4) return '#1890ff';
    if (grade >= 3) return '#faad14';
    return '#ff4d4f';
  };

  const getTaskStatus = (record) => {
    const isDeadlinePassed = new Date(record.deadline) < new Date();
    const hasSubmission = record.homeworkFileName != null;
    const hasGrade = record.homeworkBall != null;

    if (hasGrade) return { status: 'completed', color: '#52c41a', text: 'Graded' };
    if (hasSubmission && !isDeadlinePassed) return { status: 'submitted', color: '#1890ff', text: 'Submitted' };
    if (hasSubmission && isDeadlinePassed) return { status: 'submitted', color: '#faad14', text: 'Submitted (Late)' };
    if (!hasSubmission && isDeadlinePassed) return { status: 'overdue', color: '#ff4d4f', text: 'Overdue' };
    return { status: 'pending', color: '#faad14', text: 'Pending' };
  };

  const handlePagination = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(1);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 40,
      fixed: 'left',
      render: (text, record, index) => (
          <Badge count={(page - 1) * size + index + 1} style={{ backgroundColor: '#1890ff' }} />
      ),
      responsive: ["sm"],
    },
    {
      title: (
          <span>
          <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Task
        </span>
      ),
      key: "taskDetails",
      width: 180,
      render: (record) => {
        const taskStatus = getTaskStatus(record);
        return (
            <div>
              <Text strong style={{ fontSize: isMobile ? 13 : 14, color: '#1890ff', display: 'block' }}>
                {record.taskName}
              </Text>
              <Space size="small" style={{ marginTop: 4 }}>
                <Tag color="blue" style={{ fontSize: isMobile ? 11 : 12 }}>{record.type}</Tag>
                <Tag color={taskStatus.color} style={{ fontSize: isMobile ? 11 : 12 }}>{taskStatus.text}</Tag>
              </Space>
            </div>
        );
      },
    },
    {
      title: (
          <span>
          <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
          Deadline
        </span>
      ),
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline) => {
        const isOverdue = new Date(deadline) < new Date();
        return (
            <Text style={{ color: isOverdue ? '#666' : 'green' }}>
              {deadline ? dayjs(deadline).format("YYYY-MM-DD") : "-"}
            </Text>
        );
      },
    },
    {
      title: (
          <span>
          <FileOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          Task File
        </span>
      ),
      key: "taskFile",
      width: 120,
      render: (record) => {
        return record.taskFileName == null ? (
            <Button disabled size="middle" style={{ width: '100%' }}>
              <InfoCircleOutlined />
              No File
            </Button>
        ) : (
            <Tooltip title={`Download: ${record.taskFileName}`}>
              <Button
                  size="middle"
                  style={{ width: '100%' }}
                  onClick={() => handleDownload(record.taskFileId, record.taskFileName)}
              >
                <DownloadOutlined />
                {formatFileSize(record.taskFileSize)}
              </Button>
            </Tooltip>
        );
      },
    },
    {
      title: (
          <span>
          <TrophyOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          Score
        </span>
      ),
      key: "score",
      width: 90,
      render: (record) => {
        const maxBall = record.maxBall || 0;
        let ball = record.homeworkBall >= 0 ? record.homeworkBall : null;
        const isOverdue = new Date(record.deadline) < new Date() && ball === null && !record.homeworkFileName;

        if (isOverdue) ball = 0;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={record?.description}>
                <div style={{
                  display: 'flex',
                  border: '2px solid #1890ff',
                  borderRadius: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: 40,
                    height: 32,
                    backgroundColor: ball !== null ? (ball === 0 && isOverdue ? '#ff4d4f' : '#f0f9ff') : '#fafafa',
                    borderColor: ball === 0 && isOverdue ? 'red' : '#1890ff',
                    color: ball !== null ? (ball === 0 && isOverdue ? 'white' : '#1890ff') : '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {ball !== null ? ball : '—'}
                  </div>
                  <div style={{
                    width: 40,
                    height: 32,
                    backgroundColor: '#1890ff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {maxBall}
                  </div>
                </div>
              </Tooltip>
            </div>
        );
      }
    },
    {
      title: (
          <span>
          <CloudUploadOutlined style={{ marginRight: 8, color: '#13c2c2' }} />
          Submission
        </span>
      ),
      key: "submission",
      width: 200,
      render: (record) => {
        const isDeadlinePassed = new Date(record.deadline) < new Date();
        const hasSubmission = record.homeworkFileName != null;
        const shouldDisableUpload = isDeadlinePassed && !hasSubmission;

        if (!hasSubmission) {
          return (
              <Button
                  type={shouldDisableUpload ? "danger" : "default"}
                  style={{
                    width: '100%',
                    borderColor: shouldDisableUpload ? 'red' : undefined
                  }}
                  onClick={() => handleUpload(record?.homeworkId, record.taskId, record.taskName)}
                  disabled={shouldDisableUpload}
                  icon={<UploadOutlined />}
              >
                {shouldDisableUpload ? "Expired" : "Upload Task"}
              </Button>
          );
        }

        return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Tooltip title={`Download: ${record.homeworkFileName}`}>
                <Button
                    type="primary"
                    style={{ width: '100%' }}
                    size="middle"
                    onClick={() => handleDownload(record.homeworkFileId, record.homeworkFileName)}
                    icon={<DownloadOutlined />}
                >
                  {formatFileSize(record.homeworkFileSize)}
                </Button>
              </Tooltip>
              {!isDeadlinePassed && (
                  <Button
                      style={{ width: '100%' }}
                      size="small"
                      onClick={() => handleUpload(record?.homeworkId, record.taskId, record.taskName)}
                  >
                    Re-upload
                  </Button>
              )}
            </Space>
        );
      },
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? '8px 0' : '12px 0' }}>
          <Paragraph style={{ margin: 0, fontSize: isMobile ? 12 : 13 }}>
            <Text strong>Description: </Text>
            {record.description || 'No description available'}
          </Paragraph>
        </div>
    ),
    rowExpandable: (record) => !isMobile && record.description,
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {dataSource.map((task, index) => {
          const taskStatus = getTaskStatus(task);
          const isDeadlinePassed = new Date(task.deadline) < new Date();
          const hasSubmission = task.homeworkFileName != null;
          const shouldDisableUpload = isDeadlinePassed && !hasSubmission;
          let ball = task.homeworkBall >= 0 ? task.homeworkBall : null;
          const isOverdue = isDeadlinePassed && ball === null && !hasSubmission;
          if (isOverdue) ball = 0;

          return (
              <Card
                  key={task.taskId}
                  size="small"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${taskStatus.color}`,
                  }}
              >
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Badge count={(page - 1) * size + index + 1} style={{ backgroundColor: '#1890ff' }} />
                    <Tag color={taskStatus.color} style={{ fontSize: 11 }}>{taskStatus.text}</Tag>
                  </div>

                  <Title level={5} style={{ margin: "4px 0 8px 0", fontSize: 14, color: '#1890ff' }}>
                    {task.taskName}
                  </Title>

                  <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontSize: 12 }}>
                        <CalendarOutlined style={{ marginRight: 4, color: '#faad14' }} />
                        {dayjs(task.deadline).format("YYYY-MM-DD")}
                      </Text>
                      <div style={{
                        display: 'flex',
                        border: '2px solid #1890ff',
                        borderRadius: 6,
                        overflow: 'hidden',
                        fontSize: 11
                      }}>
                        <div style={{
                          width: 28,
                          height: 24,
                          backgroundColor: ball !== null ? (ball === 0 && isOverdue ? '#ff4d4f' : '#f0f9ff') : '#fafafa',
                          color: ball !== null ? (ball === 0 && isOverdue ? 'white' : '#1890ff') : '#999',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {ball !== null ? ball : '—'}
                        </div>
                        <div style={{
                          width: 28,
                          height: 24,
                          backgroundColor: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {task.maxBall}
                        </div>
                      </div>
                    </div>

                    <Tag color="blue" style={{ fontSize: 11 }}>{task.type}</Tag>

                    {task.description && (
                        <Text
                            type="secondary"
                            style={{
                              fontSize: 11,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                        >
                          {task.description}
                        </Text>
                    )}
                  </Space>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetails(task)}
                      size="small"
                      style={{ flex: 1 }}
                  >
                    Details
                  </Button>
                  <Button
                      type={hasSubmission ? "primary" : shouldDisableUpload ? "danger" : "default"}
                      icon={hasSubmission ? <DownloadOutlined /> : <UploadOutlined />}
                      onClick={() => hasSubmission
                          ? handleDownload(task.homeworkFileId, task.homeworkFileName)
                          : handleUpload(task?.homeworkId, task.taskId, task.taskName)
                      }
                      disabled={shouldDisableUpload && !hasSubmission}
                      size="small"
                      style={{ flex: 1 }}
                  >
                    {hasSubmission ? 'Download' : shouldDisableUpload ? 'Expired' : 'Upload'}
                  </Button>
                </div>
              </Card>
          );
        })}
      </Space>
  );

  if (loading && dataSource.length === 0) {
    return (
        <div style={{ padding: isMobile ? '16px' : '24px' }}>
          <Card loading style={{ height: 400 }} />
        </div>
    );
  }

  return (
      <div style={{padding: "6px"}}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '20px' : '32px',
          marginBottom: isMobile ? '16px' : '24px',
          color: 'white'
        }}>
          <Row justify="space-between" align="middle" gutter={[0, isMobile ? 12 : 0]}>
            <Col xs={24} md={12}>
              <Title level={isMobile ? 3 : 2} style={{ color: 'white', margin: 0, fontSize: isMobile ? '18px' : undefined }}>
                <BookOutlined style={{ marginRight: isMobile ? 8 : 12 }} />
                {groupName}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '13px' : '16px' }}>
                {isMobile ? 'Track your submissions' : 'Track your homework submissions and grades'}
              </Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <Space>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                    size={isMobile ? "middle" : "default"}
                >
                  {isMobile ? '' : 'Refresh'}
                </Button>
                <Button
                    type="default"
                    onClick={handleBack}
                    icon={<ArrowLeftOutlined />}
                    style={{ backgroundColor: 'white', borderColor: 'white' }}
                    size={isMobile ? "middle" : "default"}
                >
                  Back
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 16 : 24 }}>
          <Col xs={12} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: isMobile ? 8 : 12, minHeight: isMobile ? 120 : 160 }}>
              <Statistic
                  title="Current"
                  value={currentBall}
                  valueStyle={{ color: '#1890ff', fontSize: isMobile ? 20 : 28 }}
                  prefix={<TrophyOutlined style={{ fontSize: isMobile ? 16 : 20 }} />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: isMobile ? 8 : 12, minHeight: isMobile ? 120 : 160 }}>
              <Statistic
                  title="Max"
                  value={maxBall}
                  valueStyle={{ color: '#722ed1', fontSize: isMobile ? 20 : 28 }}
                  prefix={<TrophyOutlined style={{ fontSize: isMobile ? 16 : 20 }} />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: isMobile ? 8 : 12, minHeight: isMobile ? 120 : 160 }}>
              <Text strong style={{ color: '#666', fontSize: isMobile ? 12 : 14, display: 'block', marginBottom: 8 }}>
                Mastering
              </Text>
              <Progress
                  type="circle"
                  percent={parseFloat(percentBall)}
                  size={isMobile ? 60 : 80}
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: isMobile ? 8 : 12, minHeight: isMobile ? 120 : 160 }}>
              <Statistic
                  title="Grade"
                  value={currentGrade}
                  valueStyle={{
                    color: getGradeColor(currentGrade),
                    fontSize: isMobile ? 20 : 28,
                    fontWeight: 'bold'
                  }}
                  suffix={<Text style={{ fontSize: isMobile ? 14 : 16, color: '#999' }}>/5</Text>}
              />
            </Card>
          </Col>
        </Row>

        {/* Tasks Table or Cards */}
        {dataSource.length === 0 && !loading ? (
            <Card style={{ textAlign: 'center', padding: isMobile ? '32px' : '48px', borderRadius: isMobile ? '8px' : '12px' }}>
              <Empty description="No tasks available">
                <Button type="primary" onClick={handleRefresh} size={isMobile ? "middle" : "large"}>
                  Refresh Data
                </Button>
              </Empty>
            </Card>
        ) : isMobile ? (
            <>
              <MobileCardView />

              {/* Mobile Pagination */}
              <Card size="small" style={{ marginTop: 16, textAlign: "center" }}>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Page {page} of {Math.ceil(totalElements / size)}
                  </Text>
                  <Space size="small">
                    <Button
                        size="small"
                        onClick={() => handlePagination(page - 1)}
                        disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handlePagination(page + 1)}
                        disabled={page * size >= totalElements}
                    >
                      Next
                    </Button>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Total: {totalElements} tasks
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Card style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
              <Table
                  dataSource={dataSource}
                  columns={columns}
                  rowKey="taskId"
                  expandable={expandableConfig}
                  pagination={{
                    current: page,
                    pageSize: size,
                    total: totalElements,
                    onChange: handlePagination,
                    onShowSizeChange: handlePageSizeChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showQuickJumper: !isTablet,
                    showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} tasks`,
                    responsive: true,
                    style: { padding: '16px 24px' },
                    size: isTablet ? "small" : "default",
                  }}
                  loading={loading}
                  scroll={{ x: isTablet ? 900 : 1000, y: 400 }}
                  sticky
                  size={isTablet ? "small" : "middle"}
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
              />
            </Card>
        )}

        {/* Task Details Drawer */}
        <Drawer
            title="Task Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="70vh"
        >
          {selectedTask && (
              <>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Avatar
                      size={64}
                      icon={<FileTextOutlined />}
                      style={{ backgroundColor: "#1890ff", marginBottom: 12 }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedTask.taskName}
                  </Title>
                  <Tag color={getTaskStatus(selectedTask).color} style={{ marginTop: 8 }}>
                    {getTaskStatus(selectedTask).text}
                  </Tag>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Type">
                    <Tag color="blue">{selectedTask.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Deadline">
                    {dayjs(selectedTask.deadline).format("YYYY-MM-DD HH:mm")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Score">
                    <Text strong style={{ color: '#1890ff' }}>
                      {selectedTask.homeworkBall >= 0 ? selectedTask.homeworkBall : '—'} / {selectedTask.maxBall}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Task File">
                    {selectedTask.taskFileName ? (
                        <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(selectedTask.taskFileId, selectedTask.taskFileName)}
                        >
                          {selectedTask.taskFileName}
                        </Button>
                    ) : (
                        <Text type="secondary">No file</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submission">
                    {selectedTask.homeworkFileName ? (
                        <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(selectedTask.homeworkFileId, selectedTask.homeworkFileName)}
                        >
                          {selectedTask.homeworkFileName}
                        </Button>
                    ) : (
                        <Text type="secondary">Not submitted</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedTask.description || 'No description'}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  {selectedTask.homeworkFileName ? (
                      <Button
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            setDrawerVisible(false);
                            handleDownload(selectedTask.homeworkFileId, selectedTask.homeworkFileName);
                          }}
                          type="primary"
                          block
                          size="large"
                      >
                        Download Submission
                      </Button>
                  ) : (
                      <Button
                          icon={<UploadOutlined />}
                          onClick={() => {
                            setDrawerVisible(false);
                            handleUpload(selectedTask?.homeworkId, selectedTask.taskId, selectedTask.taskName);
                          }}
                          type="primary"
                          block
                          size="large"
                          disabled={new Date(selectedTask.deadline) < new Date()}
                      >
                        Upload Task
                      </Button>
                  )}
                </div>
              </>
          )}
        </Drawer>

        <UploadHomeworkModal
            isOpen={isUploadHomeworkModalVisible}
            onClose={hideModal}
            onSuccess={handleSuccess}
            taskId={taskId}
            homeworkId={homeworkId}
            taskName={selectedTaskName}
        />

        <style>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-bottom: 2px solid #e8e8e8;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover > td {
          background: #f0f9ff !important;
        }
        .ant-progress-circle .ant-progress-text {
          font-size: 14px !important;
          font-weight: bold;
        }
        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
      `}</style>
      </div>
  );
};

export default StudentHomeworkList;