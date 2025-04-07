import { Modal, Form, Input, Button, message, InputNumber, Space } from "antd";
import { evaluateHomework } from "../../../../../services/api-client";


const UpdateEvaluateHomework = ({ isOpen, onClose, onSuccess, homework, homeworkId, maxBall }) => {
  const onFinish = async (values) => {
    try {
      const response = await evaluateHomework(homeworkId, values);

      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success("Evaluation updated successfully");
        onSuccess();
      } else {
        message.error(errorMessage || "Failed to update evaluation");
      }
    } catch (error) {
      message.error(error.message || "An error occurred while updating the evaluation");
    }
  };

  const handleCancel = () => {
    message.info("Update evaluation cancelled");
    onClose();
  };

  return (
    <Modal
      title="Update Evaluation of StudentHomeworkList"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        onFinish={onFinish}
        size="large"
        layout="vertical"
        initialValues={homework}
      >
        <Form.Item
          label={`Score (0 - ${maxBall})`}
          name="homeworkBall"
          rules={[{ required: true, message: "Please provide a score!" }]}
        >
          <InputNumber min={0} max={maxBall} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Comment"
          name="description"
          rules={[{ required: true, message: "Please provide a comment!" }]}
        >
          <Input.TextArea
            placeholder="Description about the evaluation"
            maxLength={100}
            style={{ height: "100px" }}
          />
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

export default UpdateEvaluateHomework;