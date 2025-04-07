import { Modal, Form, Button, message, Upload, Typography, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { reUploadHomework, uploadHomework } from "../../../../services/api-client";

const { Text } = Typography;

const UploadHomeworkModal = ({ isOpen, onClose, onSuccess, taskId, homeworkId }) => {
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("file", values.file.file);

    try {
      const response = await homeworkId == null ? uploadHomework(taskId, formData) : await reUploadHomework(homeworkId, taskId, formData);
      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success("StudentHomeworkList uploaded successfully");
        onSuccess();
      } else {
        message.error(errorMessage || "Failed to upload homework");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while uploading the homework");
    }
  };

  const handleCancel = () => {
    message.info("Uploading cancelled");
    onClose();
  };

  return (
    <Modal
      title={homeworkId == null ? "Upload StudentHomeworkList" : "Re-upload StudentHomeworkList"}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form onFinish={onFinish} size="large" layout="vertical">
        <Text type="warning">Only one file can be uploaded!</Text>
        <Form.Item
          label="File"
          name="file"
          rules={[{ required: true, message: "Please upload a file!" }]}
          style={{ marginTop: "16px" }}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={handleCancel} type="default">
            Cancel
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default UploadHomeworkModal;