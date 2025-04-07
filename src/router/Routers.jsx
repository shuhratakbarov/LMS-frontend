import { Routes, Route, Navigate } from "react-router-dom";
import CourseList from "../components/admin/courses/CourseList";
import ReadGroup from "../components/admin/groups/GroupList";
import StudentList from "../components/admin/students/StudentList";
import ReadTeacher from "../components/admin/teachers/TeacherList";
import GroupList from "../components/teacher/groups/TeacherGroupList";
import NotFound from "../pages/not-found/NotFound";
import StudentGroupList from "../components/student/groups/StudentGroupList";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";
import UserLayout from "../pages/layout/UserLayout";
import Inbox from "../components/admin/messages/Inbox";
import TeacherMessages from "../components/teacher/messages/TeacherMessages";
import StudentMessages from "../components/student/messages/StudentMessages";
import TeacherLessons from "../components/teacher/lesson-schedule/TeacherLessons";
import StudentLessons from "../components/student/lesson-schedule/StudentLessons";
import TeacherStats from "../components/teacher/statistics/TeacherStats";
import TeacherInfo from "../components/teacher/info/TeacherInfo";
import StudentStats from "../components/student/statistics/StudentStats";
import StudentInfo from "../components/student/info/StudentInfo";
import Settings from "../components/admin/settings/Settings";
import Login from "../features/auth/Login";
import TeacherDashboard from "../components/teacher/dashboard/TeacherDashboard";
import StudentDashboard from "../components/student/dashboard/StudentDashboard";
import ActionsInGroup from "../components/admin/groups/ActionsInGroup";
import TeacherTaskList from "../components/teacher/groups/task-list/TeacherTaskList";
import HomeworkList from "../components/teacher/groups/task-list/homework-list/TeacherHomeworkList";
import StudentHomeworkList from "../components/student/groups/task-list/StudentHomeworkList";

const Routers = ({ user }) => {
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<UserLayout user={user} />}>
        {user.roleName === "ROLE_ADMIN" && (
          <>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/profile" element={<AdminDashboard />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/groups" element={<ReadGroup />} />
            <Route path="/groups/:groupId" element={<ActionsInGroup />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/teachers" element={<ReadTeacher />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
        {user.roleName === "ROLE_TEACHER" && (
          <>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/profile" element={<TeacherDashboard />} />
            <Route path="/my-groups" element={<GroupList />} />
            <Route path="/my-groups/:groupId/tasks" element={<TeacherTaskList />} />
            <Route path="/my-groups/:groupId/tasks/:taskId/homework" element={<HomeworkList />} />
            <Route path="/messages" element={<TeacherMessages />} />
            <Route path="/my-lessons" element={<TeacherLessons />} />
            <Route path="/stats" element={<TeacherStats />} />
            <Route path="/info" element={<TeacherInfo />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
        {user.roleName === "ROLE_STUDENT" && (
          <>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentDashboard />} />
            <Route path="/my-subjects" element={<StudentGroupList />} />
            <Route path="/my-subjects/:groupId/tasks" element={<StudentHomeworkList />} />
            <Route path="/messages" element={<StudentMessages />} />
            <Route path="/my-lessons" element={<StudentLessons />} />
            <Route path="/stats" element={<StudentStats />} />
            <Route path="/info" element={<StudentInfo />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Routers;
