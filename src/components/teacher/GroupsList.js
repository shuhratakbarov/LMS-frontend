import React, {Component, Fragment} from "react";
import axios from "axios";
import {serverURL} from "../../server/serverConsts";
import {getToken} from "../../util/TokenUtil";
import {Button, message, Select, Table, Typography} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import TasksOfGroup from "./TasksOfGroup";
import Search from "antd/es/input/Search";

const {Title} = Typography

class GroupsList extends Component {
    constructor() {
        super();
        this.state = {
            teacher: null,
            page: 0,
            size: 10,
            totalPages: 0,
            dataSource: [],
            isStudentsOfGroupVisible: false,
            record: {},

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

    getData() {
        const {page, size} = this.state;
        let url = `${serverURL}teacher/my-groups?page=${page}&size=${size}`
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
                    totalPages: data.totalPages,
                })
            })
            .catch((err) => {
                alert(err);
                message.error(err);
            });
    }

    hideModal = () => {
        this.setState({
            isStudentsOfGroupVisible: false,
        })
    };
    handleEnter = (record) => {
        this.setState({
            isStudentsOfGroupVisible: true,
            record: record,
        })
    }
    makeCourses = () => {
        let courses = this.state.dataSource;
        const uniqueCourseIds = new Set();
        return  courses
            .filter(item => {
                if (uniqueCourseIds.has(item.courseId)) {
                    return false;
                }
                uniqueCourseIds.add(item.courseId);
                return true;
            })
            .map(item => (
                <Select.Option key={item.courseId} value={item.courseName}>
                    {item.courseName}
                </Select.Option>
            ));
    };
    handleSelectCourse = (courseId) => {
        const {page, size} = this.state;
        let url = `${serverURL}teacher/courses-of-teacher/${courseId}page=${page}&size=${size}`
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
                    totalPages: data.totalPages,
                })
            })
            .catch((err) => {
                alert(err);
                message.error(err);
            });
    }

    render() {
        const {totalPages, size, record, dataSource, isStudentsOfGroupVisible} = this.state;
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'Course',
                dataIndex: 'courseName',
                key: 'courseName',
            },
            {
                title: 'Groups',
                dataIndex: 'groupName',
                key: 'groupName'
            },
            {
                title: 'Students count',
                dataIndex: 'studentCount',
                key: 'studentCount'
            },
            {
                title: 'Enter to group',
                key: 'action',
                render: (record) => {
                    return(record?.studentCount !== 0 ?
                        <Button onClick={() => this.handleEnter(record)}><ArrowRightOutlined/> Topshiriqlar</Button> :
                        <Button disabled={true} title={"Studentlar mavjud emas"}><ArrowRightOutlined/> Topshiriqlar</Button>)
                }
            }
        ]
        return (
            <div>
                {isStudentsOfGroupVisible ? <TasksOfGroup
                    record={record}
                    onClose={this.hideModal}
                /> : <Fragment>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                        <Title style={{fontSize: "4vh"}}>Mening guruhlarim</Title>
                        <div style={{display: "flex"}}>
                            <div style={{width: '400px', float: "right", marginTop: '15px', marginRight: "1vh"}}>
                                <Select defaultValue={"All"} style={{width: "20vh", float: "right"}} >
                                    {this.makeCourses()}
                                </Select>
                            </div>
                            <div style={{width: '400px', float: "right", marginTop: '15px'}}>
                                <Search placeholder={"Qidiruv..."}/>
                            </div>
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{
                            pageSize: size,
                            total: totalPages,
                            onChange: this.handlePagination,
                        }}
                    />
                </Fragment>
                }

            </div>
        );
    }

}

export default GroupsList;