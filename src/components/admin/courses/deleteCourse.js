import React from 'react';
import {Modal, Button, message,Typography} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";

const {Text} = Typography;

const DeleteCourseModal = ({isDeleteModalVisible, onClose, onSuccess, id, deletingCourse}) => {

    const onFinish = () => {
        axios.delete(serverURL + `admin/course/delete/${id}`,{
            headers:{
                Authorization: `Bearer ${getToken()}`
            }})
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    message.success('Course deleted successfully');
                    onSuccess();
                    onClose();

                } else {
                    message.error(response.data.message);
                    onClose();
                }
            })
            .catch((error) => {
                console.log(error)
                message.error('An error occurred while deleting the courses');
            });
    };

    const handleCancel = () => {
        message.info("O'chirish bekor qilindi");
        onClose();
    };

    return (
        <Modal
            title="Delete the course"
            open={isDeleteModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Text type="danger">Rostdan ham <b>{deletingCourse}</b> kursini o'chirmoqchimisiz?</Text>
            <br/>
            <br/>
            <Button type="primary" danger htmlType="submit" onClick={onFinish}
                    icon={<CheckOutlined/>}>
                Ha
            </Button>
        </Modal>
    );
};

export default DeleteCourseModal;
