import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import ReadCourse from "../components/admin/course/readCourse";
import ReadGroup from "../components/admin/group/readGroup";
import ReadStudent from "../components/admin/student/readStudent";
import ReadTeacher from "../components/admin/teacher/readTeacher";
import GroupsList from "../components/teacher/GroupsList";
import NotFound from "../pages/not-found/NotFound";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";
import UserLayout from "../pages/layout/UserLayout";
import GroupsOfStudent from "../components/student/GroupsOfStudent";

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Navigate to="/dashboard"/>}/>
                <Route path="/dashboard" element={<AdminDashboard/>}/>
                <Route path="/courses" element={<ReadCourse/>}/>
                <Route path="/groups" element={<ReadGroup/>}/>
                <Route path="/students" element={<ReadStudent/>}/>
                <Route path="/teachers" element={<ReadTeacher/>}/>
                <Route path="/my-groups" element={<GroupsList/>}/>
                <Route path="/my-subjects" element={<GroupsOfStudent/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Route>
        </Routes>
    )
}

export default Routers