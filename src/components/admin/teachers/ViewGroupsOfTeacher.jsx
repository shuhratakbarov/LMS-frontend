import { useState, useEffect, useCallback } from "react";
import { Modal, Table, message } from "antd";
import { getGroupsOfTeacher } from "../../../services/api-client";

const ViewGroupsOfTeacher = ({ isOpen, onClose, teacher }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroupsOfTeacher = useCallback(async () => {
    if (!teacher.id) return;
    setLoading(true);
    try {
      const response = await getGroupsOfTeacher(teacher.id);
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
  }, [teacher.id]);

  useEffect(() => {
    if (isOpen) {
      fetchGroupsOfTeacher();
    }
  }, [isOpen, fetchGroupsOfTeacher]);

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Group Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Number of Students",
      dataIndex: "count",
      key: "count",
      sorter: (a, b) => a.count - b.count,
    },
  ];

  return (
    <Modal
      title={`${teacher.lastName} ${teacher.firstName}'s Groups`}
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

export default ViewGroupsOfTeacher;