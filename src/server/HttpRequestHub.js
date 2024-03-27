import {axiosInstant} from "./host";

export const HttpRequestHub=(config)=>{
   return  axiosInstant(config);
}