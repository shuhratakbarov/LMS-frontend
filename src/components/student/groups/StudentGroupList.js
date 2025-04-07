import { Fragment, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, message, Space, Table, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { getStudentSubjectList } from "../../../services/api-client";

const { Title } = Typography;

const StudentGroupList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentSubjectList(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;

      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch groups");
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

  const onSearch = (value) => {
    setSearchText(value);
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
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.groupName.startsWith(value),
    },
    {
      title: "Teacher",
      dataIndex: "teacherName",
      key: "teacherName",
      sorter: (a, b) => a.teacherName.localeCompare(b.teacherName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.teacherName.startsWith(value),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Link to={`/my-subjects/${record.id}/tasks`} state={{ record }}>
            <Button>
              <ArrowRightOutlined /> Tasks
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Teacher:</strong> {record.teacherName}
        <br />
        <strong>Group:</strong> {record.groupName}
        <br />
        <strong>Course:</strong> {record.courseName}
      </p>
    ),
    rowExpandable: (record) => true,
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={2}>My Subjects</Title>
        <Search
          placeholder="Search groups..."
          onSearch={onSearch}
          enterButton
          style={{ width: "30vh" }}
        />
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
        title={() => <strong>Subject List</strong>}
        footer={() => `Total Groups: ${totalElements}`}
      />
    </Fragment>
  );
};

export default StudentGroupList;