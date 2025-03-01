import React from 'react';
import {Modal, Button, message,Typography} from 'antd';
import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";

const {Text} = Typography;

const DeleteGroupModal = ({isDeleteModalVisible, onClose, onSuccess, id}) => {
    const onFinish = () => {
        axios.delete(serverURL + `admin/group/delete/${id}`,{
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                if (response.data.success) {
                    message.success('Group deleted successfully');
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.data.message);
                    onClose();
                }
            })
            .catch((error) => {
                console.log(error)
                message.error('An error occurred while deleting the groups');
            });
    };

    const handleCancel = () => {
        message.info("O'chirish bekor qilindi");
        onClose();
    };

    return(
        <Modal
            title="Delete the group"
            open={isDeleteModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Text type="danger">Guruhni o'chirmoqchimisiz?</Text>
            <br/>
            <br/>
            <Button
                type="primary"
                danger
                htmlType="submit"
                onClick={onFinish}
                icon={<CheckOutlined/>}
            >
                Submit
            </Button>
        </Modal>
    )
};

export default DeleteGroupModal;
