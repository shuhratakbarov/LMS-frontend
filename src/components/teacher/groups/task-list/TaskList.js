import React, {Component, Fragment} from "react";
import axios from "axios";
import {getToken} from "../../../../util/TokenUtil";
import {Button, message, Select, Space, Table, Tooltip} from "antd";
import {serverURL} from "../../../../server/serverConsts";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined
} from "@ant-design/icons";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import HomeworkList from "./homework-list/HomeworkList";

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalElements: 0,
            page: 0,
            size: 5,
            groupName: props.record.groupName,
            groupId: props.record.id,
            record: null,
            taskId: null,//---------------<
            isAddTaskVisible: false,
            isEditTaskVisible: false,
            isDeleteTaskVisible: false,
            isHomeworkListVisible: false,
            file: null,
            fileData: null,
            error: null,
            maxBall: 10,
            loading: true,
            deletingId: 0,
            deletingTask: ''
        }
    }

    componentDidMount() {
        this.getData();
    }

    handleAddTask = () => {
        this.setState({
            isAddTaskVisible: true,
        })
    }

    handleEdit = (record) => {
        this.setState({
            isEditTaskVisible: true,
            record: record,
        });
    };

    handleDelete = (id, name) => {
        this.setState({
            isDeleteTaskVisible: true,
            deletingId: id,
            deletingTask: name,
        });
    };

    hideModal = () => {
        this.setState({
            isAddTaskVisible: false,
            isEditTaskVisible: false,
            isDeleteTaskVisible: false,
            isHomeworkListVisible: false,
        })
    }

    handleBack = () => {
        this.props.onClose();
    };

    handleDownload = (fileId, fileName) => {
        let url = serverURL + `download/${this.state.groupId}?fileId=` + fileId;
        axios({
            url: url,
            method: "GET",
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                const blob = new Blob([res.data]);
                const fileUrl = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = fileUrl;
                tempLink.setAttribute('download', fileName);
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            })
            .catch((err) => {
                alert('Error downloading file: ' + err);
            });
    }

    handleSuccess = () => {
        this.getData();
    }

    handleEnter = (record) => {
        this.setState({
            isHomeworkListVisible: true,
            record: record,
        })
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
        let url = serverURL + `teacher/tasks?groupId=` + this.state.groupId;
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
                    dataSource: data,
                    totalElements: data.length,
                    loading: false
                })
            })
            .catch((err) => {
                this.setState({ loading: false }); // Hide spinner on error
                alert('error message : ' + err)
            });
    }

    render() {
        const {page, size, record, dataSource, isAddTaskVisible, isEditTaskVisible, isDeleteTaskVisible, isHomeworkListVisible, loading, groupId} = this.state;
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => (page * size) + index + 1,
            },
            {
                title: 'Name',
                dataIndex: 'taskName',
                key: 'taskName',
            },
            {
                title: 'Deadline',
                dataIndex: 'deadline',
                key: 'deadline',
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'Max ball',
                // dataIndex: 'maxBall',
                key: 'maxBall',
                sorter: (a, b) => a.maxBall - b.maxBall, // Enable sorting by date
                render: (record) => (
                    <Tooltip title={record.description}>
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '0.5vh 1.2vh 0.5vh 1.2vh',
                                textAlign: "center",
                                justifyContent: "center",
                                width: "6vh",
                                height: "4.5vh",
                                border: '1px solid #ccc',
                                borderRadius: '1vh',
                                background: '#f0f0f0',
                                color: '#333',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                        >
                            {record.maxBall != null ? record.maxBall : <span>&nbsp;&nbsp;</span>}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Attachment',
                key: 'fileName',
                render: (record) => {
                    const fileSize = record.size;
                    const displaySize = fileSize < 1024 ? `${fileSize} Bytes` :
                        fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(2)} KB` :
                            `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                    return (record.fileName == null ? <Button type={"default"} style={{width: "15vh"}} disabled={true}>
                                Yuklanmagan
                            </Button> :
                            <Tooltip title={record.fileName}>
                                <Button
                                    type="primary"
                                    style={{
                                        display: 'flex',
                                        width: "15vh",
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onClick={()=>this.handleDownload(record.pkey, record.fileName)}
                                >
                                    <div style={{ display: "flex" }}>
                                        <DownloadOutlined />&nbsp;
                                        <div >{displaySize}</div>
                                    </div>
                                </Button>
                            </Tooltip>
                    );
                },
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
            {
                title: 'Homework',
                key: 'action',
                render: (record) => {
                    return(
                        <Button onClick={() => this.handleEnter(record)}><ArrowRightOutlined/> Enter</Button>
                    )
                }
            }
        ];
        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Created At: </strong> {record.createdAt}<br />
                    <strong>Updated At: </strong> {record.updatedAt}
                </p>
            ),
            rowExpandable: (record) => record.username !== 'No expandable content', // Example: Conditionally expandable rows
        };
        return (
<div>
    {isHomeworkListVisible ? <HomeworkList
        record={record}
        groupId={groupId}
        onClose={this.hideModal}
    /> : <Fragment>
        <h2>{this.state.groupName} guruhi
            <Button
                type="dashed" onClick={this.handleBack} icon={<ArrowLeftOutlined/>}
                style={{float: "right", marginBottom: '0.5vh'}}>
                Orqaga
            </Button></h2>

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
            title={() => <strong>Task List</strong>} // Custom table title
            footer={() => `Total Tasks: ${this.state.totalElements}`} // Custom table footer
        />
        <Button type={"primary"} icon={<PlusOutlined/>} onClick={this.handleAddTask}>New task</Button>
        {
            isAddTaskVisible && <CreateTask
                isAddTaskVisible={isAddTaskVisible}
                onClose={this.hideModal}
                onSuccess={this.handleSuccess}
                groupId={this.state.groupId}
            />
        }
        {isEditTaskVisible && (
            <EditTask
                isEditTaskVisible={isEditTaskVisible}
                record={this.state.record}
                onClose={this.hideModal}
                onSuccess={this.handleSuccess}
            />
        )}
        {isDeleteTaskVisible && (
            <DeleteTask
                isDeleteTaskVisible={isDeleteTaskVisible}
                record={this.state.record}
                onClose={this.hideModal}
                onSuccess={this.handleSuccess}
            />
        )}
    </Fragment>
    }
</div>

        );
    }
}

export default TaskList;