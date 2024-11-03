import React from 'react';
import {Modal, Button, message,Typography} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";

const {Text} = Typography;

const RemoveStudentModal = ({isRemoveStudentModalVisible, onClose, onSuccess, studentId, name, groupId}) => {

    const onFinish = () => {
        axios.delete(serverURL + `admin/group/remove-student/${studentId}?group-id=${groupId}`,{
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    message.success('Student removed from the group');
                    onSuccess();
                    onClose();
                } else {
                    message.info("Muammo yuz berdi ")
                }
            })
            .catch((error) => {
                console.log(error)
                message.error('An error occurred while removing the student');
            });
    };

    const handleCancel = () => {
        message.info("O'chirish bekor qilindi");
        onClose();
    };

    return(
        <Modal
            title="Remove the student"
            open={isRemoveStudentModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Text type="danger">{name}ni rostdan ham guruhdan chiqarmoqchimisiz?</Text>
            <br/>
            <br/>
            <Button
                type="primary"
                htmlType="submit"
                onClick={onFinish}
                icon={<CheckOutlined/>}
            >
                Ha
            </Button>
        </Modal>
    )
};

export default RemoveStudentModal;
