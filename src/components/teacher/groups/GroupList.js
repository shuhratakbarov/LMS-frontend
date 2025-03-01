import React, {Component, Fragment} from "react";
import axios from "axios";
import {serverURL} from "../../../server/serverConsts";
import {getToken} from "../../../util/TokenUtil";
import {Button, message, Select, Table, Typography} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import HomeworkList from "./task-list/homework-list/HomeworkList";
import Search from "antd/es/input/Search";
import TaskList from "./task-list/TaskList";


const {Title} = Typography

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: null,
            page: 0,
            size: 5,
            totalElements: 0,
            dataSource: [],
            searchText: '',
            isTaskListVisible: false,
            record: {},
            loading: true
        }
    }

    componentDidMount() {
        this.getData();
    }

    handlePagination = (e) => {
        this.setState({
            page: e - 1
        }, () => this.getData())
    }
    handlePageSizeChange = (current, size) => {
        this.setState({
            size: size,
            page: 0,
        }, () => this.getData());
    }

    onSearch = (searchText) => {
        this.setState({
            searchText: searchText,
            page: 0,
        }, () => this.getData())
    }

    getData() {
        const {page, size, searchText} = this.state;
        let url = searchText ? `${serverURL}teacher/search?keyword=${searchText}&page=${page}&size=${size}`:
            `${serverURL}teacher/my-groups?page=${page}&size=${size}`
        axios({
            url: url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let data = res.data.data
                this.setState({
                    dataSource: data.content,
                    totalElements: data.totalElements,
                    loading: false
                })
            })
            .catch((err) => {
                alert(err);
                this.setState({ loading: false }); // Hide spinner on error
            });
    }

    hideModal = () => {
        this.setState({
            isTaskListVisible: false,
        })
    };
    handleEnter = (record) => {
        this.setState({
            isTaskListVisible: true,
            record: record,
        })
    }

render() {
    const {page, size, dataSource, record, isTaskListVisible, loading, totalElements} = this.state;
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
                    { text: 'Starts with A', value: 'A' },
                    { text: 'Starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.courseName.startsWith(value), // Enable filtering
            },
            {
                title: 'Groups',
                dataIndex: 'groupName',
                key: 'groupName',
                sorter: (a, b) => a.groupName.localeCompare(b.groupName), // Enable sorting
                filters: [
                    { text: 'Starts with A', value: 'A' },
                    { text: 'Starts with B', value: 'B' },
                ],
                onFilter: (value, record) => record.groupName.startsWith(value), // Enable filtering
            },
            {
                title: 'Number of students',
                dataIndex: 'studentCount',
                key: 'studentCount',
                sorter: (a, b) => a.studentCount - b.studentCount, 
                render: (record) => {
                    return((record === 0 || record === 1 ) ?
                        record + " students" :
                        record + " students")
                }
            },
            {
                title: 'Number of tasks',
                dataIndex: 'taskCount',
                key: 'taskCount',
                sorter: (a, b) => a.taskCount - b.taskCount,
                render: (record) => {
                    return((record === 0 || record === 1 ) ?
                        record + " task" :
                        record + " tasks")
                }
            },
            {
                title: 'Tasks',
                key: 'action',
                render: (record) => {
                    return(record?.studentCount !== 0 ?
                        <Button onClick={() => this.handleEnter(record)}><ArrowRightOutlined/> Enter</Button> :
                        <Button disabled={true} title={"No students"}><ArrowRightOutlined/> Enter</Button>)
                }
            }
        ]
    const expandableConfig = {
        expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>
                <strong>Course name:</strong> {record.courseName}<br />
                <strong>Group name:</strong> {record.groupName}<br />
                <strong>Number of students:</strong> {record.studentCount}
            </p>
        ),
        rowExpandable: (record) => record.username !== 'No expandable content', // Example: Conditionally expandable rows
    };
        return (
            <div>
                {isTaskListVisible ? <TaskList
                    record={record}
                    onClose={this.hideModal}
                /> : <Fragment>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                        <Title style={{fontSize: "4vh"}}>My groups</Title>
                        <div style={{display: "flex"}}>
                            <div style={{float: "right", marginTop: '3vh'}}>
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
                            total: totalElements,
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
                        footer={() => `Total Groups: ${totalElements}`} // Custom table footer
                    />
                </Fragment>
                }
            </div>
        );
    }
}

export default GroupList;