import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, FormOutlined, ArrowLeftOutlined, EditOutlined} from "@ant-design/icons";
import UpdateGroupModal from "./updateGroup";
import DeleteGroupModal from "./deleteGroup";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import AddStudentModal from "./AddStudentModal";
import RemoveStudentModal from "./RemoveStudentModal";


class ActionsInGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalPages: 0,
            page: 0,
            size: 10,
            isAddStudentModalVisible: false,
            isRemoveStudentModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            deletingStudentId: 0,
            deletingStudentName: '',
            deletingId: 0,
            record: {},
        };
    }

    hideModal = () => {
        this.setState({
            isAddStudentModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isRemoveStudentModalVisible: false,
        })
    };
    handlePagination = (e) => {
        this.setState({
            page: e - 1
        }, () => this.getData())
    }

    getData() {
        const groupId = this.props.record.id;
        const {page, size} = this.state;
        let url = `${serverURL}admin/group/students-of-group/${groupId}?page=${page}&size=${size}`;
        axios({
            url: url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let dto = res.data;
                if (dto.success) {
                    this.setState({
                        dataSource: dto.data.content.content,
                    })
                } else {
                    alert(dto.message)
                }
                console.log(this.state.dataSource)
            })
            .catch((err) => {
                alert("muammo : "+err.message)
            });
    }

    componentDidMount() {
        this.getData();
    }

    handleSuccess = () => {
        this.getData();
        this.setState({
            record: this.props.record,
        })
    };
    handleAdd = () => {
        this.setState({
            isAddStudentModalVisible: true,
        });
    };
    handleRemove = (id,name) => {
        this.setState({
            isRemoveStudentModalVisible: true,
            deletingStudentId: id,
            deletingStudentName: name,
        });
    };

    handleEdit = () => {
        this.setState({
            isEditModalVisible: true,
            record: this.props.record,
        });
    };
    handleDelete = () => {
        this.setState({
            isDeleteModalVisible: true,
            deletingId: this.props.record.id,
        });
    };

    handleBack = () => {
        this.props.onClose();
    };
    render() {
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'First name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Last name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'Remove student from group',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleRemove(record.id,record.firstName)}><DeleteOutlined/></a>
                    </Space>
                ),
            },
        ];

        const {dataSource, isAddStudentModalVisible, isRemoveStudentModalVisible, isEditModalVisible, isDeleteModalVisible} = this.state;

        return (
                 <Fragment>
                    <h2>{this.props.record.name} guruhi <a onClick={this.handleEdit}><EditOutlined/> </a> <Button
                        type="dashed" onClick={this.handleBack} icon={<ArrowLeftOutlined/>}
                        style={{float: "right", marginBottom: '5px'}}>
                        Orqaga
                    </Button></h2>

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{
                            pageSize: this.state.size,
                            total: this.state.totalPages,
                            onChange: this.handlePagination,
                        }}
                    >
                    </Table>
                    <Button type="primary" onClick={this.handleAdd} icon={<FormOutlined/>}>
                        Add new student
                    </Button>
                    <Button type="primary" onClick={this.handleDelete} icon={<DeleteOutlined/>}
                            style={{float: "right"}}>
                        Delete group
                    </Button>
                    {isAddStudentModalVisible && (<AddStudentModal
                        isAddModalVisible={isAddStudentModalVisible}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                        groupId={this.props.record.id}
                    />)}
                    {isRemoveStudentModalVisible && (<RemoveStudentModal
                        isRemoveStudentModalVisible={isRemoveStudentModalVisible}
                        name={this.state.deletingStudentName}
                        studentId={this.state.deletingStudentId}
                        groupId={this.props.record.id}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                    />)}
                    {isEditModalVisible && (<UpdateGroupModal
                        isEditModalVisible={isEditModalVisible}
                        record={this.state.record}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                    />)}
                    {isDeleteModalVisible && (<DeleteGroupModal
                        isDeleteModalVisible={isDeleteModalVisible}
                        id={this.state.deletingId}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                    />)}
                </Fragment>
        );
    }
}

export default ActionsInGroup;