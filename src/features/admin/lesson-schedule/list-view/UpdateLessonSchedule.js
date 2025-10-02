import { useCallback, useState, useEffect } from "react";
import { Modal, Form, Button, message, Select, InputNumber, Col, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  checkScheduleConflict,
  getGroupIdAndName,
  getRoomIdAndName,
  updateLessonSchedule
} from "../../../../services/api-client";

const { Option } = Select;

const UpdateLessonScheduleModal = ({ isOpen, onClose, onSuccess, schedule }) => {
  const [form] = Form.useForm();
  const [groupOptions, setGroupOptions] = useState([]);
  const [fetchingGroups, setFetchingGroups] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");

  useEffect(() => {
    if (schedule) {
      setGroupOptions([
        <Option key={schedule.groupId} value={schedule.groupId}>
          {schedule.groupName}
        </Option>,
      ]);
      setRoomOptions([
        <Option key={schedule.roomId} value={schedule.roomId}>
          {schedule.roomName}
        </Option>,
      ]);

      form.setFieldsValue({
        groupId: schedule.groupId, // Send ID to backend
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        roomId: schedule.roomId, // Send ID to backend
      });
    }
  }, [schedule, form]);

  const fetchGroups = useCallback(async () => {
    if (groupOptions.length > 1) return;
    try {
      setFetchingGroups(true);
      const response = await getGroupIdAndName();
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        const mappedOptions = data.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>
        ));
        setGroupOptions(mappedOptions);
      } else {
        message.error(errorMessage || "Failed to fetch groups");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while fetching groups");
    } finally {
      setFetchingGroups(false);
    }
  }, [groupOptions.length]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRoomIdAndName();
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setRoomOptions(data.map(item => (
          <Option key={item.id} value={item.id}>{item.name}</Option>
        )));
      } else {
        message.error(errorMessage || "Failed to fetch rooms");
      }
    } catch (error) {
      message.error("Error fetching rooms: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkConflict = async (values) => {
    try {
      const response = await checkScheduleConflict(schedule.id, values);
      const { success, message: responseMessage } = response.data;
      if (success) {
        setHasConflict(false);
        setConflictMessage("");
      } else {
        setHasConflict(true);
        setConflictMessage(responseMessage);
        message.error(responseMessage);
      }
    } catch (error) {
      setHasConflict(true);
      setConflictMessage(error.response?.data?.message || "Error checking conflict");
      message.error(error.response?.data?.message || "Error checking conflict");
    }
  };

  const handleValuesChange = async (_, allValues) => {
    const { roomId, startTime, endTime, day } = allValues;
    if (roomId !== undefined && Number.isInteger(startTime) && Number.isInteger(endTime) && Number.isInteger(day)) {
      await checkConflict(allValues);
    } else {
      setHasConflict(false);
      setConflictMessage("");
    }
  };

  const handleSubmit = async (values) => {
    if (hasConflict) {
      message.error("Please resolve the schedule conflict before saving");
      return;
    }

    try {
      const response = await updateLessonSchedule(schedule.id, values);
      const { success, message: responseMessage } = response.data;
      if (success) {
        message.success("Lesson schedule updated successfully");
        onSuccess();
      } else {
        message.error(responseMessage || "Failed to update lesson schedule");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error updating lesson schedule");
    }
  };

  const handleCancel = useCallback(() => {
    message.info("Lesson schedule update canceled");
    form.resetFields();
    setHasConflict(false);
    setConflictMessage("");
    onClose();
  }, [onClose, form]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => (
    <Option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</Option>
  ));

  return (
    <Modal
      title="Update Lesson Schedule"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        size="large"
        layout="vertical"
        initialValues={schedule}
      >
        <Form.Item
          label="Room"
          name="roomId"
          rules={[{ required: true, message: "Please select a room!" }]}
        >
          <Select
            placeholder="Select room"
            allowClear
            onClick={fetchRooms}
            loading={loading}
          >
            {roomOptions}
          </Select>
        </Form.Item>
        <Form.Item
          label="Day"
          name="day"
          rules={[{ required: true, message: "Please select a day!" }]}
        >
          <Select placeholder="Select day" allowClear>
            <Option value={1}>Monday</Option>
            <Option value={2}>Tuesday</Option>
            <Option value={3}>Wednesday</Option>
            <Option value={4}>Thursday</Option>
            <Option value={5}>Friday</Option>
            <Option value={6}>Saturday</Option>
            <Option value={7}>Sunday</Option>
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Start Time (Hour)"
              name="startTime"
              rules={[
                { required: true, message: "Please select or enter the start time!" },
                { type: 'integer', min: 0, max: 23, message: "Start time must be between 0 and 23!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const endTime = getFieldValue('endTime');
                    if (endTime !== undefined && value >= endTime) {
                      return Promise.reject(new Error('Start time must be before end time!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select or enter start time"
                allowClear
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ padding: 8 }}>
                      <InputNumber
                        min={0}
                        max={23}
                        style={{ width: "100%" }}
                        placeholder="Custom start time"
                        onChange={(value) => form.setFieldsValue({ startTime: value })}
                      />
                    </div>
                  </>
                )}
              >
                {timeOptions}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Time (Hour)"
              name="endTime"
              rules={[
                { required: true, message: "Please select or enter the end time!" },
                { type: 'integer', min: 1, max: 24, message: "End time must be between 1 and 24!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startTime = getFieldValue('startTime');
                    if (startTime !== undefined && value <= startTime) {
                      return Promise.reject(new Error('End time must be after start time!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select or enter end time"
                allowClear
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ padding: 8 }}>
                      <InputNumber
                        min={1}
                        max={24}
                        style={{ width: "100%" }}
                        placeholder="Custom end time"
                        onChange={(value) => form.setFieldsValue({ endTime: value })}
                      />
                    </div>
                  </>
                )}
              >
                {timeOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {conflictMessage && (
          <div style={{ color: "red", marginBottom: 16 }}>
            {conflictMessage}
          </div>
        )}
        <Form.Item
          label="Group"
          name="groupId"
          rules={[{ required: true, message: "Please select a group!" }]}
        >
          <Select
            placeholder="Select group"
            allowClear
            onClick={fetchGroups}
            loading={fetchingGroups}
          >
            {groupOptions}
          </Select>
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<EditOutlined />}
            disabled={hasConflict}
          >
            Update Schedule
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateLessonScheduleModal;