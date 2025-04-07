import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, message, Space, Table, Tooltip, Typography } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { download, getStudentHomework } from "../../../../services/api-client";
import UploadHomeworkModal from "./UploadHomeworkModal";

const { Title, Text } = Typography;

const StudentHomeworkList = () => {
  const { groupId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const record = state?.record || {};
  const groupName = record.groupName || "Unknown Group";

  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [currentBall, setCurrentBall] = useState(0);
  const [maxBall, setMaxBall] = useState(0);
  const [percentBall, setPercentBall] = useState(0);
  const [currentGrade, setCurrentGrade] = useState(0);
  const [isUploadHomeworkModalVisible, setIsUploadHomeworkModalVisible] = useState(false);
  const [homeworkId, setHomeworkId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentHomework(groupId);
      const { success, data, message: errorMessage } = response.data;

      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);

        // Calculate statistics
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
    } catch (err) {
      message.error(err.message || "Error downloading file");
    }
  };

  const handleUpload = (homeworkId, taskId) => {
    setHomeworkId(homeworkId);
    setTaskId(taskId);
    setIsUploadHomeworkModalVisible(true);
  };

  const handleBack = () => {
    navigate("/my-subjects");
  };

  const hideModal = () => {
    setIsUploadHomeworkModalVisible(false);
  };

  const handleSuccess = () => {
    fetchData();
    hideModal();
  };

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Task",
      dataIndex: "taskName",
      key: "taskName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Task File",
      key: "taskFileName",
      render: (record) => {
        const fileSize = record.taskFileSize;
        const displaySize =
          fileSize < 1024
            ? `${fileSize} Bytes`
            : fileSize < 1024 * 1024
              ? `${(fileSize / 1024).toFixed(2)} KB`
              : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;

        return record.taskFileName == null ? (
          <Button type="default" disabled style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18vh",
          }}>
            Not Uploaded
          </Button>
        ) : (
          <Tooltip title={record.taskFileName}>
            <Button
              type="default"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18vh",
              }}
              onClick={() => handleDownload(record.taskFileId, record.taskFileName)}
            >
              <DownloadOutlined style={{ marginRight: "1vh" }} />
              {displaySize}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Ball | Max",
      key: "homeworkBall",
      render: (record) => {
        const maxBall = record.maxBall || 0;
        const ball = record.homeworkBall || null;

        return (
          <div style={{ display: "flex" }}>
            <Tooltip title={record?.description}>
              <div
                style={{
                  width: "4.5vh",
                  height: "4.5vh",
                  border: "1px solid #1890ff",
                  borderRadius: "4px 0 0 4px",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {ball != null ? ball : "  "}
              </div>
            </Tooltip>
            <Tooltip title={record?.description}>
              <div
                style={{
                  width: "4.5vh",
                  height: "4.5vh",
                  border: "1px solid #1890ff",
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#1890ff",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {maxBall}
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "StudentHomeworkList",
      key: "homeworkName",
      render: (record) => {
        const fileSize = record.homeworkFileSize;
        const displaySize =
          fileSize < 1024
            ? `${fileSize} Bytes`
            : fileSize < 1024 * 1024
              ? `${(fileSize / 1024).toFixed(2)} KB`
              : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;

        return record.homeworkFileName == null ? (
          <Button
            type="default"
            style={{ width: "18vh" }}
            onClick={() => handleUpload(record?.homeworkId, record.taskId)}
          >
            <UploadOutlined style={{ marginRight: "1vh" }} /> Upload Task
          </Button>
        ) : (
          <Space direction="vertical">
            <Tooltip title={record?.homeworkFileName}>
              <Button
                type="primary"
                style={{
                  width: "18vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => handleDownload(record.homeworkFileId, record?.homeworkFileName)}
              >
                <DownloadOutlined style={{ marginRight: "1vh" }} />
                {displaySize}
              </Button>
            </Tooltip>
            <Button
              type="default"
              style={{
                width: "18vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleUpload(record?.homeworkId, record.taskId)}
            >
              Re-upload
            </Button>
          </Space>
        );
      },
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Comment:</strong> {record.description}
      </p>
    ),
    rowExpandable: (record) => true,
  };

  return (
    <Fragment>
      <Title level={2}>
        {groupName}
        <Button
          type="dashed"
          onClick={handleBack}
          icon={<ArrowLeftOutlined />}
          style={{ float: "right", marginBottom: "1vh" }}
        >
          Back
        </Button>
      </Title>
      <Space
        size="large"
        style={{
          border: "1px solid #1890ff",
          display: "flex",
          justifyContent: "space-around",
          marginTop: "3vh",
          marginBottom: "3vh",
          paddingTop: "2vh",
          paddingBottom: "2vh",
          borderRadius: "1vh",
        }}
      >
        <div style={{ textAlign: "center" }} >
          <Text style={{ fontSize: "3vh" }} strong>Current Score</Text>
          <br />
          <Text style={{ fontSize: "3vh" }} >{currentBall}</Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "3vh" }}  strong>Max Score</Text>
          <br />
          <Text style={{ fontSize: "3vh" }} >{maxBall}</Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "3vh" }}  strong>Progress</Text>
          <br />
          <Text style={{ fontSize: "3vh" }} >{percentBall}%</Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "3vh" }}  strong>Current Grade</Text>
          <br />
          <Text style={{ fontSize: "3vh" }} >{currentGrade}</Text>
        </div>
      </Space>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="taskId"
        expandable={expandableConfig}
        pagination={{
          current: page + 1,
          pageSize: size,
          total: totalElements,
          onChange: handlePagination,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
        }}
        loading={loading}
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Task List</strong>}
        footer={() => `Total Tasks: ${totalElements}`}
      />
        <UploadHomeworkModal
          isOpen={isUploadHomeworkModalVisible}
          onClose={hideModal}
          onSuccess={handleSuccess}
          taskId={taskId}
          homeworkId={homeworkId}
        />
    </Fragment>
  );
};

export default StudentHomeworkList;