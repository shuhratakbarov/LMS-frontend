import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Select, Space, Table, Tag} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, UserAddOutlined, EyeOutlined} from "@ant-design/icons";
import CreateStudentModal from "./createStudent";
import UpdateStudentModal from "./updateStudent";
import DeleteStudentModal from "./deleteStudent";
import ViewGroupsOfStudent from "./ViewGroupsOfStudent";
import {serverURL} from "../../../server/serverConsts";
import Search from "antd/es/input/Search";
import {getToken} from "../../../util/TokenUtil";
import {formatDate} from "../../../const/FormatDate";

class ReadStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalElements: 0,
            isActive:"true",
            page: 0,
            size: 5,
            searchText: '',
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isViewGroupsModalVisible: false,
            record: {},
            deleteId: '',
            deleteName: "students",
            viewGroupsId: '',
            studentName: "students",
            loading: true
        };
    }

    hideModal = () => {
        this.setState({
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isViewGroupsModalVisible: false,
        })
    };

    onSearch = (searchText) => {
        this.setState({
            searchText: searchText,
            page: 0,
        }, () => this.getData())
    }
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
        const {isActive, page, size, searchText} = this.state;
        let url = searchText ? `${serverURL}admin/search/3?activity=${isActive}&searching=${searchText}&page=${page}&size=${size}`
            : `${serverURL}admin/list/3?activity=${isActive}&page=${page}&size=${size}`;
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
                        loading: false,
                    })

                } else {
                    alert("studentlar, get mapping :" + dto.message);
                    this.setState({ loading: false }); // Hide spinner on error
                }
            })
            .catch((err) => {
                alert(err.message);
                this.setState({ loading: false }); // Hide spinner on error
            });
    }

    componentDidMount() {
        this.getData();
    }

    handleSuccess = () => {
        this.getData();
    };
    handleAdd = () => {
        this.setState({
            isAddModalVisible: true,
        });
    };

    handleEdit = (record) => {
        this.setState({
            isEditModalVisible: true,
            record: record,
        });
    };

    handleDelete = (id, firstName) => {
        this.setState({
            isDeleteModalVisible: true,
            deleteId: id,
            deleteName: firstName,
        });
    };
    handleViewGroup = (record) => {
        this.setState({
            isViewGroupsModalVisible: true,
            studentName: record.firstName,
            viewGroupsId: record.id,
        });
        return <ViewGroupsOfStudent/>
    }
    handleIsActive = (isActive) =>{
        // document.getElementById("search").innerHTML = '';
        this.setState({
            isActive: isActive,
            searchText: '',
        },()=>{this.getData()})
    }
    render() {
        const {
            page,
            size,
            dataSource,
            isAddModalVisible,
            isEditModalVisible,
            isDeleteModalVisible,
            isViewGroupsModalVisible,
            loading,
        } = this.state;

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
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                sorter: (a, b) => a.phone.localeCompare(b.phone), // Enable sorting
                filters: [
                    { text: 'Starts with +998', value: '+998' },
                    { text: 'Starts with +1', value: '+1' },
                ],
                onFilter: (value, record) => record.phone.startsWith(value), // Enable filtering
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                sorter: (a, b) => a.email.localeCompare(b.email), // Enable sorting
                filters: [
                    { text: 'Gmail', value: 'gmail.com' },
                    { text: 'Yahoo', value: 'yahoo.com' },
                ],
                onFilter: (value, record) => record.email.includes(value), // Enable filtering
            },
            // {
            //     title: 'Tags',
            //     key: 'tags',
            //     dataIndex: 'tags',
            //     render: (_, { tags }) => (
            //         <>
            //             {tags.map((tag) => {
            //                 let color = tag.length > 5 ? 'geekblue' : 'green';
            //                 if (tag === 'loser') {
            //                     color = 'volcano';
            //                 }
            //                 return (
            //                     <Tag color={color} key={tag}>
            //                         {tag.toUpperCase()}
            //                     </Tag>
            //                 );
            //             })}
            //         </>
            //     ),
            // },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleViewGroup(record)}><EyeOutlined title={'View groups'} /></a>
                        <a onClick={() => this.handleEdit(record)}><EditOutlined title={'Edit'}/></a>
                        <a onClick={() => this.handleDelete(record.id, record.firstName)}><DeleteOutlined title={'Delete'}/></a>
                    </Space>
                ),
            },
        ];

        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Address:</strong> {record.address}<br />
                    <strong>Birth Date:</strong> {record.birthDate}<br />
                    <strong>Added at:</strong> {formatDate(record.createAt)}<br />
                    <strong>Edited at:</strong> {formatDate(record.updateAt)}
                </p>
            ),
            rowExpandable: (record) => record.username !== 'No expandable content', // Example: Conditionally expandable rows
        };

        return (
            <Fragment>
                <div style={{ width: '100%', display: "flex", justifyContent: "space-between" }}>
                    <h2>Students</h2>
                    <div style={{ display: "flex" }}>
                        <div style={{ float: "right", marginTop: '3vh', marginRight: "1vh" }}>
                            <Select
                                onChange={(value) => { this.handleIsActive(value) }}
                                defaultValue={"Active"}
                                style={{ width: "20vh", float: "right" }}
                            >
                                <Select.Option value={"true"}>Active</Select.Option>
                                <Select.Option value={"false"}>Not active</Select.Option>
                                <Select.Option value={"all"}>All</Select.Option>
                            </Select>
                        </div>
                        <div style={{ float: "right", marginTop: '3vh' }}>
                            <Search
                                placeholder={"Qidiruv..."}
                                onSearch={(value) => this.onSearch(value)}
                                enterButton
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
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
                    New Student
                </Button>
                {isAddModalVisible && (<CreateStudentModal
                    isAddModalVisible={isAddModalVisible}
                    onSuccess={this.handleSuccess}
                    onCancel={this.hideModal}
                    onClose={this.hideModal}
                />)}
                {isEditModalVisible && (<UpdateStudentModal
                    isEditModalVisible={isEditModalVisible}
                    record={this.state.record}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                />)}
                {isDeleteModalVisible && (<DeleteStudentModal
                    isDeleteModalVisible={isDeleteModalVisible}
                    id={this.state.deleteId}
                    name={this.state.deleteName}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                />)}
                {isViewGroupsModalVisible && (<ViewGroupsOfStudent
                    isViewGroupsModalVisible={isViewGroupsModalVisible}
                    studentId={this.state.viewGroupsId}
                    name={this.state.studentName}
                    onClose={this.hideModal}
                />)}
            </Fragment>
        );
    }
}

export default ReadStudent;