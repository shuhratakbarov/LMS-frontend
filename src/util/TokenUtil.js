import {token_expired, token_name} from "./const";

export const getToken=()=>{
   let str= localStorage.getItem(token_name);
   if (str){
       let data = JSON.parse(str);
       const now = new Date();
       if (now.getTime() > data.expiry){
           localStorage.removeItem(token_name);
           return null;
       }
       return data.token;
   }
   return null;
}

export function setToken(token){
    if (getToken()){
        deleteToken();
    }

    const now = new Date();
    let data={
        token:token,
        expiry: now.getTime() + token_expired
    }
    localStorage.setItem(token_name,JSON.stringify(data))
}
export function deleteToken(){
    localStorage.removeItem(token_name);
}
