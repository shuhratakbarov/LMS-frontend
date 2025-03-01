import React, {Fragment} from "react";
import {Component} from "react";
import {Button, message, Space, Table} from "antd";
import axios from "axios";
import {ArrowRightOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import Homework from "./task-list/Homework";
import {formatDate} from "../../../const/FormatDate";


class MyGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 5,
            totalElements: 0,
            dataSource: [],
            searchText: '',
            isHomeworkVisible: false,
            record: {},
            loading: true
        };
    }

    hideModal = () => {
        this.setState({
            isHomeworkVisible: false,
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
        let url = searchText ? `${serverURL}student/search?keyword=${searchText}&page=${page}&size=${size}`
            : `${serverURL}student/my-groups?page=${page}&size=${size}`
        axios({
            url: url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let dto = res.data;
                console.log(dto)
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
                message.error(err);
                this.setState({ loading: false }); // Hide spinner on error
            });
    }

    componentDidMount() {
        this.getData();
    }

    handleSuccess = () => {
        this.getData();
    }

    handleHomework = (record) => {
        this.setState({
            isHomeworkVisible: true,
            record: record,
        });
    };

    render() {
        const {page, size, dataSource, isHomeworkVisible, record, loading} = this.state;

        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => (page * size) + index + 1,
            },
            {
                title: 'Course',
                dataIndex: 'courseName',
                key: 'courseName',
                sorter: (a, b) => a.courseName.localeCompare(b.courseName), // Enable sorting
                filters: [
                    { text: 'Name starts with A', value: 'A' },
                    { text: 'Name starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.courseName.startsWith(value), // Enable filtering
            },
            {
                title: 'Group',
                dataIndex: 'groupName',
                key: 'groupName',
                sorter: (a, b) => a.groupName.localeCompare(b.groupName), // Enable sorting
                filters: [
                    { text: 'Name starts with A', value: 'A' },
                    { text: 'Name starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.groupName.startsWith(value), // Enable filtering
            },
            {
                title: 'Teacher',
                dataIndex: 'teacherName',
                key: 'teacherName',
                sorter: (a, b) => a.teacherName.localeCompare(b.teacherName), // Enable sorting
                filters: [
                    { text: 'Name starts with A', value: 'A' },
                    { text: 'Name starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.teacherName.startsWith(value), // Enable filtering
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <Button onClick={() => this.handleHomework(record)}><ArrowRightOutlined/> Tasks</Button>
                    </Space>
                ),
            },
        ];

        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Teacher : </strong> {record.teacherName}<br />
                    <strong>Group : </strong> {record.groupName}<br />
                    <strong>Course : </strong> {record.courseName}
                </p>
            ),
            rowExpandable: (record) => record.description !== 'No expandable content', // Example: Conditionally expandable rows
        };

        return (<div>
            {isHomeworkVisible ? <Homework
                isHomeworkVisible={isHomeworkVisible}
                onSuccess={this.handleSuccess}
                onClose={this.hideModal}
                record={record}
            /> : <Fragment>
                <div style={{ width: '100%', display: "flex", justifyContent: "space-between" }}>
                    <h2>My groups</h2>
                    <div style={{float: "right", marginTop: '3vh' }}>
                        <Search
                            placeholder="Search..."
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
            </Fragment>}

        </div>);
    }
}

export default MyGroups;