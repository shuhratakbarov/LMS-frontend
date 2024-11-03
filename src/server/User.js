import {HttpRequestHub} from "../HttpRequestHub";

export const userInfo=()=>{
    const config={
        url:'/user/get-user-info',
        method:'GET',
    }
    return HttpRequestHub(config);
}