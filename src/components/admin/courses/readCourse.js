import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import CreateCourseModal from "./createCourse";
import UpdateCourseModal from "./updateCourse";
import DeleteCourseModal from "./deleteCourse";
import {serverURL} from "../../../server/serverConsts";
import Search from "antd/es/input/Search";
import {getToken} from "../../../util/TokenUtil";
import {formatDate} from "../../../const/FormatDate";

class ReadCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalElements: 0,
            page: 0,
            size: 5,
            searchText: null,
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            record: {},
            deletingId: 0,
            deletingCourse: '',
            loading: true
        };
    }

    hideModal = () => {
        this.setState({
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
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

    onSearch = (searchText) => {
        this.setState({
            searchText: searchText,
            page: 0,
        }, () => this.getData())
    }


    getData() {
        this.setState({ loading: true }); // Show spinner
        const {page, size, searchText} = this.state;
        let url = searchText ? `${serverURL}admin/course/search?searching=${searchText}&page=${page}&size=${size}`
            : `${serverURL}admin/course/list?page=${page}&size=${size}`
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
                        dataSource: dto.data.content,
                        totalElements: dto.data.totalElements,
                        loading: false, // Hide spinner
                    })
                } else {
                    alert(dto.message);
                    this.setState({ loading: false }); // Hide spinner on error
                }
            })
            .catch((err) => {
                // alert(url);
                this.setState({ loading: false }); // Hide spinner on error
            });
    }

    componentDidMount() {
        this.getData();
    }
    handleSuccess=()=>{
        this.getData();
    }

    handleAdd = () => {
        this.setState({
            isAddModalVisible: true,
        });
    };

    handleEdit = (record) => {
        console.log(record);
        this.setState({
            isEditModalVisible: true,
            record: record,
        });
    };

    handleDelete = (id, name) => {
        this.setState({
            isDeleteModalVisible: true,
            deletingId: id,
            deletingCourse: name,
        });
    };

    render() {
        const { page, size, dataSource, isAddModalVisible, isEditModalVisible, isDeleteModalVisible, loading } = this.state;

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
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
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
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleEdit(record)}><EditOutlined /></a>
                        <a onClick={() => this.handleDelete(record.id, record.name)}><DeleteOutlined /></a>
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
            <Fragment>
                <div style={{ width: '100%', display: "flex", justifyContent: "space-between" }}>
                    <h2>Courses</h2>
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
                    title={() => <strong>Course List</strong>} // Custom table title
                    footer={() => `Total Courses: ${this.state.totalElements}`} // Custom table footer
                />

                <Button type="primary" onClick={this.handleAdd} icon={<PlusOutlined />}>
                    New Course
                </Button>

                {isAddModalVisible && (
                    <CreateCourseModal
                        isAddModalVisible={isAddModalVisible}
                        onSuccess={this.handleSuccess}
                        onCancel={this.hideModal}
                        onClose={this.hideModal}
                    />
                )}
                {isEditModalVisible && (
                    <UpdateCourseModal
                        isEditModalVisible={isEditModalVisible}
                        record={this.state.record}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                    />
                )}
                {isDeleteModalVisible && (
                    <DeleteCourseModal
                        isDeleteModalVisible={isDeleteModalVisible}
                        id={this.state.deletingId}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                        deletingCourse={this.state.deletingCourse}
                    />
                )}
            </Fragment>
        );
    }
}

export default ReadCourse;