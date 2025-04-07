import axios from "axios";
import { ENDPOINTS } from "../server/endpoints";
import { getAccessToken, getRefreshToken, isAccessTokenExpired, setAuthData, deleteAuthData } from "../utils/auth";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (token && isAccessTokenExpired() && getRefreshToken()) {
      try {
        const refreshResponse = await refreshToken();
        if (refreshResponse?.data?.success) {
          setAuthData(refreshResponse.data.data);
          token = getAccessToken();
        } else {
          deleteAuthData();
          window.location.href = "/login";
          return Promise.reject(new Error("Refresh token invalid"));
        }
      } catch (error) {
        deleteAuthData();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    const message = error.response?.data?.error;
    if (error.response?.status === 401) {
      deleteAuthData();
      window.location.href = "/login";
    }
    throw new Error(message);
  }
);
// Authentication
export const login = (credentials) => apiClient.post(ENDPOINTS.LOGIN, credentials);
export const logout = () => apiClient.delete(ENDPOINTS.LOGOUT);
export const refreshToken = () => {
  return axios.post(
    process.env.REACT_APP_API_URL + ENDPOINTS.REFRESH,
    { refreshToken: getRefreshToken() },
    { headers: { "Content-Type": "application/json" } } // can be removed
  );
};
// Admin
export const getAdminDashboardStats = () => apiClient.get(ENDPOINTS.ADMIN_DASHBOARD);
export const getCourseList = (page, size) => apiClient.get(ENDPOINTS.ADMIN_COURSE + "?page=" + page + "&size=" + size);
export const getCourseListBySearch = (searchText, page, size) => apiClient.get(ENDPOINTS.ADMIN_COURSE + "?searching=" + searchText + "&page=" + page + "&size=" + size);
export const createCourse = (courseData) => apiClient.post(ENDPOINTS.ADMIN_COURSE, courseData);
export const updateCourse = (courseId, courseData) => apiClient.put(ENDPOINTS.ADMIN_COURSE + `/${courseId}`, courseData);
export const deleteCourse = (courseId) => apiClient.delete(ENDPOINTS.ADMIN_COURSE + `/${courseId}`);
export const getGroupList = (page, size) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `?page=${page}&size=${size}`);
export const getGroupListBySearch = (searchText, page, size) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `?searching=${searchText}&page=${page}&size=${size}`);
export const getCourseIdAndName = () => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/course-id-and-name`);
export const getTeacherIdAndUsername = () => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/teacher-id-and-username`);
export const createGroup = (groupData) => apiClient.post(ENDPOINTS.ADMIN_GROUP, groupData);
export const updateGroup = (groupId, groupData) => apiClient.put(ENDPOINTS.ADMIN_GROUP + `/${groupId}`, groupData);
export const deleteGroup = (groupId) => apiClient.delete(ENDPOINTS.ADMIN_GROUP + `/${groupId}`);
export const getGroupData = (groupId, page, size) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/group-data/${groupId}?page=${page}&size=${size}`);
export const searchStudent = (searchText) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/search-student?username=${searchText}`);
export const addStudentToGroup = (studentId, groupId) => apiClient.post(ENDPOINTS.ADMIN_GROUP + `/add-student?student-id=${studentId}&group-id=${groupId}`);
export const removeStudentFromGroup = (studentId, groupId) => apiClient.delete(ENDPOINTS.ADMIN_GROUP + `/remove-student/${studentId}?group-id=${groupId}`);
export const getStudentList = (searchText, page, size) => apiClient.get(ENDPOINTS.ADMIN_USER + `?role=student&searching=${searchText}&page=${page}&size=${size}`)
export const getGroupsOfStudent = (studentId) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/groups-of-student/${studentId}`);
export const getTeacherList = (searchText, page, size) => apiClient.get(ENDPOINTS.ADMIN_USER+`?role=teacher&searching=${searchText}&page=${page}&size=${size}`)
export const getGroupsOfTeacher = (teacherId) => apiClient.get(ENDPOINTS.ADMIN_GROUP + `/groups-of-teacher/${teacherId}`)
export const getGroupIdAndName = () => apiClient.get(ENDPOINTS.ADMIN_GROUP + "/group-id-and-name")
export const addUser = (user) => apiClient.post(ENDPOINTS.ADMIN_USER, user);
export const editUser = (user) => apiClient.put(ENDPOINTS.ADMIN_USER + `/${user.id}`, user);
export const deleteUser = (id) => apiClient.delete(ENDPOINTS.ADMIN_USER + `/${id}`);
// Teacher
export const getTeacherGroups = (searchText, page, size) => apiClient.get(ENDPOINTS.TEACHER_GROUP + `?keyword=${searchText}&page=${page}&size=${size}`)
export const getTeacherTaskList = (groupId) => apiClient.get(ENDPOINTS.TEACHER_TASK + `?group-id=${groupId}`)
export const createTeacherTask = (taskData) => apiClient.post(ENDPOINTS.TEACHER_TASK, taskData);
export const updateTeacherTask = (taskId, taskData) => apiClient.put(ENDPOINTS.TEACHER_TASK + `/${taskId}`, taskData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteTeacherTask = (taskId) => apiClient.delete(ENDPOINTS.TEACHER_TASK + `/${taskId}`);
export const getTeacherHomeworkList = (taskId, groupId, page, size) => apiClient.get(ENDPOINTS.TEACHER_HOMEWORK + `?task-id=${taskId}&group-id=${groupId}&page=${page}&size=${size}`);
export const evaluateHomework = (homeworkId, data) => apiClient.patch(ENDPOINTS.TEACHER_HOMEWORK + `/${homeworkId}`, data);
// Student
export const getStudentSubjectList = (searchText, page, size) => apiClient.get(ENDPOINTS.STUDENT_GROUP + `?keyword=${searchText}&page=${page}&size=${size}`);
export const getStudentHomework = (groupId) => apiClient.get(ENDPOINTS.STUDENT_HOMEWORK + `?group-id=${groupId}`);
export const uploadHomework = (taskId, homework) => apiClient.post(ENDPOINTS.STUDENT_HOMEWORK + `?task-id=${taskId}`, homework);
export const reUploadHomework = (homeworkId, taskId, homework) => apiClient.patch(ENDPOINTS.STUDENT_HOMEWORK + `/${homeworkId}?task-id=${taskId}`, homework);
// Shared
export const download = (groupId, fileId) => apiClient.get(ENDPOINTS.DOWNLOAD + `/${groupId}?file-id=${fileId}`,{ responseType: "blob" })
export const getUserInfo = () => apiClient.get(ENDPOINTS.USERINFO);

export default apiClient;