import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message } from "antd";
import { ArrowLeftOutlined, UserDeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import AddStudentToGroupModal from "./AddStudentToGroupModal";
import RemoveStudentModal from "./RemoveStudentModal";
import { getGroupData } from "../../../services/api-client";

const ActionsInGroup = () => {
  const [groupData, setGroupData] = useState({ groupDetails: null, students: [] });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [isRemoveStudentModalVisible, setIsRemoveStudentModalVisible] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();

  const fetchGroupData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGroupData(groupId, page, size);
      console.log(response);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setGroupData({
          groupDetails: data.group,
          students: data.page.content
        });
        setTotalElements(data.page.totalElements); // PageData
      } else {
        message.error(errorMessage || "Failed to fetch group data");
        navigate("/groups");
      }
    } catch (error) {
      message.error("Failed to load group data: " + error.message);
      navigate("/groups");
    } finally {
      setLoading(false);
    }
  }, [groupId, page, size, navigate]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const handleAddStudent = () => {
    setIsAddStudentModalVisible(true);
  };

  const handleRemoveStudent = (student) => {
    setStudentToRemove(student);
    setIsRemoveStudentModalVisible(true);
  };

  const hideModal = () => {
    setIsAddStudentModalVisible(false);
    setIsRemoveStudentModalVisible(false);
    setStudentToRemove(null);
    setStudentToRemove(null);
  };

  const handleSuccess = () => {
    fetchGroupData();
    hideModal();
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => page * size + index + 1
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" }
      ],
      onFilter: (value, record) => record.firstName.startsWith(value)
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" }
      ],
      onFilter: (value, record) => record.lastName.startsWith(value)
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      filters: [
        { text: "Starts with A", value: "A" },
        { text: "Starts with B", value: "B" }
      ],
      onFilter: (value, record) => record.username.startsWith(value)
    },
    {
      title: "Remove",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            icon={<UserDeleteOutlined />}
            onClick={() => handleRemoveStudent(record)}
            type="link"
            danger
          />
        </Space>
      )
    }
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <strong>Username:</strong> {record.username}
        <br />
        <strong>First Name:</strong> {record.firstName}
        <br />
        <strong>Last Name:</strong> {record.lastName}
      </p>
    ),
    rowExpandable: (record) => record.username !== "No expandable content"
  };

  return (
    <div>
      <h2>
        Group: {groupData.groupDetails?.name}
        <Button
          type="dashed"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/groups")}
          style={{ float: "right", marginBottom: "5px" }}
        >
          Back
        </Button>
      </h2>
      <Table
        dataSource={groupData.students}
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
          responsive: true
        }}
        loading={loading}
        scroll={{ x: "max-content", y: 325 }}
        sticky
        title={() => <strong>Student List</strong>}
        footer={() => `Total Students: ${totalElements}`}
      />
      <Button
        type="primary"
        onClick={handleAddStudent}
        icon={<UserAddOutlined />}
      >
        New Student
      </Button>
      {isAddStudentModalVisible && (
        <AddStudentToGroupModal
          isOpen={isAddStudentModalVisible}
          onSuccess={handleSuccess}
          onClose={hideModal}
          groupId={groupId}
        />
      )}
      {isRemoveStudentModalVisible && (
        <RemoveStudentModal
          isOpen={isRemoveStudentModalVisible}
          onSuccess={handleSuccess}
          onClose={hideModal}
          student={studentToRemove}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default ActionsInGroup;