import styles from "./TimetableView.module.css";
import { useState, useEffect } from "react";
import { Select, Spin, message, Switch, Tooltip, Dropdown } from "antd";
import { getLessonSchedule, getRoomIdAndName } from "../../../../services/api-client";
import { useNavigate } from "react-router-dom";
import { AppstoreOutlined, DeleteOutlined, EditOutlined, TableOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import DeleteLessonScheduleModal from "../list-view/DeleteLessonSchedule";
import UpdateLessonScheduleModal from "../list-view/UpdateLessonSchedule";
import CreateLessonScheduleModal from "../list-view/CreateLessonSchedule";

const { Option } = Select;

const TimetableView = () => {
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 7 : new Date().getDay());
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newScheduleData, setNewScheduleData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [scheduleToUpdate, setScheduleToUpdate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const navigate = useNavigate();

  const timeSlots = Array.from({ length: 16 }, (_, i) => 8 + i); // 08:00 to 23:00

  const fetchRoomsAndSchedules = async () => {
    setLoading(true);
    try {
      const roomsResponse = await getRoomIdAndName();
      const schedulesResponse = await getLessonSchedule("", 0n, 1000);
      if (roomsResponse.data.success) {
        setRooms(roomsResponse.data.data);
      } else {
        message.error("Failed to fetch rooms");
      }
      if (schedulesResponse.data.success) {
        setSchedules(schedulesResponse.data.data.content);
      } else {
        message.error("Failed to fetch schedules");
      }
    } catch (error) {
      message.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndSchedules();
  }, []);

  const handleViewChange = (checked) => {
    if (!checked) {
      navigate("/admin/lesson-schedules");
    }
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
    fetchRoomsAndSchedules();
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsCreateModalOpen(false);
    setScheduleToUpdate(null);
    setScheduleToDelete(null);
    setNewScheduleData(null);
  };

  // Build a schedule map for efficient lookup
  const getScheduleMatrix = () => {
    const matrix = {};

    if (!Array.isArray(schedules)) {
      return matrix;
    }

    schedules.forEach(schedule => {
      if (schedule.day === selectedDay) {
        const key = `${schedule.roomId}-${schedule.startTime}`;
        matrix[key] = schedule;
      }
    });

    return matrix;
  };

  const getScheduleColor = (identifier) => {
    const colors = [
      "#ff4d4f", // Red (original)
      "#1890ff", // Blue
      "#52c41a", // Green
      "#722ed1", // Purple
      "#fa8c16", // Orange
      "#eb2f96", // Pink
      "#13c2c2", // Cyan
      "#faad14", // Gold
    ];

    // Simple hash function to get consistent colors for the same group/id
    const hash = Array.from(identifier.toString()).reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );

    return colors[hash % colors.length];
  };

  // const handleScheduleClick = (schedule) => {
  //   // You can show details, modal, or navigate to schedule details page
  //   // message.info(`Clicked on ${schedule.groupName}`);
  // };

  const handleEmptyCellClick = (roomId, roomName, time) => {
    // Prepare initial data for the new schedule
    setNewScheduleData({
      roomId: roomId,
      roomName: roomName,
      day: selectedDay,
      startTime: time,
      endTime: time + 1 // Default to 1 hour duration
    });

    // Open the create modal
    setIsCreateModalOpen(true);
  };

  const scheduleMatrix = getScheduleMatrix();

  // Calculate how many rooms we have to set equal column width
  const columnWidth = rooms.length > 0 ? `${Math.floor(100 / rooms.length)}%` : "auto";

  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={2} style={{ marginBottom: 0, marginRight: 16 }}>Lesson Schedule</Title>
          <Tooltip title="Switch to List View">
            <Switch
              style={{marginTop : "4vh"}}
              checkedChildren={<AppstoreOutlined />}
              unCheckedChildren={<TableOutlined />}
              onChange={handleViewChange}
              defaultChecked={true}
            />
          </Tooltip>
        </div>
        <div>
          <Select
            value={selectedDay}
            onChange={(value) => setSelectedDay(value)}
            style={{ width: 120 }}
          >
            <Option value={1}>Monday</Option>
            <Option value={2}>Tuesday</Option>
            <Option value={3}>Wednesday</Option>
            <Option value={4}>Thursday</Option>
            <Option value={5}>Friday</Option>
            <Option value={6}>Saturday</Option>
            <Option value={7}>Sunday</Option>
          </Select>
        </div>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div style={{
          overflowX: "auto",
          width: "100%",
          whiteSpace: "nowrap" // Prevents table from wrapping
        }}>
          <div style={{
            minWidth: `${Math.max(800, rooms.length * 150)}px` // Force minimum width
          }}>
          <table className={styles.table} style={{
            width: `${Math.max(800, rooms.length * 120 + 60)}px` // Ensure table is wide enough
          }}>
            <colgroup>
              <col style={{ width: "60px" }} /> {/* Time column with fixed width */}
              {rooms.map((room) => (
                <col key={`col-${room.id}`} style={{ width: columnWidth }} />
              ))}
            </colgroup>
            <thead>
            <tr>
              <th className={styles.th} style={{ width: "60px" }}>

              </th>
              {rooms.map((room) => (
                <th
                  key={room.id}
                  className={styles.th}
                >
                  {room.name}
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td
                  className={styles.td}
                  style={{
                    textAlign: "center",
                    verticalAlign: "top",
                    padding: "8px",
                  }}
                >
                  {`${time.toString().padStart(2, "0")}:00`}
                </td>
                {rooms.map((room) => {
                  const scheduleKey = `${room.id}-${time}`;
                  const schedule = scheduleMatrix[scheduleKey];

                  // If this is a cell where a schedule starts
                  if (schedule) {
                    const duration = schedule.endTime - schedule.startTime;
                    const scheduleItems = [
                      {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Edit',
                        onClick: () => handleUpdate(schedule)
                      },
                      {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: 'Delete',
                        danger: true,
                        onClick: () => handleDelete(schedule)
                      }
                    ];

                    return (
                      <td
                        key={`${room.id}-${time}`}
                        className={styles.td}
                        rowSpan={duration}
                        style={{ width: columnWidth }}
                      >
                        <Dropdown
                          menu={{ items: scheduleItems }}
                          trigger={['click']}
                          placement="bottomLeft"
                        >
                          <div
                            className={styles.lessonCell}
                            style={{
                              backgroundColor: getScheduleColor(schedule.groupName || schedule.id),
                            }}
                          >
                            {schedule.groupName}
                          </div>
                        </Dropdown>
                      </td>
                    );

                  }

                  // If this cell is part of a multi-hour schedule, don't render it
                  const isPartOfMultiHourSchedule = Array.isArray(schedules) && schedules.some(
                    (s) =>
                      s.roomId === room.id &&
                      s.day === selectedDay &&
                      time > s.startTime &&
                      time < s.endTime
                  );

                  if (isPartOfMultiHourSchedule) {
                    return null;
                  }

                  // Otherwise, render an empty cell
                  return (
                    <td
                      key={`${room.id}-${time}`}
                      className={styles.td}
                      onClick={() => handleEmptyCellClick(room.id, room.name, time)}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <div className={styles.emptyCell}>
                        <span className={styles.plusIcon}>+</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      <CreateLessonScheduleModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        schedule={newScheduleData}
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

export default TimetableView;