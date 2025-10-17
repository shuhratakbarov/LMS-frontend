import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Badge,
  Avatar,
  Dropdown,
  Row,
  Col,
  Typography,
  Progress,
  Tag,
  Tooltip,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Empty,
  Divider,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const StudentExams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for exams
  const exams = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      subject: "Programming",
      description: "Comprehensive exam covering closures, promises, and async/await patterns",
      duration: 120,
      questions: 45,
      maxAttempts: 2,
      startDate: "2024-10-15",
      endDate: "2024-10-25",
      status: "active",
      participants: 128,
      completed: 89,
      averageScore: 78,
      difficulty: "Advanced",
      tags: ["JavaScript", "Web Development", "Programming"]
    },
    {
      id: 2,
      title: "Database Design Fundamentals",
      subject: "Database",
      description: "Test your knowledge on SQL, normalization, and database optimization",
      duration: 90,
      questions: 35,
      maxAttempts: 3,
      startDate: "2024-10-20",
      endDate: "2024-11-05",
      status: "scheduled",
      participants: 95,
      completed: 0,
      averageScore: 0,
      difficulty: "Intermediate",
      tags: ["SQL", "Database", "Optimization"]
    },
    {
      id: 3,
      title: "React Performance Optimization",
      subject: "Frontend",
      description: "Advanced techniques for optimizing React applications",
      duration: 100,
      questions: 40,
      maxAttempts: 2,
      startDate: "2024-09-15",
      endDate: "2024-09-30",
      status: "completed",
      participants: 156,
      completed: 156,
      averageScore: 82,
      difficulty: "Advanced",
      tags: ["React", "Performance", "Optimization"]
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      subject: "Design",
      description: "Understanding user experience and interface design fundamentals",
      duration: 75,
      questions: 30,
      maxAttempts: 1,
      startDate: "2024-10-18",
      endDate: "2024-10-28",
      status: "active",
      participants: 203,
      completed: 145,
      averageScore: 85,
      difficulty: "Beginner",
      tags: ["UI", "UX", "Design", "User Experience"]
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      subject: "AI/ML",
      description: "Introduction to machine learning algorithms and concepts",
      duration: 150,
      questions: 50,
      maxAttempts: 2,
      startDate: "2024-11-01",
      endDate: "2024-11-15",
      status: "draft",
      participants: 0,
      completed: 0,
      averageScore: 0,
      difficulty: "Intermediate",
      tags: ["Machine Learning", "AI", "Algorithms"]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: '#52c41a',
      scheduled: '#1890ff',
      completed: '#722ed1',
      draft: '#faad14'
    };
    return colors[status] || '#d9d9d9';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <PlayCircleOutlined />,
      scheduled: <CalendarOutlined />,
      completed: <CheckCircleOutlined />,
      draft: <EditOutlined />
    };
    return icons[status] || <ExclamationCircleOutlined />;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#52c41a',
      'Intermediate': '#faad14',
      'Advanced': '#ff4d4f'
    };
    return colors[difficulty] || '#d9d9d9';
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleCreateExam = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalOk = () => {
    message.success('Exam created successfully!');
    setIsModalVisible(false);
  };

  const examMenuItems = (exam) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Details',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Exam',
    },
    {
      key: 'stats',
      icon: <BarChartOutlined />,
      label: 'View Statistics',
    },
    {
      key: 'duplicate',
      icon: <FileTextOutlined />,
      label: 'Duplicate',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
    },
  ];

  // Statistics for the dashboard cards
  const totalExams = exams.length;
  const activeExams = exams.filter(e => e.status === 'active').length;
  const totalParticipants = exams.reduce((sum, exam) => sum + exam.participants, 0);
  const avgCompletionRate = exams.length > 0
    ? Math.round(exams.reduce((sum, exam) => sum + (exam.participants > 0 ? (exam.completed / exam.participants) * 100 : 0), 0) / exams.length)
    : 0;

  return (
    <div style={{ padding: '8px 8px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <BookOutlined style={{ marginRight: 12, color: '#1890ff' }} />
              Exams
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Monitor your online examinations
            </Text>
          </div>
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  size="large"*/}
          {/*  icon={<PlusOutlined />}*/}
          {/*  onClick={handleCreateExam}*/}
          {/*  style={{*/}
          {/*    borderRadius: 8,*/}
          {/*    height: 44,*/}
          {/*    paddingLeft: 20,*/}
          {/*    paddingRight: 20,*/}
          {/*    fontSize: 16,*/}
          {/*    fontWeight: 500,*/}
          {/*    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Create New Exam*/}
          {/*</Button>*/}
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #e8f4ff',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)'
              }}
            >
              <Statistic
                title={<span style={{ color: '#1890ff', fontWeight: 500 }}>Total Exams</span>}
                value={totalExams}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #f0f9d4',
                background: 'linear-gradient(135deg, #fcffe6 0%, #f4ffb8 100%)'
              }}
            >
              <Statistic
                title={<span style={{ color: '#52c41a', fontWeight: 500 }}>Active Exams</span>}
                value={activeExams}
                prefix={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #fff7e6',
                background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)'
              }}
            >
              <Statistic
                title={<span style={{ color: '#fa8c16', fontWeight: 500 }}>Total Participants</span>}
                value={totalParticipants}
                prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #f9f0ff',
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)'
              }}
            >
              <Statistic
                title={<span style={{ color: '#722ed1', fontWeight: 500 }}>Avg. Completion</span>}
                value={avgCompletionRate}
                suffix="%"
                prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Filters and Search */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              size="large"
              placeholder="Search exams..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              placeholder="Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%', borderRadius: 8 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="scheduled">Scheduled</Option>
              <Option value="completed">Completed</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              placeholder="Subject"
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: '100%', borderRadius: 8 }}
            >
              <Option value="all">All Subjects</Option>
              <Option value="Programming">Programming</Option>
              <Option value="Database">Database</Option>
              <Option value="Frontend">Frontend</Option>
              <Option value="Design">Design</Option>
              <Option value="AI/ML">AI/ML</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Text type="secondary">
                Showing {filteredExams.length} of {totalExams} exams
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: 40 }}>
          <Empty
            description="No exams found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredExams.map((exam) => (
            <Col xs={24} sm={12} xl={8} key={exam.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
                bodyStyle={{ padding: 20 }}
                extra={
                  <Dropdown
                    menu={{ items: examMenuItems(exam) }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge
                      status="default"
                      color={getStatusColor(exam.status)}
                      text={
                        <span style={{
                          color: getStatusColor(exam.status),
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          fontSize: 12
                        }}>
                          {getStatusIcon(exam.status)} {exam.status}
                        </span>
                      }
                    />
                  </div>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <Title level={4} style={{ margin: 0, marginBottom: 8, color: '#262626' }}>
                    {exam.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14, lineHeight: '1.4' }}>
                    {exam.description}
                  </Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Space wrap size={[4, 8]}>
                    {exam.tags.map((tag, index) => (
                      <Tag key={index} style={{ borderRadius: 6, fontSize: 11 }}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>Duration</div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{exam.duration}min</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <FileTextOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>Questions</div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{exam.questions}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <UserOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>Students</div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{exam.participants}</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {exam.participants > 0 && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Completion Rate</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600 }}>
                          {Math.round((exam.completed / exam.participants) * 100)}%
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round((exam.completed / exam.participants) * 100)}
                        showInfo={false}
                        strokeColor={{
                          '0%': '#87d068',
                          '100%': '#108ee9',
                        }}
                        style={{ margin: 0 }}
                      />
                    </div>

                    {exam.averageScore > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Average Score</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: '#52c41a' }}>
                          {exam.averageScore}%
                        </Text>
                      </div>
                    )}
                  </>
                )}

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color={getDifficultyColor(exam.difficulty)} style={{ borderRadius: 4, fontSize: 11 }}>
                      {exam.difficulty}
                    </Tag>
                    <Tag style={{ borderRadius: 4, fontSize: 11 }}>
                      {exam.subject}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {exam.status === 'active' ? `Until ${exam.endDate}` :
                      exam.status === 'scheduled' ? `Starts ${exam.startDate}` :
                        exam.status === 'completed' ? `Ended ${exam.endDate}` : 'Draft'}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Exam Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Create New Exam
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={720}
        okText="Create Exam"
        cancelText="Cancel"
        destroyOnClose
        style={{ top: 20 }}
      >
        <div style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Exam Title</label>
                <Input size="large" placeholder="Enter exam title" />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Subject</label>
                <Select size="large" placeholder="Select subject" style={{ width: '100%' }}>
                  <Option value="Programming">Programming</Option>
                  <Option value="Database">Database</Option>
                  <Option value="Frontend">Frontend</Option>
                  <Option value="Design">Design</Option>
                  <Option value="AI/ML">AI/ML</Option>
                </Select>
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Description</label>
            <Input.TextArea rows={3} placeholder="Enter exam description" />
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Duration (minutes)</label>
                <InputNumber size="large" min={1} style={{ width: '100%' }} placeholder="120" />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Total Questions</label>
                <InputNumber size="large" min={1} style={{ width: '100%' }} placeholder="45" />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Max Attempts</label>
                <InputNumber size="large" min={1} max={5} style={{ width: '100%' }} placeholder="2" />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Exam Period</label>
                <RangePicker size="large" style={{ width: '100%' }} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Difficulty Level</label>
                <Select size="large" placeholder="Select difficulty" style={{ width: '100%' }}>
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                </Select>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default StudentExams;