import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "../features/teacher/dashboard/TeacherDashboard";
import TeacherGroupList from "../features/teacher/groups/TeacherGroupList";
import TeacherTaskList from "../features/teacher/groups/task-list/TeacherTaskList";
import HomeworkList from "../features/teacher/groups/task-list/homework-list/TeacherHomeworkList";
import TeacherMessages from "../features/teacher/messages/TeacherMessages";
import TeacherLessons from "../features/teacher/lesson-schedule/TeacherLessons";
import TeacherStats from "../features/teacher/statistics/TeacherStats";
import TeacherInfo from "../features/teacher/info/TeacherInfo";

const TeacherRoutes = () => {
  return (
    <>
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="profile" element={<TeacherDashboard />} />
      <Route path="lessons" element={<TeacherLessons />} />
      <Route path="groups" element={<TeacherGroupList />} />
      <Route path="groups/:groupId/tasks" element={<TeacherTaskList />} />
      <Route path="groups/:groupId/tasks/:taskId/homework" element={<HomeworkList />} />
      <Route path="messages" element={<TeacherMessages />} />
      <Route path="stats" element={<TeacherStats />} />
      <Route path="info" element={<TeacherInfo />} />
    </>
  );
};

export default TeacherRoutes;