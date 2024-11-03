import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, FormOutlined} from "@ant-design/icons";
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
            totalPages: 0,
            page: 0,
            size: 10,
            searchText: null,
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            record: {},
            deletingId: 0,
            deletingCourse: '',
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

    onSearch = (searchText) => {
        this.setState({
            searchText: searchText,
            page: 0,
        }, () => this.getData())
    }


    getData() {
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
                    })
                } else {
                    alert(dto.message)
                }
            })
            .catch((err) => {
                alert(url)
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
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Created at',
                dataIndex: 'createAt',
                key: 'createAt',
                render: createAt => formatDate(createAt),
            },
            {
                title: 'Updated at',
                dataIndex: 'updateAt',
                key: 'updateAt',
                render: updateAt => formatDate(updateAt),
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleEdit(record)}><EditOutlined/></a>
                        <a onClick={() => this.handleDelete(record.id, record.name)}><DeleteOutlined/></a>
                    </Space>
                ),
            },
        ];

        const {dataSource, isAddModalVisible, isEditModalVisible, isDeleteModalVisible} = this.state;

        return (
            <Fragment>

                <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                    <h2>Courses</h2>
                    <div style={{width: '400px', float: "right", marginTop: '15px'}}>
                        <Search placeholder={"Qidiruv..."} onSearch={(value) => this.onSearch(value)}/>
                    </div>
                </div>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: this.state.size,
                        total: this.state.totalPages,
                        onChange: this.handlePagination,
                    }}

                >
                </Table>
                <Button type="primary" onClick={this.handleAdd} icon={<FormOutlined/>}>
                    New Course
                </Button>
                {isAddModalVisible && (<CreateCourseModal
                    isAddModalVisible={isAddModalVisible}
                    onSuccess={this.handleSuccess}
                    onCancel={this.hideModal}
                    onClose={this.hideModal}
                />)}
                {isEditModalVisible && (<UpdateCourseModal
                    isEditModalVisible={isEditModalVisible}
                    record={this.state.record}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                />)}
                {isDeleteModalVisible && (<DeleteCourseModal
                    isDeleteModalVisible={isDeleteModalVisible}
                    id={this.state.deletingId}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                    deletingCourse={this.state.deletingCourse}
                />)}
            </Fragment>
        );

    }
}

export default ReadCourse;