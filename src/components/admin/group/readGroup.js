import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Space, Table} from "antd";
import axios from "axios";
import { ArrowRightOutlined, FormOutlined} from "@ant-design/icons";
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
            totalPages: 0,
            page: 0,
            size: 10,
            searchText: '',
            isAddModalVisible: false,
            isActionsInGroupVisible:false,
            record: {},
            deletingId: 0,
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
                    })

                } else {
                    alert(dto.message)
                }
                console.log(this.state.dataSource)
            })
            .catch((err) => {
                alert(err.message)
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
                title: 'Course name',
                dataIndex: 'courseName',
                key: 'courseName',
            },
            {
                title: 'GroupsList username',
                dataIndex: 'teacherUsername',
                key: 'teacherUsername',
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
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Enter to group',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleActionsInGroup(record)}><ArrowRightOutlined /></a>
                    </Space>
                ),
            },
        ];

        const {dataSource, isAddModalVisible,isActionsInGroupVisible } = this.state;

        return (
            <div>
                {isActionsInGroupVisible ? <ActionsInGroup
                        record={this.state.record}
                        onClose={this.hideModal}
                    /> :
                    <Fragment>
                        <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                            <h2>Groups</h2>
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
                            New Group
                        </Button>
                        {isAddModalVisible && (<CreateGroupModal
                            isAddModalVisible={isAddModalVisible}
                            onSuccess={this.handleSuccess}
                            onCancel={this.hideModal}
                            onClose={this.hideModal}
                        />)}
                    </Fragment>
                }
            </div>
        );

    }
}

export default ReadGroup;