import { useState, useEffect, useCallback } from "react";
import { Table, message, Typography, Button, Space, Tooltip, Switch } from "antd";
import { getLessonSchedule } from "../../../../services/api-client";
import { AppstoreOutlined, DeleteOutlined, EditOutlined, PlusOutlined, TableOutlined } from "@ant-design/icons";
import CreateLessonScheduleModal from "./CreateLessonSchedule";
import UpdateLessonScheduleModal from "./UpdateLessonSchedule";
import DeleteLessonScheduleModal from "./DeleteLessonSchedule";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../../../const/SearchComponent";
import { formatDate } from "../../../../utils/FormatDate";

const { Title } = Typography;

const LessonScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [scheduleToUpdate, setScheduleToUpdate] = useState();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getLessonSchedule(searchQuery, currentPage, pageSize);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setSchedules(data.content);
        setTotalItems(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch lesson schedules");
      }
    } catch (error) {
      console.error("Error fetching lesson schedules:", error);
      message.error("Failed to load lesson schedules due to a network error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = (schedule) => {
    setScheduleToUpdate(schedule);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    fetchSchedules();
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setScheduleToUpdate(null);
    setScheduleToDelete(null);
  };

  const handleViewChange = (checked) => {
    if (checked) {
      navigate("/admin/lesson-schedules/time-table");
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => currentPage * pageSize + index + 1,
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
    },
    {
      title: "Room",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      sorter: (a, b) => a.day - b.day,
      render: (day) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return days[day - 1] || "Unknown";
      },
    },
    {
      title: "Time",
      key: "time",
      sorter: (a, b) => a.startTime - b.startTime,
      render: (_, record) => `${record.startTime.toString().padStart(2, '0')}:00 - ${record.endTime.toString().padStart(2, '0')}:00`,
    },
    {
      title: " Edit   |   Delete",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Created At:</strong> {formatDate(record.createdAt)}
        <br />
        <strong>Updated At:</strong> {formatDate(record.updatedAt)}
      </p>
    ),
    rowExpandable: (record) => record.description !== "No expandable content",
  };

  return (
    <div >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={2} style={{ marginBottom: 0, marginRight: 16 }}>Lesson Schedule</Title>
          <Tooltip title="Switch to Timetable View" >
            <Switch
              style={{marginTop : "4vh"}}
              checkedChildren={<AppstoreOutlined />}
              unCheckedChildren={<TableOutlined />}
              onChange={handleViewChange}
              defaultChecked={false}
            />
          </Tooltip>
        </div>
        <div>
          <SearchComponent placeholder={"Search lessons... (Press Ctrl+K)"} handleSearch={handleSearch}/>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ marginLeft: "16px" }}
          >
            New Lesson Schedule
          </Button>
        </div>
      </div>
      <Table
        dataSource={schedules}
        columns={columns}
        rowKey="id"
        expandable={expandableConfig}
        pagination={{
          current: currentPage + 1,
          pageSize,
          total: totalItems,
          onChange: handlePaginationChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          responsive: true,
        }}
        loading={isLoading}
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Lesson Schedule List</strong>}
        footer={() => `Total Schedules: ${totalItems}`}
      />
        <CreateLessonScheduleModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
        <UpdateLessonScheduleModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          schedule={scheduleToUpdate}
        />
        <DeleteLessonScheduleModal
          isOpen={isDeleteModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          schedule={scheduleToDelete}
        />
    </div>
  );
};

export default LessonScheduleList;