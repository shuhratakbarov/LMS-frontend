import React, {useEffect, useState} from 'react'
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
import {ENDPOINTS} from "../server/endpoints";
import {message} from "antd";
import {useAxios} from "../server/AxiosProvider";
import AdminMessages from "../components/admin/messages/AdminMessages";
import TeacherMessages from "../components/teacher/TeacherMessages";
import StudentMessages from "../components/student/StudentMessages";
import TeacherLessons from "../components/teacher/TeacherLessons";
import StudentLessons from "../components/student/StudentLessons";
import TeacherStats from "../components/teacher/TeacherStats";
import TeacherInfo from "../components/teacher/TeacherInfo";
import StudentStats from "../components/student/StudentStats";
import StudentInfo from "../components/student/StudentInfo";
import Settings from "../components/admin/settings/Settings";


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
                            <Route path="/admin/messages" element={<AdminMessages/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    {role === 'ROLE_TEACHER' && (
                        <>
                            <Route index element={<Navigate to="/my-groups"/>}/>
                            <Route path="/my-groups" element={<GroupsList/>}/>
                            <Route path="/teacher/messages" element={<TeacherMessages/>}/>
                            <Route path="/teacher/my-lessons" element={<TeacherLessons/>}/>
                            <Route path="/teacher/stats" element={<TeacherStats/>}/>
                            <Route path="/teacher/info" element={<TeacherInfo/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    {role === 'ROLE_STUDENT' && (
                        <>
                            <Route index element={<Navigate to="/my-subjects"/>}/>
                            <Route path="/my-subjects" element={<GroupsOfStudent/>}/>
                            <Route path="/student/messages" element={<StudentMessages/>}/>
                            <Route path="/student/my-lessons" element={<StudentLessons/>}/>
                            <Route path="/student/stats" element={<StudentStats/>}/>
                            <Route path="/student/info" element={<StudentInfo/>}/>
                            <Route path="/settings" element={<Settings/>}/>
                        </>
                    )}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
    );
}

export default Routers