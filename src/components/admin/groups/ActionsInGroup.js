import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import {
    DeleteOutlined, ArrowLeftOutlined, EditOutlined,
    UserDeleteOutlined, UserAddOutlined
} from "@ant-design/icons";
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
            totalElements: 0,
            page: 0,
            size: 5,
            isAddStudentModalVisible: false,
            isRemoveStudentModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            deletingStudentId: 0,
            deletingStudentName: '',
            deletingId: 0,
            record: {},
            loading: true
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
    handlePageSizeChange = (current, size) => {
        this.setState({
            size: size,
            page: 0, // Reset to the first page
        }, () => this.getData());
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
                        totalElements: dto.data.totalElements,
                        loading: false
                    })
                } else {
                    alert(dto.message);
                    this.setState({ loading: false }); // Hide spinner on error
                }
                console.log(this.state.dataSource)
            })
            .catch((err) => {
                alert("Error : "+err.message);
                this.setState({ loading: false }); // Hide spinner on error
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
        const { page, size, dataSource, isAddStudentModalVisible, isRemoveStudentModalVisible, isEditModalVisible, isDeleteModalVisible, loading } = this.state;

        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => (page * size) + index + 1,
            },
            {
                title: 'First name',
                dataIndex: 'firstName',
                key: 'firstName',
                sorter: (a, b) => a.firstName.localeCompare(b.firstName), // Enable sorting
                filters: [
                    { text: 'Starts with A', value: 'A' },
                    { text: 'Starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.firstName.startsWith(value), // Enable filtering
            },
            {
                title: 'Last name',
                dataIndex: 'lastName',
                key: 'lastName',
                sorter: (a, b) => a.lastName.localeCompare(b.lastName), // Enable sorting
                filters: [
                    { text: 'Starts with A', value: 'A' },
                    { text: 'Starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.lastName.startsWith(value), // Enable filtering
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                sorter: (a, b) => a.username.localeCompare(b.username), // Enable sorting
                filters: [
                    { text: 'Starts with A', value: 'A' },
                    { text: 'Starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.username.startsWith(value), // Enable filtering
            },
            {
                title: 'Remove',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleRemove(record.id, record.firstName)}><UserDeleteOutlined style={{fontSize:'2.5vh'}}/></a>
                    </Space>
                ),
            },
        ];

        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Username:</strong> {record.username}<br />
                    <strong>First Name:</strong> {record.firstName}<br />
                    <strong>Last Name:</strong> {record.lastName}
                </p>
            ),
            rowExpandable: (record) => record.username !== 'No expandable content', // Example: Conditionally expandable rows
        };

        return (
            <Fragment>
                <h2>
                    {this.props.record.name} guruhi{' '}
                    <a onClick={this.handleEdit}><EditOutlined /></a>{' '}
                    <Button
                        type="dashed"
                        onClick={this.handleBack}
                        icon={<ArrowLeftOutlined />}
                        style={{ float: "right", marginBottom: '5px' }}
                    >
                        Orqaga
                    </Button>
                </h2>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="id"
                    expandable={expandableConfig} // Enable expandable rows
                    pagination={{
                        current: page + 1,
                        pageSize: size,
                        total: this.state.totalElements,
                        onChange: this.handlePagination,
                        onShowSizeChange: this.handlePageSizeChange,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        responsive: true,
                        hideOnSinglePage: false,
                    }}
                    loading={loading} // Show loading spinner
                    scroll={{ x: 'max-content', y: 280 }} // Enable horizontal and vertical scrolling
                    sticky // Make header sticky
                    title={() => <strong>Student List</strong>} // Custom table title
                    footer={() => `Total Students: ${this.state.totalElements}`} // Custom table footer
                />

                <Button type="primary" onClick={this.handleAdd} icon={<UserAddOutlined />}>
                    New student
                </Button>
                <Button
                    type="primary"
                    onClick={this.handleDelete}
                    icon={<DeleteOutlined />}
                    style={{ float: "right" }}
                >
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