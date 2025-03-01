import React from 'react';
import { Modal, Form, Input, Button, message, Upload, DatePicker, Typography } from 'antd';
import axios from "axios";
import { serverURL } from "../../../../server/serverConsts";
import { getToken } from "../../../../util/TokenUtil";
import { UploadOutlined } from "@ant-design/icons";

const {Text} = Typography;

const UploadHomeworkModal = ({ isUploadHomeworkVisible, onClose, onSuccess, taskId, homeworkId}) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        const formData = new FormData();
        formData.append('file', values.file.file);
        let url;
        let method;
        if (homeworkId == null) {
            url = serverURL + `student/upload-homework/${taskId}`;
            method = "POST";
        } else {
            url = serverURL + `student/re-upload-homework/${taskId}?homeworkId=${homeworkId}`;
            method = "PUT";
        }
        axios({
            url: url,
            method: method,
            data: formData,
            headers: {
                Accept: 'application/json, text/plain, */*',
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response) => {
                if (response.data.success) {
                    console.log(response.data)
                    message.success('Homework uploaded successfully');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                message.error('An error occurred while uploading the homework');
            });
    };

    const handleCancel = () => {
        message.info("Uploading cancelled");
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Upload Homework"
            open={isUploadHomeworkVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} size="large">
                <Text type={"warning"}> Faqat bitta fayl yuklash mumkin!</Text>
                <br/><br/>
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

export default UploadHomeworkModal;
