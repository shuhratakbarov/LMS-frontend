import { Modal, Form, Input, Button, message, Upload, DatePicker } from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { updateTeacherTask } from "../../../../services/api-client";

const EditTask = ({ isOpen, onSuccess, onClose, record }) => {
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("file", values.file.file);
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("maxBall", values.maxBall);
      formData.append("deadline", values.deadline.format("YYYY-MM-DD"));

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
    message.info("Task editing cancelled");
    onClose();
  };

  const currentDate = moment().add(3, "days");

  return (
    <Modal
      title="Edit Task"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        onFinish={onFinish}
        size="large"
        layout="vertical"
        initialValues={{
          name: record?.taskName,
          type: record?.type,
          maxBall: record?.maxBall,
          deadline: record?.deadline ? moment(record.deadline) : null,
        }}
      >
        <Form.Item
          label="Theme"
          name="name"
          rules={[{ required: true, message: "Please enter a theme!" }]}
        >
          <Input allowClear placeholder="Enter task theme" />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please enter the type!" }]}
        >
          <Input allowClear placeholder="Enter task type" />
        </Form.Item>
        <Form.Item
          label="Max Ball"
          name="maxBall"
          rules={[{ required: true, message: "Please enter the max ball!" }]}
        >
          <Input type="number" allowClear placeholder="Enter max ball" />
        </Form.Item>
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[{ required: true, message: "Please select a deadline!" }]}
        >
          <DatePicker
            disabledDate={(current) => current && current < currentDate}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="File"
          name="file"
          rules={[{ required: true, message: "Please upload a file!" }]}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
            Submit
          </Button>
          <Button onClick={handleCancel} type="default">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTask;