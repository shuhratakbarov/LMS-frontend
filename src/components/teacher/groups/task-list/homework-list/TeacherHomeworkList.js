import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Table, Tooltip, message } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { download, getTeacherHomeworkList } from "../../../../../services/api-client";
import EvaluateHomework from "./EvaluateHomework";
import UpdateEvaluatedHomework from "./UpdateEvaluatedHomework";
import Title from "antd/lib/typography/Title";

const TeacherHomeworkList = () => {
  const { groupId, taskId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const record = state?.record || {};
  const taskName = record.taskName || "Unknown Task";
  const deadline = record.deadline || "";
  const maxBall = record.maxBall || 0;
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [isEvaluateVisible, setIsEvaluateVisible] = useState(false);
  const [isUpdateEvaluateVisible, setIsUpdateEvaluateVisible] = useState(false);
  const [homework, setHomework] = useState({ homeworkBall: 0, description: "" });
  const [homeworkId, setHomeworkId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTeacherHomeworkList(taskId, groupId, page, size);
      const { data } = response.data;
      setDataSource(data.content);
      setTotalElements(data.totalElements);
    } catch (err) {
      message.error(err.message || "An error occurred while fetching homework");
    } finally {
      setLoading(false);
    }
  }, [groupId, taskId]);

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

  const handleEvaluate = (homeworkId) => {
    setHomeworkId(homeworkId);
    setIsEvaluateVisible(true);
  };

  const handleChangeEvaluation = (ball, description, homeworkId) => {
    setHomework({ homeworkBall: ball, description });
    setHomeworkId(homeworkId);
    setIsUpdateEvaluateVisible(true);
  };

  const handleBack = () => {
    navigate(`/my-groups/${groupId}/tasks`);
  };

  const hideModal = () => {
    setIsEvaluateVisible(false);
    setIsUpdateEvaluateVisible(false);
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
      width: 60,
      render: (text, record, index) => page * size + index + 1,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 200,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.firstName.startsWith(value),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: 200,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.lastName.startsWith(value),
    },
    {
      title: "Ball",
      key: "ball",
      width: 110,
      sorter: (a, b) => (a.ball || 0) - (b.ball || 0),
      render: (record) => (
        <Tooltip title={record.description}>
          <div
            style={{
              display: "inline-block",
              padding: "0.5vh 1.2vh 0.5vh 1.2vh",
              textAlign: "center",
              width: "6vh",
              height: "4.5vh",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#f0f0f0",
              color: "#333",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {record.ball ?? "N/A"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Attachment",
      key: "homeworkName",
      width: 200,
      render: (record) => {
        const fileSize = record.homeworkFileSize;
        const displaySize =
          fileSize < 1024
            ? `${fileSize} Bytes`
            : fileSize < 1024 * 1024
              ? `${(fileSize / 1024).toFixed(2)} KB`
              : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
        return record.homeworkFileName == null ? (
          <Button type="default" style={{ minWidth: "15vh" }} disabled>
            Not Uploaded
          </Button>
        ) : (
          <Tooltip title={record.homeworkFileName}>
            <Button
              type="primary"
              style={{ minWidth: "15vh", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => handleDownload(record.homeworkFileId, record.homeworkFileName)}
            >
              <DownloadOutlined /> {displaySize}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (record) => {
        const isPastDeadline = new Date(deadline) < new Date();
        if (record.homeworkFileName && !record.ball && !isPastDeadline) {
          return (
            <Button type="default" style={{minWidth: "15vh"}} onClick={() => handleEvaluate(record.homeworkId)}>
              Evaluate
            </Button>
          );
        }
        if (record.ball && record.homeworkFileName && !isPastDeadline) {
          return (
            <Button
              type="default"
              style={{minWidth: "15vh"}}
              onClick={() => handleChangeEvaluation(record.ball, record.description, record.homeworkId)}
            >
              Update
            </Button>
          );
        }
        return (
          <Button type="default" style={{minWidth: "15vh"}} disabled title={isPastDeadline ? "Deadline has passed" : "No submission"}>
            Evaluate
          </Button>
        );
      },
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Phone:</strong> {record.phone}
        <br />
        <strong>Email:</strong> {record.email}
      </p>
    ),
    rowExpandable: (record) => true,
  };

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Title level={2}>
        Task: {taskName}
      </Title>
      <Button
        type="dashed"
        onClick={handleBack}
        icon={<ArrowLeftOutlined />}
        style={{ marginTop: "2vh" }}
      >
        Orqaga
      </Button>
      </div>
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
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
        }}
        loading={loading}
        scroll={{ x: "max-content", y: 340 }}
        sticky
        title={() => <strong>Homework List</strong>}
        footer={() => `Total Homework: ${totalElements}`}
      />
      <EvaluateHomework
        isOpen={isEvaluateVisible}
        onClose={hideModal}
        onSuccess={handleSuccess}
        homeworkId={homeworkId}
        maxBall={maxBall}
      />
      <UpdateEvaluatedHomework
        isOpen={isUpdateEvaluateVisible}
        onClose={hideModal}
        onSuccess={handleSuccess}
        homework={homework}
        homeworkId={homeworkId}
        maxBall={maxBall}
      />
    </Fragment>
  );
};

export default TeacherHomeworkList;