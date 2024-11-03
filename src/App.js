import React from "react";
import Routers from "./router/Routers";
import Login from "./pages/login/Login";
import {getToken} from "./util/TokenUtil";

const App = () => {
    return (getToken() ? (<Routers/>) : (<Login/>));
};

export default App;
