import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import {ArrowRightOutlined, PlusOutlined} from "@ant-design/icons";
import CreateGroupModal from "./createGroup";
import {serverURL} from "../../../server/serverConsts";
import Search from "antd/es/input/Search";
import {getToken} from "../../../util/TokenUtil";
import ActionsInGroup from "./ActionsInGroup";
import {formatDate} from "../../../const/FormatDate";


class ReadGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalElements: 0,
            page: 0,
            size: 5,
            searchText: '',
            isAddModalVisible: false,
            isActionsInGroupVisible:false,
            record: {},
            deletingId: 0,
            loading: true
        };
    }
    hideModal = () => {
        this.setState({
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isActionsInGroupVisible: false,
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
        const {page, size, searchText} = this.state;
        let url = searchText ? `${serverURL}admin/group/search?searching=${searchText}&page=${page}&size=${size}`
            : `${serverURL}admin/group/list?page=${page}&size=${size}`;
        axios({
            url:url ,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let dto = res.data;
                if (dto.success) {
                    this.setState({
                        dataSource: dto.data.content,
                        totalElements: dto.data.totalElements,
                        loading: false,
                    })
                } else {
                    alert(dto.message);
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
    handleActionsInGroup = (record) => {
        this.setState({
            isActionsInGroupVisible: true,
            record: record,
        });
    };
    render() {
        const { page, size, dataSource, isAddModalVisible, isActionsInGroupVisible, loading } = this.state;

        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => (page * size) + index + 1,
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name), // Enable sorting
                filters: [
                    { text: 'Name starts with A', value: 'A' },
                    { text: 'Name starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.name.startsWith(value), // Enable filtering
            },
            {
                title: 'Course',
                dataIndex: 'courseName',
                key: 'courseName',
                sorter: (a, b) => a.courseName.localeCompare(b.courseName), // Enable sorting
                filters: [
                    { text: 'Course 1', value: 'Course 1' },
                    { text: 'Course 2', value: 'Course 2' },
                ],
                onFilter: (value, record) => record.courseName === value, // Enable filtering
            },
            {
                title: 'Teacher',
                dataIndex: 'teacherUsername',
                key: 'teacherUsername',
                filters: [
                    { text: 'Teacher 1', value: 'Teacher 1' },
                    { text: 'Teacher 2', value: 'Teacher 2' },
                ],
                onFilter: (value, record) => record.teacherUsername === value, // Enable filtering
            },
            {
                title: 'Created at',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: createdAt => formatDate(createdAt),
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Enable sorting by date
            },
            {
                title: 'Updated at',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                render: updatedAt => formatDate(updatedAt),
                sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt), // Enable sorting by date
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '->',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleActionsInGroup(record)}><ArrowRightOutlined /></a>
                    </Space>
                ),
            },
        ];

        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Description:</strong> {record.description}<br />
                    <strong>Created At:</strong> {formatDate(record.createdAt)}<br />
                    <strong>Updated At:</strong> {formatDate(record.updatedAt)}
                </p>
            ),
            rowExpandable: (record) => record.description !== 'No expandable content', // Example: Conditionally expandable rows
        };

        return (
            <div>
                {isActionsInGroupVisible ? (
                    <ActionsInGroup
                        record={this.state.record}
                        onClose={this.hideModal}
                    />
                ) : (
                    <Fragment>
                        <div style={{ width: '100%', display: "flex", justifyContent: "space-between" }}>
                            <h2>Groups</h2>
                            <div style={{float: "right", marginTop: '3vh' }}>
                                <Search
                                    placeholder="Qidiruv..."
                                    onSearch={(value) => this.onSearch(value)}
                                    enterButton
                                    style={{ width: '100%' }}
                                />
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
                            title={() => <strong>Group List</strong>} // Custom table title
                            footer={() => `Total Groups: ${this.state.totalElements}`} // Custom table footer
                        />

                        <Button type="primary" onClick={this.handleAdd} icon={<PlusOutlined />}>
                            New Group
                        </Button>

                        {isAddModalVisible && (
                            <CreateGroupModal
                                isAddModalVisible={isAddModalVisible}
                                onSuccess={this.handleSuccess}
                                onCancel={this.hideModal}
                                onClose={this.hideModal}
                            />
                        )}
                    </Fragment>
                )}
            </div>
        );
    }
}

export default ReadGroup;