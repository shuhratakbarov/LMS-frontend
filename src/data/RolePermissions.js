export const permissions=[
    {
        role_name:"ROLE_ADMIN",
        links:[
            "/groups",
            "/courses",
            "/students",
            "/teachers",
        ]
    },

    {
        role_name:"ROLE_TEACHER",
        links:[
            "/groups",
            "/students",
        ]
    },
    {
        role_name:"ROLE_STUDENT",
        links:[
            "/my-tasks",
            "/groups "
        ]
    }
]