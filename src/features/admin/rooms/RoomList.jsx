import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Space,
  Table,
  message,
  Typography,
  Card,
  Tag,
  Drawer,
  Descriptions,
  Badge,
  Row,
  Col,
  Statistic,
  Modal,
  Empty,
  Alert
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, VideoCameraOutlined, EnvironmentOutlined, TeamOutlined, DashboardOutlined, FullscreenOutlined } from "@ant-design/icons";
import CreateRoomModal from "./CreateRoom";
import UpdateRoomModal from "./UpdateRoom";
import DeleteRoomModal from "./DeleteRoom";
import { getRoomList } from "../../../services/api-client";
import SearchComponent from "../../const/SearchComponent";

const { Title, Text } = Typography;

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [selectedRoomCamera, setSelectedRoomCamera] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRoomList();
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        // Add simulated camera and occupancy data
        const roomsWithData = data.map((room) => ({
          ...room,
          capacity: room.capacity || Math.floor(Math.random() * 50) + 20, // Random capacity if not provided
          currentOccupancy: Math.floor(Math.random() * 30), // Simulated occupancy
          hasCamera: true, // All rooms have cameras for demo
          cameraStatus: Math.random() > 0.1 ? "online" : "offline", // 90% online
          floor: room.floor || Math.floor(Math.random() * 5) + 1,
          building: room.building || "Main Building"
        }));
        setRooms(roomsWithData);
        setTotalItems(roomsWithData.length);
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
    setSearchQuery(value);
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

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setDrawerVisible(true);
  };

  const handleViewCamera = (room) => {
    setSelectedRoomCamera(room);
    setCameraModalVisible(true);
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

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => currentPage * pageSize + index + 1,
      responsive: ["sm"],
    },
    {
      title: "Room",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
      render: (text, record) => (
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>
              <EnvironmentOutlined style={{ marginRight: 6, color: "#1890ff" }} />
              {text}
            </Text>
            {!isMobile && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.building} - Floor {record.floor}
                </Text>
            )}
          </Space>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
      sorter: (a, b) => a.capacity - b.capacity,
      render: (capacity, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.currentOccupancy}/{capacity}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {Math.round((record.currentOccupancy / capacity) * 100)}% full
            </Text>
          </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Camera",
      dataIndex: "cameraStatus",
      key: "cameraStatus",
      width: 100,
      render: (status, record) => (
          <Badge
              status={status === "online" ? "success" : "error"}
              text={
                <Button
                    type="link"
                    size="small"
                    icon={<VideoCameraOutlined />}
                    onClick={() => handleViewCamera(record)}
                    disabled={status === "offline"}
                    style={{ padding: 0 }}
                >
                  {status === "online" ? "View" : "Offline"}
                </Button>
              }
          />
      ),
      responsive: ["lg"],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      responsive: ["xl"],
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 120 : 140,
      fixed: isMobile ? "right" : undefined,
      render: (record) => (
          <Space size="small">
            {isMobile && (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                    type="text"
                    size="small"
                />
            )}
            <Button
                icon={<VideoCameraOutlined />}
                onClick={() => handleViewCamera(record)}
                type="text"
                size="small"
                disabled={record.cameraStatus === "offline"}
                title="View Camera"
            />
            <Button
                icon={<EditOutlined />}
                onClick={() => handleUpdate(record)}
                type="text"
                size="small"
            />
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id, record.name)}
                type="text"
                danger
                size="small"
            />
          </Space>
      ),
    },
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{ padding: isMobile ? "8px" : "12px" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text strong>Description: </Text>
              <Text>{record.description || "No description available"}</Text>
            </div>
            <div>
              <Text strong>Location: </Text>
              <Text>{record.building}, Floor {record.floor}</Text>
            </div>
            <div>
              <Text strong>Occupancy: </Text>
              <Text>{record.currentOccupancy} / {record.capacity} ({Math.round((record.currentOccupancy / record.capacity) * 100)}% full)</Text>
            </div>
          </Space>
        </div>
    ),
    rowExpandable: (record) => !isMobile,
  };

  // Mobile Card View
  const MobileCardView = () => (
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {filteredRooms.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((room, index) => (
            <Card
                key={room.id}
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${room.cameraStatus === "online" ? "#52c41a" : "#ff4d4f"}`,
                }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      #{currentPage * pageSize + index + 1}
                    </Text>
                    <Title level={5} style={{ margin: "4px 0 8px 0", fontSize: 15 }}>
                      <EnvironmentOutlined style={{ marginRight: 6, color: "#1890ff" }} />
                      {room.name}
                    </Title>
                  </div>
                  <Badge
                      status={room.cameraStatus === "online" ? "success" : "error"}
                      text={room.cameraStatus}
                  />
                </div>

                <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12 }}>
                      <TeamOutlined style={{ color: "#1890ff", marginRight: 4 }} />
                      Occupancy: <Text strong>{room.currentOccupancy}/{room.capacity}</Text>
                    </Text>
                    <Tag color={room.currentOccupancy / room.capacity > 0.8 ? "red" : "green"}>
                      {Math.round((room.currentOccupancy / room.capacity) * 100)}% full
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    <EnvironmentOutlined /> {room.building}, Floor {room.floor}
                  </Text>
                </Space>

                {room.description && (
                    <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          display: "block",
                          marginBottom: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          // display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                    >
                      {room.description}
                    </Text>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Button
                    icon={<VideoCameraOutlined />}
                    onClick={() => handleViewCamera(room)}
                    type="primary"
                    size="small"
                    disabled={room.cameraStatus === "offline"}
                    style={{ flex: "1 1 auto" }}
                >
                  Camera
                </Button>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(room)}
                    size="small"
                    style={{ flex: "1 1 auto" }}
                >
                  Details
                </Button>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => handleUpdate(room)}
                    size="small"
                />
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(room.id, room.name)}
                    danger
                    size="small"
                />
              </div>
            </Card>
        ))}
      </Space>
  );

  // Camera View Modal
  const CameraViewModal = () => (
      <Modal
          title={
            <Space>
              <VideoCameraOutlined style={{ color: "#52c41a" }} />
              <span>Live Camera Feed - {selectedRoomCamera?.name}</span>
            </Space>
          }
          open={cameraModalVisible}
          onCancel={() => setCameraModalVisible(false)}
          width={isMobile ? "95%" : 900}
          footer={[
            <Button key="fullscreen" icon={<FullscreenOutlined />}>
              Fullscreen
            </Button>,
            <Button key="close" onClick={() => setCameraModalVisible(false)}>
              Close
            </Button>,
          ]}
          centered
      >
        {selectedRoomCamera && (
            <div>
              {/* Camera Feed Placeholder */}
              <div
                  style={{
                    background: "#000",
                    aspectRatio: "16/9",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    marginBottom: 16,
                  }}
              >
                {/* Simulated Camera Feed */}
                <div style={{ textAlign: "center", color: "white" }}>
                  <VideoCameraOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                  <Text style={{ color: "white", display: "block" }}>
                    Live Camera Feed
                  </Text>
                  <Text style={{ color: "#52c41a", display: "block", fontSize: 12 }}>
                    ● Recording • HD Quality
                  </Text>
                </div>

                {/* Timestamp Overlay */}
                <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "rgba(0,0,0,0.7)",
                      padding: "4px 12px",
                      borderRadius: 4,
                    }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {new Date().toLocaleString()}
                  </Text>
                </div>

                {/* Room Info Overlay */}
                <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "rgba(0,0,0,0.7)",
                      padding: "4px 12px",
                      borderRadius: 4,
                    }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    <TeamOutlined /> {selectedRoomCamera.currentOccupancy}/{selectedRoomCamera.capacity}
                  </Text>
                </div>
              </div>

              {/* Room Statistics */}
              <Row gutter={[12, 12]}>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                        title="Capacity"
                        value={selectedRoomCamera.capacity}
                        prefix={<TeamOutlined />}
                        valueStyle={{ fontSize: isMobile ? 18 : 20 }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                        title="Current"
                        value={selectedRoomCamera.currentOccupancy}
                        valueStyle={{ fontSize: isMobile ? 18 : 20, color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                        title="Occupancy"
                        value={Math.round((selectedRoomCamera.currentOccupancy / selectedRoomCamera.capacity) * 100)}
                        suffix="%"
                        valueStyle={{
                          fontSize: isMobile ? 18 : 20,
                          color: selectedRoomCamera.currentOccupancy / selectedRoomCamera.capacity > 0.8 ? "#ff4d4f" : "#52c41a"
                        }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small">
                    <Statistic
                        title="Status"
                        value={selectedRoomCamera.cameraStatus}
                        valueStyle={{ fontSize: isMobile ? 14 : 16, color: "#52c41a" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Additional Info */}
              <Card size="small" style={{ marginTop: 12 }}>
                <Descriptions column={isMobile ? 1 : 2} size="small">
                  <Descriptions.Item label="Location">
                    {selectedRoomCamera.building}, Floor {selectedRoomCamera.floor}
                  </Descriptions.Item>
                  <Descriptions.Item label="Camera ID">
                    CAM-{selectedRoomCamera.id}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Alert
                  message="Camera Integration"
                  description="This is a simulated camera feed. To integrate real cameras, connect to your IP camera system or CCTV network through the backend API."
                  type="info"
                  showIcon
                  style={{ marginTop: 12 }}
              />
            </div>
        )}
      </Modal>
  );

  return (
      <div style={{ padding: isMobile ? "4px" : 0 }}>
        {/* Header */}
        <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              marginBottom: isMobile ? 16 : 20,
              gap: isMobile ? 12 : 0,
            }}
        >
          <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
            🏢 Rooms & Monitoring
          </Title>
          <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 8 : 12,
                alignItems: "stretch",
              }}
          >
            <SearchComponent
                placeholder={isMobile ? "Search..." : "Search rooms... (Ctrl+K)"}
                handleSearch={handleSearch}
            />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                block={isMobile}
                size={isMobile ? "middle" : "default"}
            >
              New Room
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: isMobile ? 16 : 20 }}>
          <Col xs={12} sm={8} md={6}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Total Rooms"
                  value={totalItems}
                  prefix={<DashboardOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Cameras Online"
                  value={rooms.filter(r => r.cameraStatus === "online").length}
                  prefix={<VideoCameraOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Total Capacity"
                  value={rooms.reduce((sum, r) => sum + r.capacity, 0)}
                  prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
                  valueStyle={{ color: "#722ed1", fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small" style={{ textAlign: "center", borderRadius: 8 }}>
              <Statistic
                  title="Current Occupancy"
                  value={rooms.reduce((sum, r) => sum + r.currentOccupancy, 0)}
                  valueStyle={{ fontSize: isMobile ? 20 : 24 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table or Card View */}
        {isMobile ? (
            <>
              {isLoading ? (
                  <Card loading={true} />
              ) : filteredRooms.length === 0 ? (
                  <Card>
                    <Empty description="No rooms found" />
                  </Card>
              ) : (
                  <MobileCardView />
              )}

              {/* Mobile Pagination */}
              <Card
                  size="small"
                  style={{ marginTop: 16, textAlign: "center" }}
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Page {currentPage + 1} of {Math.ceil(filteredRooms.length / pageSize)}
                  </Text>
                  <Space size="small">
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage)}
                        disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handlePaginationChange(currentPage + 2)}
                        disabled={(currentPage + 1) * pageSize >= filteredRooms.length}
                    >
                      Next
                    </Button>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Total: {filteredRooms.length} rooms
                  </Text>
                </Space>
              </Card>
            </>
        ) : (
            <Table
                dataSource={filteredRooms}
                columns={columns}
                rowKey="id"
                expandable={expandableConfig}
                pagination={{
                  current: currentPage + 1,
                  pageSize,
                  total: filteredRooms.length,
                  onChange: handlePaginationChange,
                  onShowSizeChange: handlePageSizeChange,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50", "100"],
                  showQuickJumper: !isTablet,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  responsive: true,
                  size: isTablet ? "small" : "default",
                }}
                loading={isLoading}
                scroll={{ x: isTablet ? 800 : "max-content", y: 350 }}
                sticky
                size={isTablet ? "small" : "middle"}
            />
        )}

        {/* Room Details Drawer */}
        <Drawer
            title="Room Details"
            placement="bottom"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            height="70vh"
        >
          {selectedRoom && (
              <>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Name">
                    <Text strong>{selectedRoom.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {selectedRoom.building}, Floor {selectedRoom.floor}
                  </Descriptions.Item>
                  <Descriptions.Item label="Capacity">
                    <Space>
                      <Text strong>{selectedRoom.capacity} people</Text>
                      <Tag color={selectedRoom.currentOccupancy / selectedRoom.capacity > 0.8 ? "red" : "green"}>
                        {selectedRoom.currentOccupancy} current
                      </Tag>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Camera Status">
                    <Badge
                        status={selectedRoom.cameraStatus === "online" ? "success" : "error"}
                        text={selectedRoom.cameraStatus}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedRoom.description || "No description available"}
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button
                      icon={<VideoCameraOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleViewCamera(selectedRoom);
                      }}
                      type="primary"
                      size="large"
                      block
                      disabled={selectedRoom.cameraStatus === "offline"}
                  >
                    View Camera Feed
                  </Button>
                  <Space style={{ width: "100%" }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleUpdate(selectedRoom);
                        }}
                        style={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setDrawerVisible(false);
                          handleDelete(selectedRoom.id, selectedRoom.name);
                        }}
                        danger
                        style={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              </>
          )}
        </Drawer>

        {/* Camera View Modal */}
        <CameraViewModal />

        {/* Modals */}
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