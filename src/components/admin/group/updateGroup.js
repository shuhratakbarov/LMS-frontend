import React, {useState} from 'react';
import {Modal, Form, Input, Button, message, Select} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import {formItemLayout} from "../../../const/FormItemLayout";

const UpdateGroupModal = ({isEditModalVisible, onClose, onSuccess, record}) => {
    const [form] = Form.useForm();



    const [options, setOptions] = useState([]);

    const [loadingOptions, setLoadingOptions] = useState(false);

    const fetchCourses = async () => {
        try {
            setLoadingOptions(true);
            const response = await axios.get(`${serverURL}admin/course/course-id-and-name`,{
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const dto = response.data;

            if (dto.success) {
                const jsonData = dto.data;
                const mappedOptions = jsonData.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                ));
                setOptions(mappedOptions);
            } else {
                message.error(dto.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoadingOptions(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            setLoadingOptions(true);
            const response = await axios.get(`${serverURL}admin/teacher-id-and-username`,{
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const dto = response.data;

            if (dto.success) {
                const jsonData = dto.data;
                const mappedOptions = jsonData.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.username}
                    </Select.Option>
                ));
                setOptions(mappedOptions);
            } else {
                message.error(dto.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoadingOptions(false);
        }
    };

    const onFinish = (values) => {
        const jsonData = JSON.stringify(values);
        console.log(jsonData);
        axios.put(serverURL + `admin/group/edit/` + record.id, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    message.success('Group updated successfully');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                    form.resetFields();
                }
            })
            .catch((error) => {
                message.error('An error occurred while updating the group');
                form.resetFields();
            });
        console.log(jsonData)
    };
    const handleCancel = () => {
        message.info('Tahrirlash bekor qilindi');
        onClose();
        form.resetFields();
    };

    return (
        <Modal
            title="Update the group"
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
                <Form.Item label="Course name" name="courseId"
                           rules={[{required: true, message: 'Please select course name!'}]} {...formItemLayout}  >
                    <Select
                        placeholder='Select course'
                        allowClear
                        onClick={fetchCourses}
                        loading={loadingOptions}
                        defaultValue={record.courseName}
                    >
                        {options}
                    </Select>

                </Form.Item>
                <Form.Item label="Teacher" name="teacherId"
                           rules={[{required: true, message: 'Please select a teacher!'}]} {...formItemLayout}  >
                    <Select
                        placeholder='Select course'
                        allowClear
                        onClick={fetchTeachers}
                        loading={loadingOptions}
                        defaultValue={record.teacherUsername}
                    >
                        {options}
                    </Select>

                </Form.Item>
                <Form.Item label="Description" name="description"
                           rules={[{required: true, message: 'Please enter the description!'}]} {...formItemLayout}>
                    <Input.TextArea placeholder='Enter description about the group' maxLength={60}
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


export default UpdateGroupModal;
