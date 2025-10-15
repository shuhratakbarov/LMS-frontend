import { Fragment, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Table, Tooltip, message, Card, Typography, Space, Tag, Avatar, List, Row, Col } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, UserOutlined, TrophyOutlined, FileTextOutlined } from "@ant-design/icons";
import { download, getTeacherHomeworkList } from "../../../../../services/api-client";
import EvaluateHomework from "./EvaluateHomework";
import UpdateEvaluatedHomework from "./UpdateEvaluatedHomework";

const { Title, Text } = Typography;

const TeacherHomeworkList = () => {
    const { groupId, taskId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const record = state?.record || {};
    const taskName = record.taskName || "Unknown Task";
    const groupName = state?.oldPageRecord.groupName || "Unknown Group";
    const deadline = record.deadline || "";
    const maxBall = record.maxBall || 0;
    const [dataSource, setDataSource] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [isEvaluateVisible, setIsEvaluateVisible] = useState(false);
    const [isUpdateEvaluateVisible, setIsUpdateEvaluateVisible] = useState(false);
    const [homework, setHomework] = useState({ homeworkBall: 0, description: "" });
    const [homeworkId, setHomeworkId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getTeacherHomeworkList(taskId, groupId, page, size);
            const { data } = response.data;
            setDataSource(data.content);
            setTotalElements(data.totalElements);
        } catch (err) {
            message.error(err.message || "An error occurred while fetching homework");
        } finally {
            setLoading(false);
        }
    }, [groupId, taskId, page, size]);

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

    const handleEvaluate = (homeworkId) => {
        setHomeworkId(homeworkId);
        setIsEvaluateVisible(true);
    };

    const handleChangeEvaluation = (ball, description, homeworkId) => {
        setHomework({ homeworkBall: ball, description });
        setHomeworkId(homeworkId);
        setIsUpdateEvaluateVisible(true);
    };

    const handleBack = () => {
        navigate(`/teacher/groups/${groupId}/tasks`, {state: {record: state.oldPageRecord}});
    };

    const hideModal = () => {
        setIsEvaluateVisible(false);
        setIsUpdateEvaluateVisible(false);
    };

    const handleSuccess = () => {
        fetchData();
        hideModal();
    };

    const handlePagination = (newPage) => {
        setPage(newPage - 1);
    };

    const handlePageSizeChange = (current, newSize) => {
        setSize(newSize);
        setPage(0);
    };

    const isPastDeadline = new Date(deadline) < new Date();

    // Mobile Card Component
    const MobileHomeworkCard = ({ record, index }) => {
        const fileSize = record.homeworkFileSize;
        const displaySize =
            fileSize < 1024
                ? `${fileSize}B`
                : fileSize < 1024 * 1024
                    ? `${(fileSize / 1024).toFixed(0)}KB`
                    : `${(fileSize / (1024 * 1024)).toFixed(1)}MB`;

        const canEvaluate = record.homeworkFileName && !record.ball && !isPastDeadline;
        const canUpdate = record.ball && record.homeworkFileName && !isPastDeadline;

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
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                            <div>
                                <Text strong style={{ fontSize: 14, display: "block", lineHeight: 1.2 }}>
                                    {record.firstName} {record.lastName}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                            </div>
                        </div>
                    </div>
                </div>

                <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                    <Col span={12}>
                        <div style={{
                            background: record.ball ? "#f6ffed" : "#fafafa",
                            padding: "8px",
                            borderRadius: 8,
                            textAlign: "center"
                        }}>
                            <TrophyOutlined style={{
                                color: record.ball ? "#52c41a" : "#d9d9d9",
                                fontSize: 14,
                                display: "block",
                                marginBottom: 4
                            }} />
                            <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 2 }}>Score</div>
                            <Tooltip title={record.description}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#262626", cursor: "pointer" }}>
                                    {record.ball ?? "N/A"} / {maxBall}
                                </div>
                            </Tooltip>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{
                            background: record.homeworkFileName ? "#f0f5ff" : "#fafafa",
                            padding: "8px",
                            borderRadius: 8,
                            textAlign: "center"
                        }}>
                            <FileTextOutlined style={{
                                color: record.homeworkFileName ? "#1890ff" : "#d9d9d9",
                                fontSize: 14,
                                display: "block",
                                marginBottom: 4
                            }} />
                            <div style={{ fontSize: 10, color: "#8c8c8c", marginBottom: 2 }}>File</div>
                            {record.homeworkFileName ? (
                                <Button
                                    type="link"
                                    size="small"
                                    style={{ padding: 0, height: "auto", fontSize: 11, fontWeight: 600 }}
                                    onClick={() => handleDownload(record.homeworkFileId, record.homeworkFileName)}
                                >
                                    {displaySize}
                                </Button>
                            ) : (
                                <div style={{ fontSize: 11, color: "#8c8c8c" }}>None</div>
                            )}
                        </div>
                    </Col>
                </Row>

                <Button
                    type={canEvaluate || canUpdate ? "primary" : "default"}
                    block
                    size="small"
                    disabled={!canEvaluate && !canUpdate}
                    style={{
                        borderRadius: 8,
                        background: canEvaluate || canUpdate ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : undefined,
                        border: canEvaluate || canUpdate ? "none" : undefined
                    }}
                    onClick={() => {
                        if (canEvaluate) handleEvaluate(record.homeworkId);
                        if (canUpdate) handleChangeEvaluation(record.ball, record.description, record.homeworkId);
                    }}
                >
                    {canEvaluate ? "Evaluate" : canUpdate ? "Update" : isPastDeadline ? "Deadline Passed" : "No Submission"}
                </Button>
            </Card>
        );
    };

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            width: 60,
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
            ),
        },
        {
            title: "Student",
            key: "student",
            width: 250,
            render: (record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                    <div>
                        <Text strong style={{ display: "block" }}>{record.firstName} {record.lastName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Score",
            key: "ball",
            width: 120,
            sorter: (a, b) => (a.ball || 0) - (b.ball || 0),
            render: (record) => (
                <Tooltip title={record.description}>
                    <Tag
                        color={record.ball ? "success" : "default"}
                        style={{
                            fontSize: 14,
                            padding: "4px 12px",
                            borderRadius: 8,
                            cursor: "pointer"
                        }}
                    >
                        <TrophyOutlined /> {record.ball ?? "N/A"} / {maxBall}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "Attachment",
            key: "homeworkName",
            width: 180,
            render: (record) => {
                const fileSize = record.homeworkFileSize;
                const displaySize =
                    fileSize < 1024
                        ? `${fileSize} Bytes`
                        : fileSize < 1024 * 1024
                            ? `${(fileSize / 1024).toFixed(2)} KB`
                            : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                return record.homeworkFileName == null ? (
                    <Button type="default" disabled>
                        Not Uploaded
                    </Button>
                ) : (
                    <Tooltip title={record.homeworkFileName}>
                        <Button
                            type="primary"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none"
                            }}
                            onClick={() => handleDownload(record.homeworkFileId, record.homeworkFileName)}
                        >
                            <DownloadOutlined /> {displaySize}
                        </Button>
                    </Tooltip>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            width: 150,
            render: (record) => {
                if (record.homeworkFileName && !record.ball && !isPastDeadline) {
                    return (
                        <Button
                            type="primary"
                            style={{
                                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                                border: "none"
                            }}
                            onClick={() => handleEvaluate(record.homeworkId)}
                        >
                            Evaluate
                        </Button>
                    );
                }
                if (record.ball && record.homeworkFileName && !isPastDeadline) {
                    return (
                        <Button
                            type="primary"
                            style={{
                                background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)",
                                border: "none"
                            }}
                            onClick={() => handleChangeEvaluation(record.ball, record.description, record.homeworkId)}
                        >
                            Update
                        </Button>
                    );
                }
                return (
                    <Button type="default" disabled>
                        {isPastDeadline ? "Deadline Passed" : "No Submission"}
                    </Button>
                );
            },
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => (
            <div style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: 16,
                borderRadius: 8
            }}>
                <Space direction="vertical" size={4}>
                    <Text><strong>Phone:</strong> {record.phone}</Text>
                    <Text><strong>Email:</strong> {record.email}</Text>
                </Space>
            </div>
        ),
        rowExpandable: (record) => true,
    };

    return (
        <div style={{
            // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            padding: isMobile ? 12 : 24,
            margin: isMobile ? -12 : -20,
            marginTop: isMobile ? -12 : -20
        }}>
            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: isMobile ? 12 : 16,
                padding: isMobile ? "20px 16px" : "32px 40px",
                marginBottom: isMobile ? 12 : 24,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 12 : 0
                }}>
                    <div>
                        <Title level={isMobile ? 4 : 2} style={{
                            margin: 0,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            wordBreak: "break-word"
                        }}>
                            {taskName}
                        </Title>
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                            {groupName}
                        </Text>
                    </div>
                    <Button
                        size={isMobile ? "middle" : "large"}
                        onClick={handleBack}
                        icon={<ArrowLeftOutlined />}
                        style={{
                            borderRadius: isMobile ? 8 : 12,
                            width: isMobile ? "100%" : "auto"
                        }}
                    >
                        {isMobile ? "Back" : "Back to Tasks"}
                    </Button>
                </div>
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
                                <MobileHomeworkCard key={item.id} record={item} index={index} />
                            )}
                            locale={{
                                emptyText: "No homework submissions"
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
                    {page + 1} / {Math.ceil(totalElements / size)}
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
                        pagination={{
                            current: page + 1,
                            pageSize: size,
                            total: totalElements,
                            onChange: handlePagination,
                            onShowSizeChange: handlePageSizeChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showQuickJumper: true,
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} submissions`,
                        }}
                        loading={loading}
                        scroll={{ x: "max-content" }}
                    />
                )}
            </Card>

            <EvaluateHomework
                isOpen={isEvaluateVisible}
                onClose={hideModal}
                onSuccess={handleSuccess}
                homeworkId={homeworkId}
                maxBall={maxBall}
            />
            <UpdateEvaluatedHomework
                isOpen={isUpdateEvaluateVisible}
                onClose={hideModal}
                onSuccess={handleSuccess}
                homework={homework}
                homeworkId={homeworkId}
                maxBall={maxBall}
            />
        </div>
    );
};

export default TeacherHomeworkList;