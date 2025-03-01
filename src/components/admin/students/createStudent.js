import React, {useState} from 'react';
import {Modal, Form, Input, Button, message, Select, DatePicker} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import {formItemLayout} from "../../../const/FormItemLayout";


const CreateStudentModal = ({isAddModalVisible, onClose, onSuccess}) => {

    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const fetchGroups = async () => {
        try {
            setLoadingOptions(true);
            const response = await axios.get(`${serverURL}admin/group/group-id-and-name`,{
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

    const onFinish = (values) => {
        values.role_id=3;
        console.log(values);
        const jsonData = JSON.stringify(values);
        console.log(jsonData);
        axios.post(serverURL + 'admin/save', jsonData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    message.success('Student muvaffaqiyatli qo\'shildi');
                    form.resetFields();
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message).then(() => () => form.resetFields());
                }
            })
            .catch((error) => {
                message.error('An error occurred while adding the students').then(() => () => form.resetFields());
            });
    };


    const handleCancel = () => {
        message.info("Qo'shish bekor qilindi");
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Add New Student"
            open={isAddModalVisible}
            onCancel={handleCancel}
            footer={null}
            onOk={onSuccess}
        >
            <Form form={form} onFinish={onFinish} size={"large"}>
                <Form.Item name="roleId" initialValue={3} hidden={true}>

                </Form.Item>
                <Form.Item label="First name" name="firstName"
                           rules={[{required: true, message: 'Please enter first name!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter name' maxLength={30} allowClear/>
                </Form.Item>
                <Form.Item label="Last name" name="lastName"
                           rules={[{required: true, message: 'Please enter last name!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter name' maxLength={30} allowClear/>
                </Form.Item>
                <Form.Item label="Phone" name="phone"
                           rules={[{required: true, message: 'Please enter phone number!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter phone number' maxLength={16} allowClear/>
                </Form.Item>
                <Form.Item label="Email" name="email"
                           rules={[{required: true, message: 'Please enter an e-mail!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter an e-mail' maxLength={40} allowClear/>
                </Form.Item>
                <Form.Item label="Address" name="address"
                           rules={[{required: true, message: 'Please enter address!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter address' maxLength={40} allowClear/>
                </Form.Item>
                <Form.Item label="Birth Date" name="birthDate"
                           rules={[{required: true, message: 'Please enter birth date!'}]} {...formItemLayout}  >
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Username" name="username"
                           rules={[{required: true, message: 'Please enter username!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter username' maxLength={32} allowClear/>
                </Form.Item>
                <Form.Item label="Password" name="password"
                           rules={[{required: true, message: 'Please enter a password!'}]} {...formItemLayout}  >
                    <Input placeholder='Enter a password' maxLength={32} allowClear/>
                </Form.Item>
                <Form.Item label="Groups" name="groups"
                           rules={[{required: false, message: 'Iltimos guruhlarni tanlang!'}]} {...formItemLayout}>
                    <Select
                        placeholder='Guruhlarni tanlang'
                        allowClear
                        mode="multiple"
                        onClick={fetchGroups}
                        loading={loadingOptions}
                    >
                        {options}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit"
                            icon={<PlusOutlined/>}>
                        Add Student
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateStudentModal;
