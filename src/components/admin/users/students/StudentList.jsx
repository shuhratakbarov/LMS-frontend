import { Fragment, useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, EyeOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import AddStudentModal from "./AddStudent";
import ViewGroupsOfStudent from "./ViewGroupsOfStudent";
import UpdateStudentModal from "./UpdateStudent";
import DeleteStudentModal from "./DeleteStudent";
import { getStudentList } from "../../../../services/api-client";
import { formatDate } from "../../../../const/FormatDate";

const { Title } = Typography;
const StudentList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewGroupsModalVisible, setIsViewGroupsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [studentToViewGroups, setStudentToViewGroups] = useState({});
  const [studentToUpdate, setStudentToUpdate] = useState({});
  const [studentToDelete, setStudentToDelete] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentList(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setDataSource(data.content.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch students");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching students");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hideModal = () => {
    setIsAddModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsViewGroupsModalVisible(false);
  };

  const onSearch = (searchText) => {
    setSearchText(searchText);
    setPage(0);
  };

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const handleSuccess = () => {
    fetchData();
    hideModal();
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setStudentToUpdate(record);
    setIsUpdateModalVisible(true);
  };

  const handleDelete = (record) => {
    setStudentToDelete(record)
    setIsDeleteModalVisible(true);
  };

  const handleViewGroup = (record) => {
    setStudentToViewGroups(record);
    setIsViewGroupsModalVisible(true);
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
      width: 150,
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
      width: 150,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.lastName.startsWith(value),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
      sorter: (a, b) => a.username.localeCompare(b.username),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.username.startsWith(value),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      filters: [
        { text: "Starts with +998", value: "+998" },
        { text: "Starts with +1", value: "+1" },
      ],
      onFilter: (value, record) => record.phone.startsWith(value),
      render: (phone) => (
        <a href={`tel:${phone}`}>{phone}</a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      filters: [
        { text: "Gmail", value: "gmail.com" },
        { text: "Yahoo", value: "yahoo.com" },
      ],
      onFilter: (value, record) => record.email.includes(value),
      render: (email) => (
        <a
          href={`mailto:${email}`}
          onClick={(e) => {
            e.preventDefault(); // Prevent default if needed
            window.location.href = `mailto:${email}`;
          }}
        >
          {email}
        </a>
      ),
    },
    {
      title: "Activity",
      dataIndex: "active",
      key: "active",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "View  |  Edit  |   Delete",
      key: "action",
      width: 175,
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewGroup(record)}
            type="link"
            title="View groups"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            title="Edit"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="link"
            danger
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Address:</strong> {record.address}
        <br />
        <strong>Birth Date:</strong> {record.birthDate}
        <br />
        <strong>Added at:</strong> {formatDate(record.createdAt)}
        <br />
        <strong>Edited at:</strong> {formatDate(record.updatedAt)}
      </p>
    ),
    rowExpandable: (record) => record.username !== "No expandable content",
  };

  return (
    <Fragment>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title level={2}>Students</Title>
        <div style={{ display: "flex", gap: "2vh" }}>
          <Search
            placeholder="Search students..."
            onSearch={onSearch}
            enterButton
            style={{ width: "30vh" }}
          />
          <Button
            type="primary"
            onClick={handleAdd}
            icon={<UserAddOutlined />}
          >
            New Student
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
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Student List</strong>}
        footer={() => `Total Students: ${totalElements}`}
      />
      <AddStudentModal
        isOpen={isAddModalVisible}
        onSuccess={handleSuccess}
        hideModal={hideModal}
      />
      <ViewGroupsOfStudent
        isOpen={isViewGroupsModalVisible}
        student={studentToViewGroups}
        onClose={hideModal}
      />
      <UpdateStudentModal
        isOpen={isUpdateModalVisible}
        onSuccess={handleSuccess}
        onClose={hideModal}
        student={studentToUpdate}
      />
      <DeleteStudentModal
        isOpen={isDeleteModalVisible}
        onSuccess={handleSuccess}
        onClose={hideModal}
        student={studentToDelete}
      />
    </Fragment>
  );
};

export default StudentList;