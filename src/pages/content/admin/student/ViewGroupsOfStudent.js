import React, { useEffect, useState } from 'react';
import { message, Modal, Table } from 'antd';
import axios from "axios";
import { serverURL } from "../../../../server/consts/serverConsts";
import { getToken } from "../../../../util/TokenUtil";

const ViewGroupsOfStudent = ({ isViewGroupsModalVisible, name, onClose , studentId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getGroupsOfStudent = () => {
            axios.get(`${serverURL}admin/group/groups-of-student/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
                .then((response) => {
                    const dto = response.data;
                    if (dto.success) {
                        setData(dto.data);
                    } else {
                        message.error("dto success is false: " + dto.message);
                    }
                })
                .catch((error) => {
                    message.error("Caught error: " + error.message);
                });
        };

        if (isViewGroupsModalVisible) {
            getGroupsOfStudent();
        }
    }, [isViewGroupsModalVisible, studentId]);

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Group name',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            title: 'Teacher',
            dataIndex: 'teacherName',
            key: 'teacherName',
        },
    ];

    return (
        <Modal title={`${name}ning guruhlari :`} visible={isViewGroupsModalVisible} onCancel={onClose} footer={null}>
            <Table dataSource={data} columns={columns} pagination={false}/>
        </Modal>
    );
};

export default ViewGroupsOfStudent;
