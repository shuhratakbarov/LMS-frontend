import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../features/student/dashboard/StudentDashboard";
import StudentGroupList from "../features/student/groups/StudentGroupList";
import StudentHomeworkList from "../features/student/groups/task-list/StudentHomeworkList";
import StudentMessages from "../features/student/messages/StudentMessages";
import StudentLessons from "../features/student/lesson-schedule/StudentLessons";
import StudentExams from "../features/student/exam/StudentExams";
import StudentInfo from "../features/user-profile/UserProfile";

const StudentRoutes = () => {
  return (
    <>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<StudentDashboard />} />
      <Route path="subjects" element={<StudentGroupList />} />
      <Route path="subjects/:groupId/tasks" element={<StudentHomeworkList />} />
      <Route path="messages" element={<StudentMessages />} />
      <Route path="lessons" element={<StudentLessons />} />
      <Route path="stats" element={<StudentExams />} />
      <Route path="info" element={<StudentInfo />} />
    </>
  );
};

export default StudentRoutes;