import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, Empty, Col, message, Progress, Row, Space, Statistic, Table, Tag, Tooltip, Typography } from "antd";
import {
  ArrowLeftOutlined, BookOutlined, CalendarOutlined, CloudUploadOutlined,
  DownloadOutlined, FileOutlined, FileTextOutlined, InfoCircleOutlined, ReloadOutlined, TrophyOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { download, getStudentHomework } from "../../../../services/api-client";
import UploadHomeworkModal from "./UploadHomeworkModal";
import dayjs from "dayjs";

const { Title, Text , Paragraph  } = Typography;

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentHomework(groupId);
      console.log(response);
      const { success, data, message: errorMessage } = response.data;

      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);

        // Calculate exam
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
  }, []);

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
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
    setPage(newPage - 1);
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
      width: 60,
      fixed: 'left',
      render: (text, record, index) => (
        <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: (
        <span>
          <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Task Details
        </span>
      ),
      key: "taskDetails",
      width: 200,
      render: (record) => {
        const taskStatus = getTaskStatus(record);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                {record.taskName}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="blue">{record.type}</Tag>
              <Tag color={taskStatus.color}>{taskStatus.text}</Tag>
            </div>
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
      width: 150,
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
      width: 120,
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
      <div style={{ padding: '16px 0' }}>
        <Paragraph>
          <Text strong>Description: </Text>
          {record.description || 'No description available'}
        </Paragraph>
      </div>
    ),
    rowExpandable: (record) => true,
  };

  if (loading && dataSource.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Card loading style={{ height: 400 }} />
      </div>
    );
  }

  return (
    <Fragment>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <BookOutlined style={{ marginRight: 12 }} />
              {groupName}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
              Track your homework submissions and grades
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                style={{ marginRight: 8 }}
              >
                Refresh
              </Button>
              <Button
                type="default"
                onClick={handleBack}
                icon={<ArrowLeftOutlined />}
                style={{ backgroundColor: 'white', borderColor: 'white' }}
              >
                Back
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12, minHeight: 160 }}>
            <Statistic
              title="Current Score"
              value={currentBall}
              valueStyle={{ color: '#1890ff', fontSize: 28 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12, minHeight: 160 }}>
            <Statistic
              title="Max Score"
              value={maxBall}
              valueStyle={{ color: '#722ed1', fontSize: 28 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12, minHeight: 160 }}>
            <div>
              <Text strong style={{ color: '#666', fontSize: 14 }}>Mastering rate</Text>
              <div style={{ marginTop: 8 }}>
                <Progress
                  type="circle"
                  percent={parseFloat(percentBall)}
                  size={80}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12, minHeight: 160 }}>
            <Statistic
              title="Current Grade"
              value={currentGrade}
              valueStyle={{
                color: getGradeColor(currentGrade),
                fontSize: 28,
                fontWeight: 'bold'
              }}
              suffix={<Text style={{ fontSize: 16, color: '#999' }}>/5</Text>}
            />
          </Card>
        </Col>
      </Row>

      {/* Tasks Table */}
      {dataSource.length === 0 && !loading ? (
        <Card style={{ textAlign: 'center', padding: '48px', borderRadius: '12px' }}>
          <Empty
            description="No tasks available for this group"
          >
            <Button type="primary" onClick={handleRefresh}>
              Refresh Data
            </Button>
          </Empty>
        </Card>
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
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} tasks`,
              responsive: true,
              style: { padding: '16px 24px' }
            }}
            loading={loading}
            scroll={{ x: 1000, y: 400 }}
            sticky
            size="middle"
            style={{ borderRadius: '12px', overflow: 'hidden' }}
          />
        </Card>
      )}

      {/* Include your UploadHomeworkModal component here */}
      <UploadHomeworkModal
        isOpen={isUploadHomeworkModalVisible}
        onClose={hideModal}
        onSuccess={handleSuccess}
        taskId={taskId}
        homeworkId={homeworkId}
        taskName={selectedTaskName}
      />

      {/* Custom Styles */}
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
      font-size: 16px !important;
      font-weight: bold;
    }
    .ant-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
    .ant-statistic-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-card {
      transition: all 0.3s ease;
    }
    .ant-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
  `}</style>
    </Fragment>
  );
};

export default StudentHomeworkList;