// import {
//   Modal, Form, Input, Button, Upload, DatePicker, Typography, Row, Col, Card, Radio, Avatar,
//   Select, Switch, Alert, Steps, Divider, Space, Slider, message, InputNumber
// } from "antd";
// import {
//   BulbOutlined, CalendarOutlined, CheckOutlined, CloudUploadOutlined, FileTextOutlined,
//   PlusOutlined, TrophyOutlined,
// } from "@ant-design/icons";
// import { createTeacherTask } from "../../../../services/api-client";
// import { useState } from "react";
// import Title from "antd/lib/typography/Title";
// import { getFileIcon, taskTypes } from "./util";
// import dayjs from "dayjs";
//
// const { Text } = Typography;
//
// const CreateTask = ({ isOpen, onSuccess, onClose, groupId }) => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//
//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       console.log("Raw form values:", values);
//
//       const formData = new FormData();
//
//       // Handle file upload - check both possible structures
//       if (uploadedFile) {
//         formData.append("file", uploadedFile);
//       }
//
//       formData.append("name", values.name);
//       formData.append("type", values.type);
//
//       // Ensure maxBall is properly handled
//       const maxBallValue = values.maxBall;
//       console.log("maxBall from form:", maxBallValue, "type:", typeof maxBallValue);
//
//       if (maxBallValue !== undefined && maxBallValue !== null) {
//         formData.append("maxBall", String(maxBallValue));
//       } else {
//         throw new Error("Maximum score is required");
//       }
//
//       formData.append("groupId", groupId);
//       formData.append(
//         "deadline",
//         values.deadline ? values.deadline.format("YYYY-MM-DD") : ""
//       );
//
//       // Debug FormData contents
//       for (let [key, value] of formData.entries()) {
//         console.log(`FormData ${key}:`, value);
//       }
//
//       const response = await createTeacherTask(formData);
//
//       const { success, message: errorMessage } = response.data;
//       if (success) {
//         message.success("Task added successfully");
//         onSuccess();
//         handleCancel(); // Use handleCancel instead of just onClose
//       } else {
//         message.error(errorMessage || "Failed to create task");
//       }
//     } catch (error) {
//       console.error("Error creating task:", error);
//       message.error(error.message || "An error occurred while adding the task");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleCancel = () => {
//     form.resetFields();
//     setCurrentStep(0);
//     setUploadedFile(null);
//     setSelectedType(null);
//     onClose();
//   };
//
//   const nextStep = async () => {
//     try {
//       // Validate current step before proceeding
//       if (currentStep === 0) {
//         await form.validateFields(['name', 'type']);
//       } else if (currentStep === 1) {
//         await form.validateFields(['maxBall', 'deadline']);
//       }
//       setCurrentStep(prev => Math.min(prev + 1, 2));
//     } catch (error) {
//       console.log("Validation failed:", error);
//     }
//   };
//
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
//
//   const currentDate = dayjs().add(3, "days");
//
//   const customUploadProps = {
//     beforeUpload: (file) => {
//       setUploadedFile(file);
//       // Also set the form field value for validation
//       form.setFieldsValue({ file: { file, originFileObj: file } });
//       return false;
//     },
//     onRemove: () => {
//       setUploadedFile(null);
//       form.setFieldsValue({ file: undefined });
//     },
//     maxCount: 1,
//     showUploadList: {
//       showPreviewIcon: false,
//       showRemoveIcon: true,
//     }
//   };
//
//   const steps = [
//     {
//       title: 'Basic Info',
//       content: (
//         <div style={{ minHeight: 300 }}>
//           <Form.Item
//             label={<Text strong>Task Name</Text>}
//             name="name"
//             rules={[{ required: true, message: "Please enter a task name!" }]}
//           >
//             <Input
//               size="large"
//               placeholder="Enter descriptive task name"
//               style={{ borderRadius: 8 }}
//               prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
//             />
//           </Form.Item>
//
//           <Form.Item
//             label={<Text strong>Task Type</Text>}
//             name="type"
//             rules={[{ required: true, message: "Please select task type!" }]}
//           >
//             <div>
//               <Row gutter={[12, 12]}>
//                 {taskTypes.map(type => (
//                   <Col span={12} key={type.value}>
//                     <Card
//                       size="small"
//                       hoverable
//                       style={{
//                         borderRadius: 8,
//                         border: selectedType === type.value ? `2px solid ${type.color}` : '1px solid #d9d9d9',
//                         background: selectedType === type.value ? `${type.color}10` : 'white',
//                         cursor: 'pointer'
//                       }}
//                       onClick={() => {
//                         setSelectedType(type.value);
//                         form.setFieldsValue({ type: type.value });
//                       }}
//                     >
//                       <div style={{ textAlign: 'center' }}>
//                         <Avatar
//                           style={{ backgroundColor: type.color, marginBottom: 8 }}
//                           icon={type.icon}
//                         />
//                         <div style={{ fontWeight: 600, fontSize: 13 }}>{type.label}</div>
//                         <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
//                           {type.description}
//                         </div>
//                       </div>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </div>
//           </Form.Item>
//         </div>
//       )
//     },
//     {
//       title: 'Scoring & Deadline',
//       content: (
//         <div style={{ minHeight: 300 }}>
//           <Row gutter={24}>
//             <Col span={12}>
//               <Form.Item
//                 label={<Text strong>Maximum Score</Text>}
//                 name="maxBall"
//                 rules={[
//                   { required: true, message: "Please enter maximum score!" },
//                   { type: 'number', min: 1, max: 50, message: "Score must be between 1 and 50!" }
//                 ]}
//               >
//                 <InputNumber
//                   min={1}
//                   max={50}
//                   style={{ borderRadius: 8, width: "100%" }}
//                   placeholder="Enter maximum score"
//                   addonAfter="points"
//                   // Remove the onChange handler - let Form.Item handle it
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={<Text strong>Difficulty Level</Text>}
//                 name="difficulty"
//                 initialValue="medium"
//               >
//                 <Radio.Group style={{ width: '100%' }}>
//                   <Radio.Button
//                     value="easy"
//                     style={{
//                       width: '33.33%',
//                       textAlign: 'center',
//                       borderRadius: '8px 0 0 8px'
//                     }}
//                   >
//                     Easy
//                   </Radio.Button>
//                   <Radio.Button
//                     value="medium"
//                     style={{
//                       width: '33.33%',
//                       textAlign: 'center'
//                     }}
//                   >
//                     Medium
//                   </Radio.Button>
//                   <Radio.Button
//                     value="hard"
//                     style={{
//                       width: '33.33%',
//                       textAlign: 'center',
//                       borderRadius: '0 8px 8px 0'
//                     }}
//                   >
//                     Hard
//                   </Radio.Button>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>
//           </Row>
//
//           <Form.Item
//             label={<Text strong>Deadline</Text>}
//             name="deadline"
//             rules={[{ required: true, message: "Please select a deadline!" }]}
//           >
//             <DatePicker
//               size="large"
//               disabledDate={(current) => current && current < currentDate}
//               style={{ width: "100%", borderRadius: 8 }}
//               placeholder="Select task deadline"
//               showTime={{
//                 format: 'HH:mm'
//               }}
//               format="YYYY-MM-DD HH:mm"
//             />
//           </Form.Item>
//         </div>
//       )
//     },
//     {
//       title: 'File Attachment',
//       content: (
//         <div style={{ minHeight: 300 }}>
//           <Form.Item
//             label={<Text strong>Attach File</Text>}
//             name="file"
//             rules={[{ required: true, message: "Please upload a file!" }]}
//           >
//             <Upload.Dragger
//               beforeUpload={(file) => {
//                 setUploadedFile(file);
//                 return false;
//               }}
//               onRemove={() => setUploadedFile(null)}
//               maxCount={1}
//               fileList={uploadedFile ? [uploadedFile] : []}
//             >
//               <div style={{ padding: '40px 20px' }}>
//                 <p style={{ marginBottom: 16 }}>
//                   <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
//                 </p>
//                 <Title level={4} style={{ color: '#1890ff', marginBottom: 8 }}>
//                   Drop files here or click to upload
//                 </Title>
//                 <Text type="secondary">
//                   Support for PDF, DOC, DOCX, XLS, XLSX, images and more
//                 </Text>
//                 <div style={{ marginTop: 16 }}>
//                   <Text type="secondary" style={{ fontSize: 12 }}>
//                     Maximum file size: 50MB
//                   </Text>
//                 </div>
//               </div>
//             </Upload.Dragger>
//           </Form.Item>
//
//           {uploadedFile && (
//             <Card
//               size="small"
//               style={{
//                 borderRadius: 8,
//                 background: '#f6ffed',
//                 border: '1px solid #b7eb8f'
//               }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                 {getFileIcon(uploadedFile.name)}
//                 <div style={{ flex: 1 }}>
//                   <Text strong>{uploadedFile.name}</Text>
//                   <br />
//                   <Text type="secondary" style={{ fontSize: 12 }}>
//                     {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </Text>
//                 </div>
//                 <CheckOutlined style={{ color: '#52c41a' }} />
//               </div>
//             </Card>
//           )}
//
//           <Alert
//             message="File Upload Tips"
//             description="Make sure your file is well-organized and contains all necessary instructions. Students will download this file to complete the task."
//             type="info"
//             icon={<BulbOutlined />}
//             style={{
//               marginTop: 16,
//               borderRadius: 8,
//               border: '1px solid #91d5ff'
//             }}
//           />
//         </div>
//       )
//     }
//   ];
//
//   return (
//     <Modal
//       title={
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 12,
//           paddingBottom: 16,
//           borderBottom: '1px solid #f0f0f0'
//         }}>
//           <Avatar
//             style={{
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//             }}
//             icon={<PlusOutlined />}
//           />
//           <div>
//             <Title level={4} style={{ margin: 0 }}>Create New Task</Title>
//             <Text type="secondary">Set up a new assignment for your students</Text>
//           </div>
//         </div>
//       }
//       open={isOpen}
//       onCancel={handleCancel}
//       width={720}
//       footer={null}
//       style={{ top: 20 }}
//     >
//       <div style={{ padding: '16px 0' }}>
//         <Steps
//           current={currentStep}
//           style={{ marginBottom: 32 }}
//           items={steps.map(step => ({ title: step.title }))}
//         />
//
//         <Form
//           form={form}
//           onFinish={onFinish}
//           layout="vertical"
//           size="large"
//         >
//           {steps[currentStep].content}
//
//           <Divider />
//
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <div>
//               {currentStep > 0 && (
//                 <Button
//                   onClick={prevStep}
//                   style={{ borderRadius: 8 }}
//                 >
//                   Previous
//                 </Button>
//               )}
//             </div>
//
//             <Space>
//               <Button
//                 onClick={handleCancel}
//                 style={{ borderRadius: 8 }}
//               >
//                 Cancel
//               </Button>
//
//               {currentStep < steps.length - 1 ? (
//                 <Button
//                   type="primary"
//                   onClick={nextStep}
//                   style={{
//                     borderRadius: 8,
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     border: 'none'
//                   }}
//                 >
//                   Next Step
//                 </Button>
//               ) : (
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={loading}
//                   style={{
//                     borderRadius: 8,
//                     background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
//                     border: 'none'
//                   }}
//                 >
//                   <PlusOutlined /> Create Task
//                 </Button>
//               )}
//             </Space>
//           </div>
//         </Form>
//       </div>
//     </Modal>
//   );
// };
//
// export default CreateTask;