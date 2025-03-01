import React, {useEffect, useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import ReadCourse from "../components/admin/courses/readCourse";
import ReadGroup from "../components/admin/groups/readGroup";
import ReadStudent from "../components/admin/students/readStudent";
import ReadTeacher from "../components/admin/teachers/readTeacher";
import GroupList from "../components/teacher/groups/GroupList";
import NotFound from "../pages/not-found/NotFound";
import AdminDashboard from "../components/admin/dashboard/AdminDashboard";
import UserLayout from "../pages/layout/UserLayout";
import MyGroups from "../components/student/groups/MyGroups";
import {ENDPOINTS} from "../server/endpoints";
import {message} from "antd";
import {useAxios} from "../server/AxiosProvider";
import AdminMessages from "../components/admin/messages/AdminMessages";
import TeacherMessages from "../components/teacher/messages/TeacherMessages";
import StudentMessages from "../components/student/messages/StudentMessages";
import TeacherLessons from "../components/teacher/lesson-schedule/TeacherLessons";
import StudentLessons from "../components/student/lesson-schedule/StudentLessons";
import TeacherStats from "../components/teacher/statistics/TeacherStats";
import TeacherInfo from "../components/teacher/info/TeacherInfo";
import StudentStats from "../components/student/statistics/StudentStats";
import StudentInfo from "../components/student/info/StudentInfo";
import Settings from "../components/admin/settings/Settings";
import Login from "../pages/login/Login";
import TeacherDashboard from "../components/teacher/dashboard/TeacherDashboard";
import StudentDashboard from "../components/student/dashboard/StudentDashboard";


const Routers = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const {get, loading} = useAxios();
    const getUserInfo = async () => {
        try {
            const user = await get(ENDPOINTS.USERINFO);
            setUser(user);
            setRole(user.roleName);
        } catch (err) {
            message.error('Failed to fetch user information');
        }
    };


    useEffect(() => {
        getUserInfo();
    }, []);
    return (
        loading ? <p>Loading...</p> :
            <Routes>
                <Route path="/" element={<UserLayout user={user}/>}>
                    {role === 'ROLE_ADMIN' && (
                        <>
                            <Route index element={<Navigate to="/dashboard"/>}/>
                            <Route path="/dashboard" element={<AdminDashboard/>}/>
                            <Route path="/courses" element={<ReadCourse/>}/>
                            <Route path="/groups" element={<ReadGroup/>}/>
                            <Route path="/students" element={<ReadStudent/>}/>
                            <Route path="/teachers" element={<ReadTeacher/>}/>
                            <Route path="/messages" element={<AdminMessages/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    {role === 'ROLE_TEACHER' && (
                        <>
                            <Route index element={<Navigate to="/dashboard"/>}/>
                            <Route path="/dashboard" element={<TeacherDashboard/>}/>
                            <Route path="/my-groups" element={<GroupList/>}/>
                            <Route path="/messages" element={<TeacherMessages/>}/>
                            <Route path="/my-lessons" element={<TeacherLessons/>}/>
                            <Route path="/stats" element={<TeacherStats/>}/>
                            <Route path="/info" element={<TeacherInfo/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    {role === 'ROLE_STUDENT' && (
                        <>
                            <Route index element={<Navigate to="/dashboard"/>}/>
                            <Route path="/dashboard" element={<StudentDashboard/>}/>
                            <Route path="/my-subjects" element={<MyGroups/>}/>
                            <Route path="/messages" element={<StudentMessages/>}/>
                            <Route path="/my-lessons" element={<StudentLessons/>}/>
                            <Route path="/stats" element={<StudentStats/>}/>
                            <Route path="/info" element={<StudentInfo/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
    );
}

export default Routers