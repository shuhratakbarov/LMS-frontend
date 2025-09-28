import { useEffect, useState } from "react";
import {
  Avatar, Button, Card, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select, Typography, Upload
} from "antd";
import { EditOutlined, FileTextOutlined, TrophyOutlined, UploadOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { getFileIcon, taskTypes } from "./util";
import TextArea from "antd/es/input/TextArea";
import { updateTeacherTask } from "../../../../services/api-client";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

const EditTask = ({ isOpen, onSuccess, onClose, record }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(record?.type);

  useEffect(() => {
    if (record && isOpen) {
      form.setFieldsValue({
        name: record.taskName,
        type: record.type,
        maxBall: record.maxBall,
        deadline: record.deadline ? dayjs(record.deadline) : null,
        description: record.description,
      });
      setSelectedType(record.type);
    }
  }, [record, isOpen, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      if (values?.file?.file) {
        formData.append("file", values.file.file);
      }
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("maxBall", values.maxBall);
      formData.append("deadline", values.deadline.toISOString().replace("Z", ""));

      const response = await updateTeacherTask(record.id, formData);

      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success("Task edited successfully");
        onSuccess();
        onClose();
      } else {
        message.error(errorMessage || "Failed to edit task");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while editing the task");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUploadedFile(null);
    onClose();
  };

  const currentDate = dayjs().add(3, "days");

  return (
    <Modal
      title={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingBottom: 16,
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Avatar
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)'
            }}
            icon={<EditOutlined />}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>Edit Task</Title>
            <Text type="secondary">Update task: {record?.taskName}</Text>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={680}
      footer={null}
    >
      <div style={{ padding: '16px 0' }}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={<Text strong>Task Name</Text>}
                name="name"
                rules={[{ required: true, message: "Please enter a task name!" }]}
              >
                <Input
                  size="large"
                  placeholder="Enter descriptive task name"
                  style={{ borderRadius: 8 }}
                  prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Task Type</Text>}
                name="type"
                rules={[{ required: true, message: "Please select task type!" }]}
              >
                <Select
                  size="large"
                  placeholder="Select task type"
                  style={{ borderRadius: 8 }}
                  onChange={setSelectedType}
                >
                  {taskTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Maximum Score</Text>}
                name="maxBall"
                rules={[{ required: true, message: "Please enter maximum score!" }]}
              >
                <Input
                  type="number"
                  min={1}
                  max={50}
                  style={{ borderRadius: 8 }}
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  suffix="points"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Deadline</Text>}
                name="deadline"
                rules={[{ required: true, message: "Please select a deadline!" }]}
              >
                <DatePicker
                  size="large"
                  disabledDate={(current) => current && current < currentDate}
                  style={{ width: "100%", borderRadius: 8 }}
                  showTime={{
                    format: 'HH:mm'
                  }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Text strong>Update File (Optional)</Text>}
            name="file"
          >
            <Upload
              beforeUpload={(file) => {
                setUploadedFile(file);
                return false;
              }}
              onRemove={() => setUploadedFile(null)}
              maxCount={1}
              style={{ width: '100%' }}
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                style={{ borderRadius: 8, width: '100%' }}
              >
                Replace Current File
              </Button>
            </Upload>
          </Form.Item>

          {record?.fileName && !uploadedFile && (
            <Card size="small" style={{ background: '#f6ffed', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getFileIcon(record.fileName)}
                <Text>Current file: <Text strong>{record.fileName}</Text></Text>
              </div>
            </Card>
          )}

          <Divider />

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}>
            <Button
              onClick={handleCancel}
              style={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                border: 'none'
              }}
            >
              <EditOutlined /> Update Task
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditTask;