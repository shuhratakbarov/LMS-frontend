import React, {useEffect} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {formItemLayout} from "../../../const/FormItemLayout";
import {useAxios} from "../../../server/AxiosProvider";
import {ENDPOINTS} from "../../../server/endpoints";


const CreateCourseModal = ({isAddModalVisible, onClose, onSuccess}) => {
    const [form] = Form.useForm();
    // const onFinish = (values) => {
    //     const jsonData = JSON.stringify(values);
    //     axios.post(serverURL + 'admin/course/create', jsonData, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${getToken()}`
    //         }
    //     })
    //         .then((response) => {
    //             if (response.data.success) {
    //                 message.success('Course added successfully');
    //                 form.resetFields();
    //                 onSuccess();
    //                 onClose();
    //             } else {
    //                 message.error(response.data.message).then(() => () => form.resetFields());
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             message.error('An error occurred while adding the course').then(() => () => form.resetFields());
    //         });
    // };
    const {post, loading, error} = useAxios();

    useEffect(() => {
        if (error) {
            message.error('Yangi kursni qo\'shishda xatolik yuz berdi').then(() => form.resetFields());
        }
    }, [error, form]);

    const onFinish = async (values) => {
        const data = await post(ENDPOINTS.CREATE_COURSE, values);
        if (data.success) {
            message.success('Course added successfully').then(() =>form.resetFields());
            onSuccess();
            onClose();
        } else {
            message.error(data.message).then(() => form.resetFields());
        }
    };
    const handleCancel = () => {
        message.info("Qo'shish bekor qilindi").then(r => form.resetFields());
        onClose();
    };

    return (
        <Modal
            title="Add New Course"
            open={isAddModalVisible}
            onCancel={handleCancel}
            footer={null}
            onOk={onSuccess}
        >
            <Form form={form} onFinish={onFinish} size={"large"}>
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
                            icon={<PlusOutlined/>} loading={loading}>
                        Add Course
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCourseModal;
