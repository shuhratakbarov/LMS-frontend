import { useState, useEffect, useCallback } from "react";
import { Button, Space, Table, message, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import CreateRoomModal from "./CreateRoom";
import UpdateRoomModal from "./UpdateRoom";
import DeleteRoomModal from "./DeleteRoom";
import { getRoomList } from "../../../services/api-client";
import Search from "antd/es/input/Search";

const { Title } = Typography;

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRoomList();
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setRooms(data);
        setTotalItems(data.length);
      } else {
        message.error(errorMessage || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Failed to load rooms due to a network error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSearch = (value) => {
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = (room) => {
    setRoomToUpdate(room);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id, name) => {
    setRoomToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setRoomToUpdate(null);
    setRoomToDelete({ id: null, name: "" });
  };

  const handleSuccess = () => {
    fetchRooms();
    handleModalClose();
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => currentPage * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: [
        { text: "Name starts with A", value: "A" },
        { text: "Name starts with B", value: "B" },
      ],
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
            onClick={() => handleDelete(record.id, record.name)}
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
        <strong>Description:</strong> {record.description || "No description"}
      </p>
    ),
    rowExpandable: (record) => true,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Rooms</Title>
        <div>
          <Search
            placeholder="Search rooms..."
            onSearch={handleSearch}
            enterButton
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ marginLeft: "16px" }}
          >
            New Room
          </Button>
        </div>
      </div>
      <Table
        dataSource={rooms}
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
        title={() => <strong>Room List</strong>}
        footer={() => `Total Rooms: ${totalItems}`}
      />
        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
        <UpdateRoomModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          room={roomToUpdate}
        />
        <DeleteRoomModal
          isOpen={isDeleteModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          room={roomToDelete}
        />
    </div>
  );
};

export default RoomList;