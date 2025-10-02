import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../features/admin/dashboard/AdminDashboard";
import CourseList from "../features/admin/courses/CourseList";
import GroupList from "../features/admin/groups/GroupList";
import ActionsInGroup from "../features/admin/groups/ActionsInGroup";
import LessonScheduleList from "../features/admin/lesson-schedule/list-view/LessonScheduleList";
import TimetableView from "../features/admin/lesson-schedule/time-table-view/TimetableView";
import UserList from "../features/admin/users/UserList";
import RoomList from "../features/admin/rooms/RoomList";
import Inbox from "../features/admin/messages/Inbox";
import Settings from "../features/admin/settings/Settings";

const AdminRoutes = () => {
  return (
    <>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="courses" element={<CourseList />} />
      <Route path="groups" element={<GroupList />} />
      <Route path="groups/:groupId" element={<ActionsInGroup />} />
      <Route path="lesson-schedules" element={<LessonScheduleList />} />
      <Route path="lesson-schedules/time-table" element={<TimetableView />} />
      <Route path="users" element={<UserList />} />
      <Route path="rooms" element={<RoomList />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="settings" element={<Settings />} />
    </>
  );
};

export default AdminRoutes;