import Login from "../../pages/login/Login";
import Dashboard from "../../pages/dashboard/Dashboard";
import ReadCourse from "../../pages/content/admin/course/readCourse";
import ReadGroup from "../../pages/content/admin/group/readGroup";
import ReadStudent from "../../pages/content/admin/student/readStudent";
import ReadTeacher from "../../pages/content/admin/teacher/readTeacher";

 const routesData = [
    {
        path:"/",
        component:<Login/>
    },
    {
        path:"/dashboard",
        component:<Dashboard />
    },
    {
        path:"/admin/course",
        component:<ReadCourse/>
    },
    {
        path:"/admin/group",
        component:<ReadGroup/>
    },
    {
        path:"/admin/student",
        component:<ReadStudent/>
    },
    {
        path: "/admin/teacher",
        component: <ReadTeacher/>
    }
]
export default routesData;