import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import {formItemLayout} from "../../../const/FormItemLayout";

const UpdateCourseModal = ({isEditModalVisible, onClose, onSuccess, record}) => {
    const [form] = Form.useForm();



    const onFinish = (values) => {
        const jsonData = JSON.stringify(values);
        axios.put(serverURL + `admin/course/edit/` + record.id, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    message.success('Course edited successfully');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                    form.resetFields();
                }
            })
            .catch((error) => {
                message.error('An error occurred while editing the course');
                form.resetFields();
            });

        console.log(jsonData)
    };
    const handleCancel = () => {
        message.info('Tahrirlash bekor qilindi');
        form.resetFields();
        onClose();

    };

    return (
        <Modal
            title="Edit the course"
            open={isEditModalVisible}
            onCancel={handleCancel}
            footer={null}
            onOk={onSuccess}
        >
            <Form
                form={form}
                onFinish={onFinish}
                size={"large"}
                initialValues={record}
            >
                <Form.Item label="Name" name="name"
                           rules={[{required: true, message: 'Please enter name!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter name' maxLength={25} allowClear/>
                </Form.Item>
                <Form.Item label="Description" name="description"
                           rules={[{required: true, message: 'Please enter the description!'}]} {...formItemLayout}>
                    <Input.TextArea placeholder='Enter description about the course' maxLength={60}
                                    allowClear style={{height: '50px'}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit"
                            icon={<CheckOutlined/>}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};


export default UpdateCourseModal;
