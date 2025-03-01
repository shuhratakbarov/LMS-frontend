import React from 'react';
import {Modal, Form, Input, Button, message, Upload, DatePicker, Typography} from 'antd';
import axios from "axios";
import { serverURL } from "../../../../server/serverConsts";
import { getToken } from "../../../../util/TokenUtil";
import {CheckOutlined, UploadOutlined} from "@ant-design/icons";
const {Text} = Typography;
const DeleteTask = ({ isDeleteTaskVisible, onClose, onSuccess, record, groupId}) => {
    const onFinish = () => {
        axios.delete(serverURL + `teacher/delete-task/${record.id}`,{
            headers:{
                Authorization: `Bearer ${getToken()}`
            }})
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    message.success('Task deleted successfully');
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                    onClose();
                }
            })
            .catch((error) => {
                console.log(error)
                message.error('An error occurred while deleting the task');
            });
    };

    const handleCancel = () => {
        message.info("O'chirish bekor qilindi");
        onClose();
    };

    return (
        <Modal
            title="Delete the task"
            open={isDeleteTaskVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Text type="danger">Rostdan ham <b>{record.taskName}</b> topshirig'ini o'chirmoqchimisiz?</Text>
            <br/>
            <br/>
            <Button type="primary" danger htmlType="submit" onClick={onFinish}
                    icon={<CheckOutlined/>}>
                Ha
            </Button>
        </Modal>
    );
};

export default DeleteTask;
