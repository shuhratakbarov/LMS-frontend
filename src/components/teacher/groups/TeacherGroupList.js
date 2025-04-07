import { Fragment, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Typography, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { getTeacherGroups } from "../../../services/api-client";

const { Title } = Typography;

const TeacherGroupList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const onSearch = (searchText) => {
    setSearchText(searchText);
    setPage(0);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (text, record, index) => page * size + index + 1,
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.courseName.startsWith(value),
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.groupName.startsWith(value),
    },
    {
      title: "Number of Students",
      dataIndex: "studentCount",
      key: "studentCount",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.studentCount - b.studentCount,
      render: (record) => `${record} student${record === 1 ? "" : "s"}`,
    },
    {
      title: "Number of Tasks",
      dataIndex: "taskCount",
      key: "taskCount",
      width: 220,
      sorter: (a, b) => a.taskCount - b.taskCount,
      render: (record) => `${record} task${record === 1 ? "" : "s"}`,
    },
    {
      title: "Tasks",
      key: "action",
      render: (record) => (
        <Link to={`/my-groups/${record.id}/tasks`}>
          <Button
            disabled={record?.studentCount === 0}
            title={record?.studentCount === 0 ? "No students" : ""}
          >
            <ArrowRightOutlined /> Enter
          </Button>
        </Link>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Course Name:</strong> {record.courseName}
        <br />
        <strong>Group Name:</strong> {record.groupName}
        <br />
        <strong>Number of Students:</strong> {record.studentCount}
      </p>
    ),
    rowExpandable: (record) => record.username !== "No expandable content",
  };

  return (
    <Fragment>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2vh",
        }}
      >
        <Title level={2}>My Groups</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Search
            placeholder="Search groups..."
            onSearch={onSearch}
            enterButton
            style={{ width: "30vh", marginTop: "3vh" }}
          />
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
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Group List</strong>}
        footer={() => `Total Groups: ${totalElements}`}
      />
    </Fragment>
  );
};

export default TeacherGroupList;