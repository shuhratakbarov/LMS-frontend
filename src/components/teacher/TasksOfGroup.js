import React, {Component, Fragment} from "react";
import axios from "axios";
import {getToken} from "../../util/TokenUtil";
import {Button, message, Select, Table, Tooltip} from "antd";
import {serverURL} from "../../server/serverConsts";
import {ArrowLeftOutlined, FormOutlined, DownloadOutlined} from "@ant-design/icons";
import EvaluateHomework from "./EvaluateHomework";
import CreateTask from "./CreateTask";
import UpdateEvaluatedHomework from "./UpdateEvaluatedHomework";


class TasksOfGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalPages: 0,
            page: 0,
            size: 10,
            record: props.record,
            taskId: null,
            isEvaluateVisible: false,
            isAddTaskVisible: false,
            isUpdateEvaluateVisible: false,
            homework: {
                homeworkBall: 0,
                description: '',
            },
            tasks: <Select.Option key={1}>biroz kuting, bu topshiriq emas!</Select.Option>,
            homeworkId: null,
            file: null,
            fileData: null,
            error: null,
            maxBall: 10,
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
            isAddTaskVisible: false,
            isUpdateEvaluateVisible: false,
        })
    }

    handleDownload = (fileId, fileName) => {
        let url = serverURL + `download/${this.props.record.id}?fileId=` + fileId;
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
    handleAddTask = () => {
        this.setState({
            isAddTaskVisible: true,
        })
    }
    handleSuccess = () => {
        this.getData();
    }
    handleChangeTask = (e) => {
        this.setState({
            taskId: e,
        }, this.getData);

    };

    getData() {
        let url = serverURL + `teacher/students-of-group/` + this.state.record.id + "?taskId=" + this.state.taskId;
        axios({
            url: url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let data = res.data.data
                console.log(data);
                this.setState({
                    dataSource: data.content,
                })
            })
            .catch((err) => {
                console.log(err);
                alert('error message : ' + err)
            });
    }

    fetchTasks=()=> {
        let url = serverURL + `teacher/list-of-tasks/` + this.state.record.id;
        axios({
            url: url,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let dto = res.data
                if (dto.success) {
                    const jsonData = dto.data;
                    const mappedOptions = jsonData.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                    ));
                    this.setState({
                        tasks: mappedOptions,
                    })
                } else {
                    message.error(dto.message);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('error message : ' + err)
            });
    }

    render() {
        const {dataSource, size, totalPages, isEvaluateVisible, isAddTaskVisible, isUpdateEvaluateVisible, homework} = this.state;
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
                key: 'firstName'
            },
            {
                title: 'Last name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: 'Ball',
                key: 'homeworkBall',
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
                            {record.homeworkBall != null ? record.homeworkBall : <span>&nbsp;&nbsp;</span>}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Homework',
                key: 'homeworkName',
                render: (record) => {
                    const fileSize = record.homeworkSize;
                    const displaySize = fileSize < 1024 ? `${fileSize} Bytes` :
                        fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(2)} KB` :
                            `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                    return (record.homeworkName == null ? <Button type={"default"} style={{width: "15vh"}} disabled={true}>
                                Yuklanmagan
                            </Button> :
                        <Tooltip title={record.homeworkName}>
                            <Button
                                type="primary"
                                style={{
                                    display: 'flex',
                                    width: "15vh",
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={()=>this.handleDownload(record.homeworkFileId, record.homeworkName)}
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
                    if (record.homeworkName != null && record.homeworkBall == null && new Date(record.deadline) > new Date()) {
                        return (
                            <Button type={"default"} onClick={()=>this.handleEvaluate(record.homeworkId, record.maxBall)}>
                                Baholash
                            </Button>
                        );
                    }
                    if (record.homeworkBall != null && record.homeworkName != null && new Date(record.deadline) > new Date()) {
                        return (
                            <Button type={"default"} onClick={() =>this.handleChangeEvaluation(record.homeworkBall,record.description, record.homeworkId, record.maxBall)}>
                                O'zgartirish
                            </Button>
                        );
                    } else {
                        return (
                            <Button disabled={true} type={"default"}>
                                Baholash
                            </Button>
                        );
                    }
                }
            }

        ];
        let task = dataSource[0];
        return (
            <Fragment>
                <h2>{this.props.record.groupName} guruhi
                    <Button
                        type="dashed" onClick={this.handleBack} icon={<ArrowLeftOutlined/>}
                        style={{float: "right", marginBottom: '5px'}}>
                        Orqaga
                    </Button></h2>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "2vh", marginTop: "5vh"}}>
                    <Tooltip title={task?.taskName}>
                        <Select value={task?.taskName} style={{width: "25vh"}} onClick={this.fetchTasks}
                                onChange={(value) => this.handleChangeTask(value)}>
                            {this.state.tasks}
                        </Select>
                    </Tooltip>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: "white",
                            color: '#333',
                            marginRight: '8px',
                        }}
                    >
                        Deadline : <b>{task?.deadline}</b>
                    </span>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: 'white',
                            color: '#333',
                        }}
                    >
                        Max ball : <b>{task?.maxBall}</b>
                    </span>

                    {task?.taskFileName ? (
                        <Tooltip title={task?.taskFileName}>
                            <Button
                                type="primary"
                                style={{ width: '15vh' }}
                                value={task?.taskPathUrl}
                                onClick={()=>this.handleDownload(task?.taskFileId, task?.taskFileName)}
                            >
                                <DownloadOutlined />
                                {task?.taskFileSize < 1024
                                    ? `${task?.taskFileSize} Bytes`
                                    : task?.taskFileSize < 1024 * 1024
                                        ? `${(task?.taskFileSize / 1024).toFixed(2)} KB`
                                        : `${(task?.taskFileSize / (1024 * 1024)).toFixed(2)} MB`}{' '}
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button disabled type="default">
                            Yuklanmagan
                        </Button>
                    )}

                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: size,
                        total: totalPages,
                        onChange: this.handlePagination,
                    }}
                />
                <Button type={"primary"} icon={<FormOutlined/>} onClick={this.handleAddTask}>New task</Button>
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
                {
                    isAddTaskVisible && <CreateTask
                        isAddTaskVisible={isAddTaskVisible}
                        onClose={this.hideModal}
                        onSuccess={this.handleSuccess}
                        groupId={this.state.record.id}
                    />
                }
            </Fragment>

        );
    }
}

export default TasksOfGroup;