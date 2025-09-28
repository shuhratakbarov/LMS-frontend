import {
  BookOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined, FileTextOutlined,
  FileWordOutlined, RocketOutlined, StarOutlined, TrophyOutlined,
  UploadOutlined
} from "@ant-design/icons";

export const getFileIcon = (fileName) => {
  if (!fileName) return <UploadOutlined />;

  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    case 'doc':
    case 'docx': return <FileWordOutlined style={{ color: '#1890ff' }} />;
    case 'xls':
    case 'xlsx': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return <FileImageOutlined style={{ color: '#faad14' }} />;
    default: return <UploadOutlined />;
  }
};

export const taskTypes = [
  {
    value: 'Assignment',
    label: 'Assignment',
    icon: <FileTextOutlined />,
    color: '#1890ff',
    description: 'Written assignments and problem sets'
  },
  {
    value: 'Quiz',
    label: 'Quiz',
    icon: <TrophyOutlined />,
    color: '#52c41a',
    description: 'Short assessments and quizzes'
  },
  {
    value: 'Project',
    label: 'Project',
    icon: <RocketOutlined />,
    color: '#faad14',
    description: 'Long-term projects and research'
  },
  {
    value: 'Lab Report',
    label: 'Lab Report',
    icon: <BookOutlined />,
    color: '#722ed1',
    description: 'Laboratory work and experiments'
  },
  {
    value: 'Presentation',
    label: 'Presentation',
    icon: <StarOutlined />,
    color: '#eb2f96',
    description: 'Oral presentations and demos'
  }
];
