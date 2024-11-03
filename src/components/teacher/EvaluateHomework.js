import React from 'react';
import {Modal, Form, Input, Button, message, InputNumber} from 'antd';
import axios from "axios";
import {serverURL} from "../../server/serverConsts";
import {getToken} from "../../util/TokenUtil";

const EvaluateHomeworkModal = ({isEvaluateVisible, onClose, onSuccess, homeworkId,maxBall}) => {
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 20,
        },
    }

    const handleOk = () => {
        handleCancel()
    };
    const onFinish = (values) => {
        const jsonData = JSON.stringify(values);

        axios.post(serverURL + 'teacher/evaluate/'+homeworkId, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    message.success('Homework evaluated successfully');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message).then(() => () => form.resetFields());
                }
            })
            .catch((error) => {
                message.error('An error occurred while evaluating the homework').then(() => () => form.resetFields());
            });
    };
    const handleCancel = () => {
        message.info("Baholash bekor qilindi");
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Evaluate homework"
            open={isEvaluateVisible}
            onCancel={handleCancel}
            footer={true}
            onOk={handleOk}
        >
            <Form form={form} onFinish={onFinish} size={"large"} >
                <Form.Item label="Ball" name="homeworkBall"
                           rules={[{required: true, message: 'Iltimos baho qo\'ying!'}]} {...formItemLayout}>
                    <InputNumber type={"number"} min={0} max={maxBall} size={2} allowClear/>
                </Form.Item>

                <Form.Item label="Comment" name="description"
                           rules={[{required: true, message: 'Please description about the evaluation!'}]} {...formItemLayout}>
                    <Input.TextArea placeholder='Description about the evaluation' maxLength={100}
                                    allowClear style={{height: '10vh'}}
                                    />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" style={{float:"right"}}>
                        Submit
                    </Button>
                    <Button onClick={handleCancel} type="default" htmlType={"button"} style={{float:"right", marginRight:"1vh"}}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EvaluateHomeworkModal;
