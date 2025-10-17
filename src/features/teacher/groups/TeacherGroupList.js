import { useState, useCallback, useEffect } from "react";
import {
  Table, Button, Typography, Space, Card, Statistic, Tooltip,
  Row, Col, Avatar, message, List
} from "antd";
import {
  ArrowRightOutlined, BookOutlined, TeamOutlined,
  FileTextOutlined, UserOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../../const/SearchComponent";
import { getTeacherGroups } from "../../../services/api-client";

const { Title, Text } = Typography;

const TeacherGroupList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState();
  const [dataSource, setDataSource] = useState();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  // Handle window resize for responsive behavior
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
      const response = await getTeacherGroups(searchText, page, size);
      const { success, data, message: errorMessage } = response.data;
      if (success) {
        setDataSource(data.content);
        setTotalElements(data.totalElements);
      } else {
        message.error(errorMessage || "Failed to fetch groups of teacher");
      }
    } catch (err) {
      message.error(err.message || "An error occurred while fetching groups");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalStudents = dataSource?.reduce((sum, group) => sum + group.studentCount, 0);
  const totalTasks = dataSource?.reduce((sum, group) => sum + group.taskCount, 0);
  const activeGroups = dataSource?.filter(group => group.studentCount !== 0).length;

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(0);
  };

  const handlePagination = (newPage) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (current, newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: isMobile ? 50 : 60,
      responsive: ['sm'],
      render: (text, record, index) => (
          <div style={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: isMobile ? 10 : 12
          }}>
            {page * size + index + 1}
          </div>
      )
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      width: isMobile ? 200 : isTablet ? 240 : 280,
      render: (text, record) => (
          <div>
            <div style={{
              fontWeight: 600,
              fontSize: isMobile ? 13 : 15,
              color: "#262626",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 6 : 8,
              flexWrap: isMobile ? "wrap" : "nowrap"
            }}>
              <Avatar
                  size={isMobile ? 28 : 32}
                  style={{
                    backgroundColor: "#1890ff",
                    fontSize: isMobile ? 10 : 12,
                    flexShrink: 0
                  }}
              >
                {text.split(" ").map(word => word[0]).join("")}
              </Avatar>
              <span style={{
                wordBreak: "break-word",
                lineHeight: isMobile ? "1.3" : "1.4"
              }}>
              {text}
            </span>
            </div>
            <div style={{
              fontSize: isMobile ? 11 : 13,
              color: "#8c8c8c",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginLeft: isMobile ? 0 : 40
            }}>
              <BookOutlined />
              <span style={{ wordBreak: "break-word" }}>{record.courseName}</span>
            </div>
          </div>
      )
    },
    {
      title: "Students",
      key: "students",
      width: isMobile ? 100 : isTablet ? 140 : 180,
      render: (record) => (
          <div>
            <div style={{ marginBottom: isMobile ? 4 : 8 }}>
              <UserOutlined style={{ fontSize: isMobile ? 14 : 16, color: "#1890ff" }} />
              <Text style={{
                marginLeft: isMobile ? 4 : 8,
                fontSize: isMobile ? 11 : 13
              }}>
                {record.studentCount} {isMobile ? "" : "student"}{record.studentCount > 1 ? "s" : ""}
              </Text>
            </div>
          </div>
      )
    },
    {
      title: "Tasks",
      key: "tasks",
      width: isMobile ? 100 : isTablet ? 140 : 200,
      render: (record) => (
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 8,
              marginBottom: isMobile ? 4 : 8
            }}>
              <FileTextOutlined style={{ color: "#1890ff", fontSize: isMobile ? 14 : 16 }} />
              <Text strong style={{ fontSize: isMobile ? 11 : 13 }}>{record.taskCount}</Text>
              {!isMobile && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {record.taskCount > 1 ? "tasks" : "task"}
                  </Text>
              )}
            </div>
          </div>
      )
    },
    {
      title: "Action",
      key: "actions",
      width: isMobile ? 80 : 120,
      fixed: isMobile ? 'right' : undefined,
      render: (record) => (
          <Space>
            <Tooltip title={record.studentCount === 0 ? "No students" : "Enter tasks"}>
              <Button
                  type="primary"
                  size={isMobile ? "middle" : "large"}
                  disabled={record.studentCount === 0}
                  style={{
                    borderRadius: isMobile ? 6 : 8,
                    background: record.studentCount === 0 ? undefined : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    padding: isMobile ? "4px 8px" : undefined
                  }}
                  onClick={() => {
                    navigate(`/teacher/groups/${record.id}/tasks`, { state: { record } });
                  }}
              >
                <ArrowRightOutlined />
              </Button>
            </Tooltip>
          </Space>
      )
    }
  ];

  const expandableConfig = {
    expandedRowRender: (record) => (
        <div style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: isMobile ? 12 : 20,
          borderRadius: isMobile ? 8 : 12,
          margin: isMobile ? "4px 0" : "8px 0"
        }}>
          <Row gutter={[isMobile ? 8 : 24, isMobile ? 8 : 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small" style={{ borderRadius: isMobile ? 6 : 8 }}>
                <Statistic
                    title="Total Students"
                    value={record.studentCount}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#1890ff", fontSize: isMobile ? 18 : 24 }}
                />
              </Card>
            </Col>
          </Row>
        </div>
    ),
    rowExpandable: (record) => true
  };

  // Mobile List Item Component
  const MobileGroupCard = ({ record, index }) => (
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
                  size={32}
                  style={{
                    backgroundColor: "#1890ff",
                    fontSize: 12,
                    flexShrink: 0
                  }}
              >
                {record.groupName.split(" ").map(word => word[0]).join("")}
              </Avatar>
              <Text strong style={{ fontSize: 14, wordBreak: "break-word", lineHeight: 1.3 }}>
                {record.groupName}
              </Text>
            </div>
            <div style={{
              fontSize: 12,
              color: "#8c8c8c",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 8
            }}>
              <BookOutlined />
              <span style={{ wordBreak: "break-word" }}>{record.courseName}</span>
            </div>
          </div>
        </div>

        <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
          <Col span={12}>
            <div style={{
              background: "#f0f5ff",
              padding: "8px 12px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <UserOutlined style={{ color: "#1890ff", fontSize: 14 }} />
              <div>
                <div style={{ fontSize: 10, color: "#8c8c8c" }}>Students</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#262626" }}>
                  {record.studentCount}
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{
              background: "#fff7e6",
              padding: "8px 12px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <FileTextOutlined style={{ color: "#faad14", fontSize: 14 }} />
              <div>
                <div style={{ fontSize: 10, color: "#8c8c8c" }}>Tasks</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#262626" }}>
                  {record.taskCount}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Button
            type="primary"
            block
            disabled={record.studentCount === 0}
            style={{
              borderRadius: 8,
              background: record.studentCount === 0 ? undefined : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              height: 40,
              fontWeight: 500
            }}
            onClick={() => {
              navigate(`/teacher/groups/${record.id}/tasks`, { state: { record } });
            }}
        >
          {record.studentCount === 0 ? "No Students" : "View Tasks"} <ArrowRightOutlined />
        </Button>
      </Card>
  );

  return (
      <div style={{
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        height: "100%",
        padding: isMobile ? 6 : isTablet ? 12 : 20,

      }}>
        {/* Header Section */}
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
            alignItems: isMobile ? "stretch" : "center",
            marginBottom: isMobile ? 20 : isTablet ? 24 : 32,
            gap: isMobile ? 16 : 0
          }}>
            <div>
              <Title level={isMobile ? 3 : 1} style={{
                margin: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: isMobile ? 22 : isTablet ? 28 : 36,
                fontWeight: 700
              }}>
                My Teaching Groups
              </Title>
              <Text type="secondary" style={{
                fontSize: isMobile ? 13 : 16,
                marginTop: isMobile ? 4 : 8,
                display: "block"
              }}>
                Manage and monitor your student groups
              </Text>
            </div>
            <div style={{ width: isMobile ? "100%" : "auto" }}>
              <SearchComponent
                  placeholder={isMobile ? "Search..." : "Search groups... (Ctrl+K)"}
                  handleSearch={handleSearch}
              />
            </div>
          </div>

          {/* Statistics Cards - Single Row */}
          <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
            <Col xs={8} sm={8}>
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
                    }}>{isMobile ? "Groups" : "Active Groups"}</span>}
                    value={activeGroups}
                    prefix={<TeamOutlined style={{ color: "white", fontSize: isMobile ? 14 : 20 }} />}
                    valueStyle={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: isMobile ? 18 : 24
                    }}
                />
              </Card>
            </Col>
            <Col xs={8} sm={8}>
              <Card style={{
                borderRadius: isMobile ? 8 : 12,
                border: "none",
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              }}>
                <Statistic
                    title={<span style={{
                      color: "rgba(0,0,0,0.6)",
                      fontSize: isMobile ? 10 : 14
                    }}>{isMobile ? "Students" : "Total Students"}</span>}
                    value={totalStudents}
                    prefix={<UserOutlined style={{ fontSize: isMobile ? 14 : 20 }} />}
                    valueStyle={{
                      color: "#262626",
                      fontWeight: "bold",
                      fontSize: isMobile ? 18 : 24
                    }}
                />
              </Card>
            </Col>
            <Col xs={8} sm={8}>
              <Card style={{
                borderRadius: isMobile ? 8 : 12,
                border: "none",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              }}>
                <Statistic
                    title={<span style={{
                      color: "rgba(0,0,0,0.6)",
                      fontSize: isMobile ? 10 : 14
                    }}>{isMobile ? "Tasks" : "Total Tasks"}</span>}
                    value={totalTasks}
                    prefix={<FileTextOutlined style={{ fontSize: isMobile ? 14 : 20 }} />}
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

        {/* Main Content - Table for Desktop, Cards for Mobile */}
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
                        <MobileGroupCard key={item.id} record={item} index={index} />
                    )}
                    locale={{
                      emptyText: "No groups found"
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
                        `Showing ${range[0]}-${range[1]} of ${total} groups`,
                    style: { marginTop: 24 }
                  }}
                  scroll={{ x: "max-content" }}
                  size="middle"
              />
          )}
        </Card>
      </div>
  );
};

export default TeacherGroupList;