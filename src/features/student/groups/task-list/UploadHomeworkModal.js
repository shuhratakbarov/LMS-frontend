import { Modal, Form, Button, message, Upload, Typography, Space, Alert, Row, Col } from "antd";
import {
  CloudUploadOutlined,
  FileOutlined,
  FileTextOutlined,
  UploadOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { reUploadHomework, uploadHomework } from "../../../../services/api-client";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const { Text } = Typography;

const UploadHomeworkModal = ({ isOpen, onClose, onSuccess, taskId, homeworkId, taskName }) => {
  const { refetchNotifications } = useOutletContext();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", values.file.file);

    try {
      // Replace with your actual API calls
      const response = homeworkId == null
        ? await uploadHomework(taskId, formData)
        : await reUploadHomework(homeworkId, taskId, formData);

      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success(homeworkId ? "Homework re-uploaded successfully" : "Homework uploaded successfully");
        form.resetFields();
        refetchNotifications();
        onSuccess();
      } else {
        message.error(errorMessage || "Failed to upload homework");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while uploading the homework");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (!uploading) {
      form.resetFields();
      onClose();
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: '.pdf,.doc,.docx,.pptx,.png,.jpg,.txt,.zip,.rar',
    onChange: ({ fileList }) => {
      if (fileList.length === 0) {
        form.setFieldsValue({ file: undefined });
      }
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CloudUploadOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {homeworkId ? "Re-upload Homework" : "Upload Homework"}
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
      width={520}
      maskClosable={!uploading}
      closable={!uploading}
    >
      <div style={{ marginBottom: 16 }}>
        <Alert
          message={`Task: ${taskName || 'Unknown Task'}`}
          type="info"
          icon={<FileTextOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Alert
          message="Important: Only one file can be uploaded per submission"
          type="warning"
          icon={<WarningOutlined />}
          showIcon
        />
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        layout="vertical"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="Select File"
          name="file"
          rules={[{ required: true, message: "Please select a file to upload!" }]}
        >
          <Upload.Dragger {...uploadProps} style={{ padding: '20px' }}>
            <p className="ant-upload-drag-icon">
              <FileOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support: PDF, DOC, DOCX, TXT, ZIP, RAR files
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              block
              size="large"
              icon={<UploadOutlined />}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          </Col>
          <Col span={12}>
            <Button
              onClick={handleCancel}
              disabled={uploading}
              block
              size="large"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UploadHomeworkModal;