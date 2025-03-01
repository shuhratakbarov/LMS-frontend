import React, {useState} from 'react';
import {Modal, Button, message,Typography} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";

const {Text} = Typography;

const DeleteStudentModal = ({isDeleteModalVisible, onClose, onSuccess, id, name}) => {


    const onFinish = () => {

        axios.delete(serverURL + `admin/delete/${id}`,{
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    message.success(name+' o\'chirildi').then(onSuccess).then(onClose);

                } else {
                    message.error(response.data.message).then(onClose);
                }
            })
            .catch((error) => {
                console.log(error)
                message.error('An error occurred while deleting the students');
            });
    };

    const handleCancel = () => {
        message.info("O'chirish bekor qilindi");
        onClose();
    };

    return (
        <Modal
            title="Delete the student"
            open={isDeleteModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Text type="danger">Rostan ham {name}ni o'chirmoqchimisiz?</Text>
            <br/>
            <br/>
            <Button
                type="primary"
                danger
                htmlType="submit"
                onClick={onFinish}
                icon={<CheckOutlined/>}
            >
                O'chirish
            </Button>
        </Modal>
    );
};

export default DeleteStudentModal;
