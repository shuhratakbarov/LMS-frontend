import { useState, useEffect } from "react";
import { Spin, message, Typography, Row, Col } from "antd";
import styles from "./StudentLessons.module.css";
import { getStudentLessons } from "../../../services/api-client";
import { BookOutlined } from "@ant-design/icons";
import SearchComponent from "../../const/SearchComponent";

const { Title, Text } = Typography;

const StudentLessons = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // Display time slots from 8:00 to 23:00 to accommodate all lessons
  const timeSlots = Array.from({ length: 16 }, (_, i) => 8 + i);

  const fetchTeacherSchedules = async () => {
    setLoading(true);
    try {
      const response = await getStudentLessons();
      if (response.data.success) {
        // Filter out lessons that are outside our display time range (8:00-23:00)
        const filteredSchedules = response.data.data.filter(
          schedule => {
            // Only include lessons that overlap with our display time range
            return schedule.startTime < 24 && schedule.endTime > 8;
          }
        );
        setSchedules(filteredSchedules);
      } else {
        message.error("Failed to fetch lesson schedules");
      }
    } catch (error) {
      message.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherSchedules();
  }, []);

  // Fixed schedule lookup function to handle lessons that might extend beyond display hours
  const getScheduleForDayAndTime = (day, time) => {
    if (!Array.isArray(schedules)) return null;

    return schedules.find(
      (s) => s.day === day && time >= s.startTime && time < s.endTime
    );
  };

  const getScheduleColor = (identifier) => {
    if (!identifier) return "#1890ff";
    const colors = [
      "#ff4d4f", // Red
      "#1890ff", // Blue
      "#52c41a", // Green
      "#722ed1", // Purple
      "#fa8c16", // Orange
      "#eb2f96", // Pink
      "#13c2c2", // Cyan
      "#faad14", // Gold
    ];

    const hash = Array.from(identifier.toString()).reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    return colors[hash % colors.length];
  };

  // Debugging function to check if we have any schedules
  const hasSchedules = Array.isArray(schedules) && schedules.length > 0;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e90ff, #4169e1, #0000cd)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          width: '100%'
        }}>
          <Row justify="start" align="middle">
            <Col>
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                <BookOutlined style={{ marginRight: 12 }} />
                My Lesson Schedule
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                View your upcoming classes and timetable
              </Text>
            </Col>
          </Row>
        </div>
        <div>
          {!hasSchedules && !loading && (
            <span style={{ marginLeft: "10px", color: "#ff4d4f" }}>
              No schedules found
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.timetableContainer}>
          <table className={styles.timetable}>
            <thead>
            <tr>
              <th className={styles.timeHeader}>Time\Day</th>
              {days.map((day, index) => (
                index === new Date().getDay() ?
                <th key={index} className={styles.dayHeader} style={{color: "#1677ff"}}>
                  {day}
                </th> :
                  <th key={index} className={styles.dayHeader}>
                    {day}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className={styles.timeCell}>
                  {`${time.toString().padStart(2, "0")}:00`}
                </td>
                {days.map((day, dayIndex) => {
                  // Convert index to day number where Monday is 1, Tuesday is 2, etc.
                  const dayNumber = dayIndex + 1;
                  const schedule = getScheduleForDayAndTime(dayNumber, time);

                  if (schedule) {
                    const isStartTime = schedule.startTime === time;

                    // Only render a cell at the start time of a schedule
                    if (isStartTime) {
                      // Make sure we don't extend beyond our displayed time slots
                      const maxEndTime = Math.min(schedule.endTime, 24);
                      const duration = maxEndTime - schedule.startTime;

                      // Only display if the lesson has positive duration
                      if (duration > 0) {
                        return (
                          <td
                            key={dayNumber}
                            className={styles.lessonCell}
                            rowSpan={duration}
                            title={`${schedule.groupName} - Room: ${schedule.roomName}`}
                          >
                            <div
                              style={{
                                backgroundColor: getScheduleColor(schedule.groupName || schedule.id),
                                height: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                color: "white",
                                overflow: "hidden"
                              }}
                            >
                              <div className={styles.timeRange}>
                                {schedule.startTime}:00 - {schedule.endTime}:00
                              </div>
                              <div className={styles.roomName}>{schedule.roomName}</div>
                              <div className={styles.groupName}>{schedule.courseName} - {schedule.groupName}</div>
                            </div>
                          </td>
                        );
                      }
                    }

                    // For hours that are part of a multi-hour schedule but not the start,
                    // return null to let the rowSpan handle the display
                    return null;
                  }

                  return (
                    <td
                      key={dayNumber}
                      className={styles.emptyCell}
                      style={dayIndex === new Date().getDay() ? { backgroundColor: "#d4e9fa" } : {}}
                    ></td>
                  );

                })}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentLessons;