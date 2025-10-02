export const ENDPOINTS = {
  //  ---------------  AUTH  --------------------
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  REFRESH: "auth/refresh",
  //  ---------------  ADMIN  -------------------
  ADMIN_DASHBOARD: "admin/dashboard",
  ADMIN_COURSE: "admin/course",
  ADMIN_GROUP: "admin/group",
  ADMIN_LESSON: "admin/lesson",
  ADMIN_USER: "admin/user",
  ADMIN_UPDATE: "admin/update",
  ADMIN_ROOM: "admin/room",
  //  --------------  TEACHER  ------------------
  TEACHER_DASHBOARD: "teacher/dashboard",
  TEACHER_GROUP: "teacher/group",
  TEACHER_LESSON: "teacher/lesson",
  TEACHER_TASK: "teacher/task",
  TEACHER_HOMEWORK: "teacher/homework",
  // ---------------  STUDENT  ------------------
  STUDENT_HOMEWORK_NOTIFICATION: "student/homework/notification",
  STUDENT_DASHBOARD: "student/dashboard",
  STUDENT_GROUP: "student/group",
  STUDENT_LESSON: "student/lesson",
  STUDENT_HOMEWORK: "student/homework",
  // ---------------  PASSWORD --------------------
  PASSWORD_RESET_REQUEST: "password/reset/request",
  PASSWORD_RESET_CONFIRM: "password/reset/confirm",
  CHANGE_PASSWORD: "password/change-password",
  // ---------------  MESSAGE --------------------
  CONVERSATION: "conversation",
  MESSAGES_UNREAD_COUNT: "direct-messages/unread/count",
  MESSAGES_DIRECT: "direct-messages/direct",
  MESSAGES_ROOM: "messages/room",
  MESSAGES: "messages",
  // ---------------  SHARED --------------------
  DOWNLOAD: "download",
  USERINFO: "user-info",
};
