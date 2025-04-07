import { useState, useEffect, useCallback } from "react";
import { Modal, Table, message } from "antd";
import { getGroupsOfStudent } from "../../../services/api-client";

const ViewGroupsOfStudent = ({ isOpen, student, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroupsOfStudent = useCallback(async () => {
    if (!student.id) return;
    setLoading(true);
    try {
      const response = await getGroupsOfStudent(student.id);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setData(data.map((item, index) => ({ ...item, key: index })));
      } else {
        message.error(errorMessage || "Failed to fetch groups");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while fetching groups");
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    if (isOpen) {
      fetchGroupsOfStudent();
    }
  }, [isOpen, fetchGroupsOfStudent]);

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
      sorter: (a, b) => a.groupName.localeCompare(b.groupName),
    },
    {
      title: "Teacher",
      dataIndex: "teacherName",
      key: "teacherName",
      sorter: (a, b) => a.teacherName.localeCompare(b.teacherName),
    },
  ];

  return (
    <Modal
      title={`${student.lastName} ${student.firstName}'s Groups`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        loading={loading}
        rowKey="key"
        scroll={{ x: "max-content" }}
      />
    </Modal>
  );
};

export default ViewGroupsOfStudent;