import React, {useEffect, useState} from 'react';
import {message, Modal, Table} from 'antd';
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";


const ViewGroupsOfTeacher = ({ isViewGroupsModalVisible, name, onClose, teacherId }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const getGroupsOfTeacher = () => {
            axios.get(`${serverURL}admin/group/groups-of-teacher/${teacherId}`, {
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
            getGroupsOfTeacher();
        }
    }, [isViewGroupsModalVisible, teacherId]);

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Group name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Number of students',
            dataIndex: 'count',
            key: 'count',
        },
    ];

    return (
        <Modal title={`${name} ustozning guruhlari :`} visible={isViewGroupsModalVisible} onCancel={onClose} footer={null}>
            <Table dataSource={data} columns={columns} pagination={false}/>
        </Modal>
    );
};

export default ViewGroupsOfTeacher;
