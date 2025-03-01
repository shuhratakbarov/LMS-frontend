import React, {Component, Fragment} from "react";
import axios from "axios";
import {getToken} from "../../../../../util/TokenUtil";
import {Button, message, Select, Table, Tooltip} from "antd";
import {serverURL} from "../../../../../server/serverConsts";
import {ArrowLeftOutlined, DownloadOutlined, PlusOutlined} from "@ant-design/icons";
import EvaluateHomework from "./EvaluateHomework";
import CreateTask from "../CreateTask";
import UpdateEvaluatedHomework from "./UpdateEvaluatedHomework";
import {formatDate} from "../../../../../const/FormatDate";

class HomeworkList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalElements: 0,
            page: 0,
            size: 5,
            record: null,
            groupId: props.groupId,
            taskId: props.record.id,
            deadline: props.record.deadline,
            maxBall: props.record.maxBall,
            taskName:props.record.taskName,
            isEvaluateVisible: false,
            isUpdateEvaluateVisible: false,
            homework: {
                homeworkBall: 0,
                description: '',
            },
            homeworkId: null,
            file: null,
            fileData: null,
            error: null,
            loading: true,
            expandedRowKeys: [],
        }
    }


    componentDidMount() {
        this.getData();
    }

    handleBack = () => {
        this.props.onClose();
    };

    hideModal = () => {
        this.setState({
            isEvaluateVisible: false,
            isUpdateEvaluateVisible: false,
        })
    }

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


    handleEvaluate = (homeworkId, maxBall) => {
        this.setState({
            isEvaluateVisible: true,
            homeworkId: homeworkId,
            maxBall: maxBall,
        })
    }
    handleChangeEvaluation = (ball, description, homeworkId,maxBall) => {
        let homework = {};
        homework.homeworkBall = ball;
        homework.description = description;
        this.setState({
            isUpdateEvaluateVisible: true,
            homework: homework,
            homeworkId: homeworkId,
            maxBall: maxBall,
        });
    };

    handleSuccess = () => {
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
            page: 0, // Reset to the first page
        }, () => this.getData());
    }


    getData() {
        let url = serverURL + `teacher/homework/` +this.state.taskId+ '?groupId=' + this.state.groupId;
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
                this.setState({ loading: false }); // Hide spinner on error
                alert('error message : ' + err)
            });
    }

    render() {
        const {page, size, dataSource, isEvaluateVisible, isUpdateEvaluateVisible, homework, loading} = this.state;
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
                title: 'Ball',
                key: 'ball',
                sorter: (a, b) => a.ball - b.ball, // Enable sorting by date
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
                            {record.ball != null ? record.ball : <span>&nbsp;&nbsp;</span>}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Attachment',
                key: 'homeworkName',
                render: (record) => {
                    const fileSize = record.homeworkFileSize;
                    const displaySize = fileSize < 1024 ? `${fileSize} Bytes` :
                        fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(2)} KB` :
                            `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                    return (record.homeworkFileName == null ? <Button type={"default"} style={{width: "15vh"}} disabled={true}>
                                Yuklanmagan
                            </Button> :
                        <Tooltip title={record.homeworkFileName}>
                            <Button
                                type="primary"
                                style={{
                                    display: 'flex',
                                    width: "15vh",
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={()=>this.handleDownload(record.homeworkFileId, record.homeworkFileName)}
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
                render: (record) => {
                    if (record.homeworkFileName != null && record.ball == null && new Date(this.state.deadline) > new Date()) {
                        return (
                            <Button type={"default"} onClick={()=>this.handleEvaluate(record.homeworkId, record.maxBall)}>
                                Baholash
                            </Button>
                        );
                    }
                    if (record.ball != null && record.homeworkFileName != null && new Date(this.state.deadline) > new Date()) {
                        return (
                            <Button type={"default"} onClick={() =>this.handleChangeEvaluation(record.ball,record.description, record.homeworkId, this.state.maxBall)}>
                                O'zgartirish
                            </Button>
                        );
                    } else {
                        return (
                            <Button title={"Muddati o'tib ketgan"} disabled={true} type={"default"}>
                                Baholash
                            </Button>
                        );
                    }
                }
            }
        ];
        const expandableConfig = {
            expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                    <strong>Phone:</strong> {record.phone}<br />
                    <strong>Email:</strong> {record.email}
                </p>
            ),
            rowExpandable: (record) => record.username !== 'No expandable content', // Example: Conditionally expandable rows
        };
        return (
            <Fragment>
                <h2>{this.state.taskName} topshirig'i
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
                    title={() => <strong>Homework List</strong>} // Custom table title
                    footer={() => `Total Homework: ${this.state.totalElements}`} // Custom table footer
                />
                {
                    isEvaluateVisible && <EvaluateHomework
                        isEvaluateVisible={isEvaluateVisible}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                        homeworkId={this.state.homeworkId}
                        maxBall={this.state.maxBall}
                    />
                }
                {
                    isUpdateEvaluateVisible && <UpdateEvaluatedHomework
                        isUpdateEvaluateVisible={isUpdateEvaluateVisible}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                        homework={homework}
                        homeworkId={this.state.homeworkId}
                        maxBall={this.state.maxBall}
                    />
                }
            </Fragment>
        );
    }
}

export default HomeworkList;