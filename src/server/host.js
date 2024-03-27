import axios from "axios";
import {host,port} from "./const";
import {getToken} from "../util/TokenUtil";

let token= getToken();
const headers={
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": token ? `Bearer ${token}` : null
}

export const axiosInstant=axios.create({
     baseURL: `${host}:${port}/api`,
     timeout:5000,
     headers:{
       ...headers
     }}

 );
