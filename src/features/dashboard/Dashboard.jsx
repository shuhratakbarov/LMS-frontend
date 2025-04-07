// import { useState, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import { Layout, Menu, theme, Spin, Avatar, Dropdown } from "antd";
// import {
//   UserOutlined,
//   BookOutlined,
//   SolutionOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import {
//   fetchAdminData,
//   fetchTeacherTasks,
//   fetchStudentHomework,
// } from "../../services/api";
//
// const { Header, Sider, Content } = Layout;
//
// const Dashboard = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [userRole, setUserRole] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const navigate = useNavigate();
//
//   // Ant Design theme
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();
//
//   // Initial load
//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (!role) {
//       navigate("/login");
//       return;
//     }
//     setUserRole(role);
//     loadDashboardData(role);
//   }, [navigate]);
//
//   // Load data based on role
//   const loadDashboardData = async (role) => {
//     try {
//       let data;
//       switch (role) {
//         case "admin":
//           data = await fetchAdminData();
//           break;
//         case "teacher":
//           data = await fetchTeacherTasks(localStorage.getItem("userId"));
//           break;
//         case "student":
//           data = await fetchStudentHomework(localStorage.getItem("userId"));
//           break;
//         default:
//       }
//       setDashboardData(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Handle logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };
//
//   // Menu items based on role
//   const getMenuItems = () => [
//     { key: "profile", icon: <UserOutlined />, label: "Profile" },
//     ...(userRole === "admin"
//       ? [
//           { key: "users", icon: <UserOutlined />, label: "Users" },
//           { key: "courses", icon: <BookOutlined />, label: "Courses" },
//         ]
//       : userRole === "teacher"
//         ? [
//             { key: "tasks", icon: <SolutionOutlined />, label: "Tasks" },
//             { key: "grades", icon: <BookOutlined />, label: "Grades" },
//           ]
//         : [
//             { key: "homework", icon: <SolutionOutlined />, label: "StudentHomeworkList" },
//             { key: "courses", icon: <BookOutlined />, label: "Courses" },
//           ]),
//   ];
//
//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
//         <div
//           className="demo-logo-vertical"
//           style={{
//             height: 32,
//             margin: 16,
//             background: "rgba(255,255,255,0.2)",
//             color: "white",
//             textAlign: "center",
//             lineHeight: "32px",
//           }}
//         >
//           LMS
//         </div>
//
//         <Menu
//           theme="dark"
//           mode="inline"
//           items={getMenuItems()}
//           onSelect={({ key }) => navigate(`/dashboard/${key}`)}
//         />
//       </Sider>
//
//       {/* Main content */}
//       <Layout>
//         <Header
//           style={{
//             padding: 0,
//             background: colorBgContainer,
//             display: "flex",
//             justifyContent: "flex-end",
//             alignItems: "center",
//             paddingRight: 24,
//           }}
//         >
//           <Dropdown
//             menu={{
//               items: [
//                 {
//                   key: "logout",
//                   label: "Logout",
//                   icon: <LogoutOutlined />,
//                   onClick: handleLogout,
//                 },
//               ],
//             }}
//           >
//             <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
//           </Dropdown>
//         </Header>
//
//         <Content
//           style={{
//             margin: "24px 16px",
//             padding: 24,
//             background: colorBgContainer,
//           }}
//         >
//           <Spin spinning={loading}>
//             {dashboardData ? (
//               <Outlet context={{ dashboardData, userRole }} />
//             ) : (
//               <div>No data available</div>
//             )}
//           </Spin>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };
//
// export default Dashboard;
