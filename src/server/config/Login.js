import {HttpRequestHub} from "../HttpRequestHub";

export const signin=(data)=>{
    const config={
        url:'/auth/signin',
        method:'POST',
        data:{
            ...data
        }
    }
    return HttpRequestHub(config);
}