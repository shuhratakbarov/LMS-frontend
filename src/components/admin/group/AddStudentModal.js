import React, { useState } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { serverURL } from "../../../server/serverConsts";
import { getToken } from "../../../util/TokenUtil";
import Search from "antd/es/input/Search";

const AddStudentModal = ({ isAddModalVisible, onClose, onSuccess, groupId }) => {
    const [student, setStudent] = useState(null);
    const [form] = Form.useForm();

    const onSearch = (searchText) => {
        axios({
            url: `${serverURL}admin/group/search-student?username=${searchText}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                const dto = res.data;
                if (dto.success) {
                    setStudent(dto.data);
                } else {
                    setStudent("Student not found");
                    message.error(dto.message);
                }
            })
            .catch((err) => {
                setStudent(null);
                message.error(err.message);
            });
    }

    const onFinish = (values) => {
        if (student.id != null && student !== "Student not found" && student != null) {
            axios.post(serverURL + `admin/group/add-student?student-id=${student.id}&group-id=${groupId}`, values,{
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        message.success('Student added successfully');
                        form.resetFields();
                        onSuccess();
                        onClose();
                    } else {
                        message.error(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    message.error('An error occurred while adding the student');
                });
        } else {
            message.error("Student not found");
        }
    };

    const handleCancel = () => {
        message.info("Adding student canceled");
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Add New Student"
            visible={isAddModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} size={"large"}>
                <Search onSearch={(value) => onSearch(value)} />
                <Form.Item label="Student" name="studentId">
                    <p>{student ? `${student.firstName} ${student.lastName}` : " "}</p>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Add Student
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddStudentModal;
