import { canUserLogin, getAccessToken, getUserCredentials } from "./utils/auth";
import Login from "./features/auth/Login";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserLayout from "./features/const/layout/UserLayout";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import CourseList from "./features/admin/courses/CourseList";
import GroupList from "./features/admin/groups/GroupList";
import ActionsInGroup from "./features/admin/groups/ActionsInGroup";
import LessonScheduleList from "./features/admin/lesson-schedule/list-view/LessonScheduleList";
import TimetableView from "./features/admin/lesson-schedule/time-table-view/TimetableView";
import UserList from "./features/admin/users/UserList";
import RoomList from "./features/admin/rooms/RoomList";
import TeacherGroupList from "./features/teacher/groups/TeacherGroupList";
import TeacherTaskList from "./features/teacher/groups/task-list/TeacherTaskList";
import HomeworkList from "./features/teacher/groups/task-list/homework-list/TeacherHomeworkList";
import TeacherLessons from "./features/teacher/lesson-schedule/TeacherLessons";
import StudentGroupList from "./features/student/groups/StudentGroupList";
import StudentHomeworkList from "./features/student/groups/task-list/StudentHomeworkList";
import StudentLessons from "./features/student/lesson-schedule/StudentLessons";
import StudentExams from "./features/student/exam/StudentExams";
import NotFound from "./features/const/not-found/NotFound";
import AdminUpdates from "./features/admin/updates/AdminUpdates";
import ForgotPassword from "./features/auth/ForgotPassword";
import PasswordResetConfirm from "./features/auth/PasswordResetConfirm";
import ChatInterface from "./features/messages/ChatInterface";
import webSocketService from "./services/WebSocketService";
import { useChatState } from "./hooks/useChatState";
import Dashboard from "./features/dashboard/Dashboard";
import UserProfile from "./features/user-profile/UserProfile";
import Prophylactics from "./features/const/Prophylactics";

const App = () => {
  const chatState = useChatState();
  const {
    isConnected,
    setIsConnected,
  } = chatState;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = getUserCredentials();

  const checkAuth = async () => {
    setIsLoading(true);
    const canLogin = await canUserLogin();
    setIsAuthenticated(canLogin);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      webSocketService.connect(getAccessToken());
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    webSocketService.addConnectionListener(setIsConnected);
  }, [setIsConnected]);

  return (
    <BrowserRouter>
      {isLoading ? (
        <Spin fullscreen />
      ) : isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/" element={<UserLayout user={user} isConnected={isConnected} />}>
            {user.roleName === "ADMIN" && (
              <>
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/courses" element={<CourseList />} />
                <Route path="admin/groups" element={<GroupList />} />
                <Route path="admin/groups/:groupId" element={<ActionsInGroup />} />
                <Route path="admin/lesson-schedules" element={<LessonScheduleList />} />
                <Route path="admin/lesson-schedules/time-table" element={<TimetableView />} />
                <Route path="admin/users" element={<UserList />} />
                <Route path="admin/updates" element={<AdminUpdates />} />
                <Route path="admin/rooms" element={<RoomList />} />
                <Route path="/admin/messages" element={<ChatInterface/>} />
                <Route path="admin/settings" element={<Prophylactics/>} />
              </>
            )}
            {user.roleName === "TEACHER" && (
              <>
                <Route index element={<Navigate to="/teacher/dashboard" />} />
                <Route path="teacher/dashboard" element={<Dashboard user={user}/>} />
                <Route path="teacher/profile" element={<UserProfile user={user} />} />
                <Route path="teacher/groups" element={<TeacherGroupList />} />
                <Route path="teacher/groups/:groupId/tasks" element={<TeacherTaskList />} />
                <Route path="teacher/groups/:groupId/tasks/:taskId/homework" element={<HomeworkList />} />
                <Route path="teacher/messages" element={<ChatInterface/>} />
                <Route path="teacher/lessons" element={<TeacherLessons />} />
                <Route path="teacher/exam" element={<StudentExams />} />
                <Route path="teacher/settings" element={<Prophylactics/>} />
              </>
            )}
            {user.roleName === "STUDENT" && (
              <>
                <Route index element={<Navigate to="/student/dashboard" />} />
                <Route path="student/dashboard" element={<Dashboard user={user}/>} />
                <Route path="student/profile" element={<UserProfile user={user}/>} />
                <Route path="student/subjects" element={<StudentGroupList />} />
                <Route path="student/subjects/:groupId/tasks" element={<StudentHomeworkList />} />
                <Route path="student/messages" element={<ChatInterface/>} />
                <Route path="student/lessons" element={<StudentLessons />} />
                <Route path="student/exam" element={<StudentExams />} />
                <Route path="student/settings" element={<Prophylactics/>} />
              </>
            )}
            <Route path="settings" element={<Prophylactics/>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<PasswordResetConfirm />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;