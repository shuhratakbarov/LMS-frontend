import { useState, useCallback, useEffect } from "react";
import {
    Col, Avatar, Empty, Row, Tag, Tooltip, message, Table,
    Button, Typography, Space, Card, Statistic, List
} from "antd";
import {
    ArrowRightOutlined, ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
    CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined, TeamOutlined,
    BookOutlined, StarOutlined, DownloadOutlined
} from "@ant-design/icons";
import { download, getTeacherTaskList } from "../../../../services/api-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TeacherTaskList = () => {
    const { groupId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState();
    const [totalElements, setTotalElements] = useState();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
    const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
    const [isDeleteTaskVisible, setIsDeleteTaskVisible] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState({});
    const [taskToDelete, setTaskToDelete] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    const record = state?.record;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getTeacherTaskList(groupId);
            const { data } = response.data;
            setDataSource(data);
            setTotalElements(data.length);
        } catch (err) {
            message.error(err.message || "An error occurred while fetching tasks");
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await download(groupId, fileId);
            const blob = new Blob([response.data]);
            const fileUrl = window.URL.createObjectURL(blob);
            const tempLink = document.createElement("a");
            tempLink.href = fileUrl;
            tempLink.setAttribute("download", fileName);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        } catch (err) {
            message.error(err.message || "Error downloading file");
        }
    };

    const handleAddTask = () => setIsAddTaskVisible(true);
    const handleEdit = (record) => {
        setTaskToEdit(record);
        setIsEditTaskVisible(true);
    };
    const handleDelete = (record) => {
        setTaskToDelete(record);
        setIsDeleteTaskVisible(true);
    };
    const handleBack = () => navigate("/teacher/groups");
    const hideModal = () => {
        setIsAddTaskVisible(false);
        setIsEditTaskVisible(false);
        setIsDeleteTaskVisible(false);
    };
    const handleSuccess = () => {
        fetchData();
        hideModal();
    };
    const handlePagination = (newPage) => setPage(newPage - 1);
    const handlePageSizeChange = (current, newSize) => {
        setSize(newSize);
        setPage(0);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "easy":
                return "#52c41a";
            case "medium":
                return "#faad14";
            case "hard":
                return "#ff4d4f";
            default:
                return "#d9d9d9";
        }
    };

    const getTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case "assignment":
                return <FileTextOutlined />;
            case "lab report":
                return <BookOutlined />;
            case "quiz":
                return <TrophyOutlined />;
            case "project":
                return <StarOutlined />;
            default:
                return <FileTextOutlined />;
        }
    };

    const isOverdue = (deadline) => {
        return new Date(deadline) < new Date();
    };

    const getDaysUntilDeadline = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const getDifficulty = (maxBall) => {
        if (maxBall >= 12) return "hard";
        if (maxBall >= 7) return "medium";
        return "easy";
    };

    const MobileTaskCard = ({ record, index }) => {
        const daysLeft = getDaysUntilDeadline(record.deadline);
        const overdue = isOverdue(record.deadline);
        const difficulty = getDifficulty(record.maxBall);
        const fileSize = record.size;
        const displaySize =
            fileSize < 1024
                ? `${fileSize}B`
                : fileSize < 1024 * 1024
                    ? `${(fileSize / 1024).toFixed(0)}KB`
                    : `${(fileSize / (1024 * 1024)).toFixed(1)}MB`;

        return (
            <Card
                style={{
                    marginBottom: 12,
                    borderRadius: 12,
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
                bodyStyle={{ padding: 16 }}
            >
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 10,
                        flexShrink: 0
                    }}>
                        {page * size + index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 6
                        }}>
                            <Avatar
                                size={36}
                                style={{
                                    backgroundColor: getDifficultyColor(difficulty),
                                    fontSize: 16,
                                    flexShrink: 0
                                }}
                                icon={getTypeIcon(record.type)}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Text strong style={{ fontSize: 14, wordBreak: "break-word", lineHeight: 1.3, display: "block" }}>
                                    {record.taskName}
                                </Text>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                    <Tag
                                        color={getDifficultyColor(difficulty)}
                                        style={{ margin: 0, fontSize: 9, borderRadius: 6 }}
                                    >
                                        {difficulty}
                                    </Tag>
                                    <span style={{ fontSize: 10, color: "#8c8c8c" }}>{record.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                    <Col span={8}>
                        <div style={{
                            background: "#f0f5ff",
                            padding: "8px",
                            borderRadius: 8,
                            textAlign: "center"
                        }}>
                            <CalendarOutlined style={{ color: "#1890ff", fontSize: 14, display: "block", marginBottom: 4 }} />
                            <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 2 }}>Deadline</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#262626" }}>
                                {dayjs(record.deadline).format("MM/DD")}
                            </div>
                            {!overdue && daysLeft >= 0 && (
                                <div style={{ fontSize: 9, color: "#52c41a", marginTop: 2 }}>
                                    {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                                </div>
                            )}
                            {overdue && (
                                <div style={{ fontSize: 9, color: "#ff4d4f", marginTop: 2 }}>
                                    Overdue
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{
                            background: "#fff7e6",
                            padding: "8px",
                            borderRadius: 8,
                            textAlign: "center"
                        }}>
                            <TrophyOutlined style={{ color: "#faad14", fontSize: 14, display: "block", marginBottom: 4 }} />
                            <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 2 }}>Score</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#262626" }}>
                                {record.maxBall} pts
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{
                            background: record.fileName ? "#f6ffed" : "#fafafa",
                            padding: "8px",
                            borderRadius: 8,
                            textAlign: "center"
                        }}>
                            <DownloadOutlined style={{ color: record.fileName ? "#52c41a" : "#d9d9d9", fontSize: 14, display: "block", marginBottom: 4 }} />
                            <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 2 }}>File</div>
                            {record.fileName ? (
                                <Button
                                    type="link"
                                    size="small"
                                    style={{ padding: 0, height: "auto", fontSize: 11, fontWeight: 600 }}
                                    onClick={() => handleDownload(record.pkey, record.fileName)}
                                >
                                    {displaySize}
                                </Button>
                            ) : (
                                <div style={{ fontSize: 11, color: "#8c8c8c" }}>None</div>
                            )}
                        </div>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={8}>
                        <Button
                            block
                            size="small"
                            style={{ borderRadius: 6 }}
                            onClick={() => handleEdit(record)}
                        >
                            <EditOutlined style={{ color: "#1890ff" }} />
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            block
                            size="small"
                            style={{ borderRadius: 6 }}
                            onClick={() => handleDelete(record)}
                        >
                            <DeleteOutlined style={{ color: "#ff4d4f" }} />
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            block
                            size="small"
                            onClick={() => navigate(`/teacher/groups/${groupId}/tasks/${record.id}/homework`, { state: { record: record, oldPageRecord: state.record } })}
                            style={{
                                borderRadius: 6,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none"
                            }}
                        >
                            View <ArrowRightOutlined />
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    };

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            width: 60,
            responsive: ['sm'],
            render: (text, record, index) => (
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 12
                }}>
                    {page * size + index + 1}
                </div>
            )
        },
        {
            title: "Task Details",
            dataIndex: "taskName",
            key: "taskName",
            width: isTablet ? 200 : 220,
            render: (text, record) => {
                const difficulty = getDifficulty(record.maxBall);
                return (
                    <div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8
                        }}>
                            <Avatar
                                size={40}
                                style={{
                                    backgroundColor: getDifficultyColor(difficulty),
                                    fontSize: 16,
                                    flexShrink: 0
                                }}
                                icon={getTypeIcon(record.type)}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "#262626",
                                    marginBottom: 2,
                                    wordBreak: "break-word",
                                    lineHeight: 1.3
                                }}>
                                    {text}
                                </div>
                                <div style={{
                                    fontSize: 12,
                                    color: "#8c8c8c",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap"
                                }}>
                                    <Tag
                                        color={getDifficultyColor(difficulty)}
                                        style={{ margin: 0, fontSize: 10, borderRadius: 8 }}
                                    >
                                        {difficulty}
                                    </Tag>
                                    <span>{record.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: "Deadline",
            key: "deadline",
            width: isTablet ? 160 : 200,
            render: (record) => {
                const daysLeft = getDaysUntilDeadline(record.deadline);
                const overdue = isOverdue(record.deadline);

                return (
                    <div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8
                        }}>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text strong style={{ color: "#262626" }}>
                                {dayjs(record.deadline).format("YYYY-MM-DD")}
                            </Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {!overdue && daysLeft >= 0 && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
                                </Text>
                            )}
                            {overdue && (
                                <Text type="danger" style={{ fontSize: 12, fontWeight: 500 }}>
                                    Overdue
                                </Text>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            title: "Max score",
            key: "progress",
            width: 150,
            render: (record) => (
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8
                    }}>
                        <Text strong style={{ fontSize: 16 }}>
                            {record.maxBall} pts
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: "Attachment",
            key: "fileName",
            width: 150,
            render: (record) => {
                const fileSize = record.size;
                const displaySize =
                    fileSize < 1024
                        ? `${fileSize} Bytes`
                        : fileSize < 1024 * 1024
                            ? `${(fileSize / 1024).toFixed(2)} KB`
                            : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                return record.fileName == null ? (
                    <Button type="default" style={{ width: "100px" }} disabled>
                        Not Uploaded
                    </Button>
                ) : (
                    <Tooltip title={record.fileName}>
                        <Button
                            type="primary"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                width: "100px", display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                            onClick={() => handleDownload(record.pkey, record.fileName)}
                        >
                            <DownloadOutlined /> {displaySize}
                        </Button>
                    </Tooltip>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            width: 160,
            render: (record) => (
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <Button
                        type="text"
                        size="large"
                        style={{ borderRadius: 8 }}
                        onClick={() => handleEdit(record)}
                    >
                        <EditOutlined style={{ color: "#1890ff" }} />
                    </Button>
                    <Button
                        type="text"
                        size="large"
                        style={{ borderRadius: 8 }}
                        onClick={() => handleDelete(record)}
                    >
                        <DeleteOutlined style={{ color: "#ff4d4f" }} />
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate(`/teacher/groups/${groupId}/tasks/${record.id}/homework`, { state: { record: record, oldPageRecord: state.record } })}
                        style={{
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none"
                        }}
                    >
                        <ArrowRightOutlined />
                    </Button>
                </div>
            )
        }
    ];

    const expandableConfig = {
        expandedRowRender: (record) => (
            <div style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: 20,
                borderRadius: 12,
                margin: "8px 0"
            }}>
                <Row gutter={[24, 16]}>
                    <Col span={12}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <Card size="small" style={{ borderRadius: 8 }}>
                                    <Statistic
                                        title="Created"
                                        value={record.createdAt}
                                        prefix={<CalendarOutlined />}
                                        valueStyle={{ fontSize: 14 }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" style={{ borderRadius: 8 }}>
                                    <Statistic
                                        title="Updated"
                                        value={record.updatedAt}
                                        prefix={<ClockCircleOutlined />}
                                        valueStyle={{ fontSize: 14 }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        ),
        rowExpandable: (record) => true
    };

    return (
        <div style={{
            // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            padding: isMobile ? 12 : isTablet ? 16 : 24,
            margin: isMobile ? -12 : isTablet ? -16 : -20,
            marginTop: isMobile ? -12 : isTablet ? -16 : -20
        }}>
            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: isMobile ? 12 : 16,
                padding: isMobile ? "20px 16px" : isTablet ? "24px 24px" : "32px 40px",
                marginBottom: isMobile ? 12 : isTablet ? 16 : 24,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "flex-start",
                    marginBottom: isMobile ? 20 : isTablet ? 24 : 32,
                    gap: isMobile ? 12 : 16
                }}>
                    <div style={{ flex: 1 }}>
                        <Title level={isMobile ? 3 : isTablet ? 2 : 1} style={{
                            margin: 0,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: isMobile ? 20 : isTablet ? 26 : 32,
                            fontWeight: 700,
                            marginBottom: isMobile ? 4 : 8,
                            wordBreak: "break-word"
                        }}>
                            {record.groupName}
                        </Title>
                        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
                            <Text type="secondary" style={{ fontSize: isMobile ? 12 : 16 }}>
                                <BookOutlined /> {record.courseName}
                            </Text>
                        </div>
                    </div>
                    <Space
                        size={isMobile ? "small" : "large"}
                        direction="horizontal"
                        style={{ width: isMobile ? "100%" : "auto" }}
                    >
                        <Button
                            type="primary"
                            size={isMobile ? "middle" : "large"}
                            onClick={handleAddTask}
                            style={{
                                borderRadius: isMobile ? 8 : 12,
                                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                                border: "none",
                                height: isMobile ? 36 : 48,
                                padding: isMobile ? "0 12px" : "0 24px",
                                boxShadow: "0 4px 16px rgba(82, 196, 26, 0.3)",
                                fontSize: isMobile ? 12 : 14,
                                flex: isMobile ? 1 : "none"
                            }}
                        >
                            <PlusOutlined /> {isMobile ? "New" : "New Task"}
                        </Button>
                        <Button
                            size={isMobile ? "middle" : "large"}
                            onClick={handleBack}
                            style={{
                                borderRadius: isMobile ? 8 : 12,
                                height: isMobile ? 36 : 48,
                                padding: isMobile ? "0 12px" : "0 24px",
                                fontSize: isMobile ? 12 : 14,
                                flex: isMobile ? 1 : "none"
                            }}
                        >
                            <ArrowLeftOutlined /> {isMobile ? "Back" : "Back to Groups"}
                        </Button>
                    </Space>
                </div>

                <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                    <Col xs={12} sm={12}>
                        <Card style={{
                            borderRadius: isMobile ? 8 : 12,
                            border: "none",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white"
                        }}>
                            <Statistic
                                title={<span style={{
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: isMobile ? 10 : 14
                                }}>{isMobile ? "Tasks" : "Total Tasks"}</span>}
                                value={record.taskCount}
                                prefix={<FileTextOutlined style={{ color: "white", fontSize: isMobile ? 14 : 20 }} />}
                                valueStyle={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: isMobile ? 18 : 24
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={12}>
                        <Card style={{
                            borderRadius: isMobile ? 8 : 12,
                            border: "none",
                            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                        }}>
                            <Statistic
                                title={<span style={{
                                    color: "rgba(0,0,0,0.6)",
                                    fontSize: isMobile ? 10 : 14
                                }}>Students</span>}
                                value={record.studentCount}
                                prefix={<TeamOutlined style={{ fontSize: isMobile ? 14 : 20 }} />}
                                valueStyle={{
                                    color: "#262626",
                                    fontWeight: "bold",
                                    fontSize: isMobile ? 18 : 24
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card style={{
                borderRadius: isMobile ? 12 : 16,
                border: "none",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}>
                {isMobile ? (
                    <>
                        <List
                            loading={loading}
                            dataSource={dataSource}
                            renderItem={(item, index) => (
                                <MobileTaskCard key={item.id} record={item} index={index} />
                            )}
                            locale={{
                                emptyText: "No tasks found"
                            }}
                        />
                        {dataSource && dataSource.length > 0 && (
                            <div style={{
                                marginTop: 16,
                                display: "flex",
                                justifyContent: "center",
                                borderTop: "1px solid #f0f0f0",
                                paddingTop: 16
                            }}>
                                <Space>
                                    <Button
                                        disabled={page === 0}
                                        onClick={() => handlePagination(page)}
                                        size="small"
                                    >
                                        Previous
                                    </Button>
                                    <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                    Page {page + 1} of {Math.ceil(totalElements / size)}
                  </span>
                                    <Button
                                        disabled={(page + 1) * size >= totalElements}
                                        onClick={() => handlePagination(page + 2)}
                                        size="small"
                                    >
                                        Next
                                    </Button>
                                </Space>
                            </div>
                        )}
                    </>
                ) : (
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="id"
                        expandable={expandableConfig}
                        loading={loading}
                        pagination={{
                            current: page + 1,
                            pageSize: size,
                            total: totalElements,
                            onChange: handlePagination,
                            onShowSizeChange: handlePageSizeChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} tasks`,
                            style: { marginTop: 24 }
                        }}
                        scroll={{ x: "max-content" }}
                        size="middle"
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No tasks found"
                                />
                            )
                        }}
                    />
                )}
            </Card>
            <CreateTask isOpen={isAddTaskVisible} onSuccess={handleSuccess} onClose={hideModal} groupId={groupId} />
            <EditTask isOpen={isEditTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToEdit} />
            <DeleteTask isOpen={isDeleteTaskVisible} onSuccess={handleSuccess} onClose={hideModal} record={taskToDelete} />
        </div>
    );
};

export default TeacherTaskList;