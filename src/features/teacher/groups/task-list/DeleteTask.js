import { useState } from "react";
import { Alert, Avatar, Button, Card, Input, message, Modal, Typography } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, FileTextOutlined, SafetyOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { getFileIcon } from "./util";
import { deleteTeacherTask } from "../../../../services/api-client";

const {Text} = Typography;

const DeleteTask = ({ isOpen, onSuccess, onClose, record }) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const onFinish = async () => {
    setLoading(true);
    try {
      const response = await deleteTeacherTask(record.id);
      const { success, message: errorMessage } = response.data;
      if (success) {
        message.success("Task deleted successfully");
        onSuccess();
        onClose();
      } else {
        message.error(errorMessage || "Failed to delete task");
        onClose();
      }
    } catch (error) {
      message.error(error.message || "An error occurred while deleting the task");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onClose();
  };

  const isConfirmValid = confirmText.toLowerCase() === 'delete';

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
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)'
            }}
            icon={<ExclamationCircleOutlined />}
          />
          <div>
            <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
              Delete Task
            </Title>
            <Text type="secondary">This action cannot be undone</Text>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={480}
      footer={null}
    >
      <div style={{ padding: '16px 0' }}>
        <Alert
          message="Warning: Permanent Deletion"
          description="Deleting this task will permanently remove it and all associated student submissions. This action cannot be reversed."
          type="error"
          icon={<ExclamationCircleOutlined />}
          style={{
            marginBottom: 24,
            borderRadius: 8
          }}
        />

        {record?.taskName && (
          <Card
            size="small"
            style={{
              marginBottom: 24,
              borderRadius: 8,
              background: '#fff2f0',
              border: '1px solid #ffccc7'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar
                style={{ backgroundColor: '#ff4d4f' }}
                icon={getFileIcon(record.fileName) || <FileTextOutlined />}
              />
              <div>
                <Text strong style={{ color: '#262626' }}>
                  {record.taskName}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.type} • {record.maxBall} points • Due: {record.deadline}
                </Text>
              </div>
            </div>
          </Card>
        )}

        <div style={{ marginBottom: 24 }}>
          <Text strong>To confirm deletion, please type "delete" below:</Text>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            style={{
              marginTop: 8,
              borderRadius: 8,
              borderColor: confirmText && !isConfirmValid ? '#ff4d4f' : undefined
            }}
          />
          {confirmText && !isConfirmValid && (
            <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Please type "delete" exactly as shown
            </Text>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12
        }}>
          <Button
            onClick={handleCancel}
            style={{ borderRadius: 8 }}
          >
            <SafetyOutlined /> Keep Task
          </Button>
          <Button
            type="primary"
            danger
            onClick={onFinish}
            loading={loading}
            disabled={!isConfirmValid}
            style={{ borderRadius: 8 }}
          >
            <DeleteOutlined /> Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTask;