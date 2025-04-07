import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Space, Table, Tooltip, message, Typography } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { download, getTeacherTaskList } from "../../../../services/api-client";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

const { Title } = Typography;

const TeacherTaskList = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [taskToEdit, setTaskToEdit] = useState({});
  const [taskToDelete, setTaskToDelete] = useState({});
  const [groupName, setGroupName] = useState("");
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
  const [isDeleteTaskVisible, setIsDeleteTaskVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTeacherTaskList(groupId);
      const { data } = response.data;
      setGroupName(data[0]?.groupName || "Unknown Group");
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
  const handleBack = () => navigate("/my-groups");
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

  const columns = [
    { title: "No", dataIndex: "index", key: "index", render: (text, record, index) => page * size + index + 1, },
    { title: "Name", dataIndex: "taskName", key: "taskName", width: 150 },
    { title: "Deadline", dataIndex: "deadline", key: "deadline" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Max Ball",
      key: "maxBall",
      width: 110,
      sorter: (a, b) => a.maxBall - b.maxBall,
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
            {record.maxBall ?? "N/A"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Attachment",
      key: "fileName",
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
              style={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => handleDownload(record.pkey, record.fileName)}
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
      width: 100,
      render: (record) => (
        <Space size="small" style={{marginLeft: "-3vh"}}>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined style={{fontSize: "large"}} />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined style={{fontSize: "large"}} />
          </Button>
        </Space>
      ),
    },
    {
      title: "Homework",
      key: "homework",
      render: (record) => (
        <Link to={`/my-groups/${groupId}/tasks/${record.id}/homework`} state={{ record }}>
          <Button>
            <ArrowRightOutlined /> Enter
          </Button>
        </Link>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Created At:</strong> {record.createdAt}
        <br />
        <strong>Updated At:</strong> {record.updatedAt}
      </p>
    ),
    rowExpandable: (record) => true,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Title level={2}>
        Group: {groupName}
      </Title>
      <div style={{marginTop: "2vh"}}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask} style={{ marginRight: "3vh" }}>
          New Task
        </Button>
        <Button
          type="dashed"
          onClick={handleBack}
          icon={<ArrowLeftOutlined />}
        >
          Orqaga
        </Button>
      </div>
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
        title={() => <strong>Task List</strong>}
        footer={() => `Total Tasks: ${totalElements}`}
      />
      <CreateTask isOpen={isAddTaskVisible} onSuccess={handleSuccess} onClose={hideModal} groupId={groupId} />
      <EditTask isOpen={isEditTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToEdit} />
      <DeleteTask isOpen={isDeleteTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToDelete} />
    </div>
  );
};

export default TeacherTaskList;