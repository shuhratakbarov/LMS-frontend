import React from 'react';
import { Modal, Form, Input, Button, message, Upload, DatePicker } from 'antd';
import axios from "axios";
import { serverURL } from "../../../server/consts/serverConsts";
import { getToken } from "../../../util/TokenUtil";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const CreateTask = ({ isAddTaskVisible, onClose, onSuccess, groupId}) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const formData = new FormData();
        console.log(groupId);
        formData.append('file', values.file.file);
        formData.append('name', values.name);
        formData.append('maxBall', values.maxBall);
        formData.append('groupId', groupId);
        formData.append('deadline', values.deadline.format('YYYY-MM-DD'));
        axios.post(serverURL + `teacher/create-task`, formData, {
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    console.log(response.data)
                    message.success('Task added successfully');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('An error occurred while adding the task');
            });
    };

    const handleCancel = () => {
        message.info("Task creation cancelled");
        form.resetFields();
        onClose();
    };
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()+3}`;
    console.log(formattedCurrentDate);
    return (
        <Modal
            title="Create new task"
            open={isAddTaskVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} size="large">
                <Form.Item label="Theme" name="name" rules={[{required: true, message: 'Please enter a theme!'}]}>
                    <Input allowClear/>
                </Form.Item>
                <Form.Item label="Max ball" name="maxBall"
                           rules={[{required: true, message: 'Please enter the max ball!'}]}>
                    <Input allowClear/>
                </Form.Item>
                <Form.Item label="Deadline" name="deadline"
                           rules={[{required: true, message: 'Please select a deadline!'}]}>
                    <DatePicker disabledDate={(current) => current && current < moment(formattedCurrentDate)}/>
                </Form.Item>
                <Form.Item label="File" name="file" rules={[{required: true, message: 'Please upload a file!'}]}
                           encType="multipart/form-data">
                    <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined/>}>Yuklash</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
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

export default CreateTask;
