import React, {useEffect, useState} from "react";
import Routers from "./router/Routers";
import Login from "./pages/login/Login";
import {getToken} from "./util/TokenUtil";

const App = () => {
    const [token, setToken] = useState(getToken());

    useEffect(() => {
        setToken(getToken());
    }, []);

    return token ? <Routers /> : <Login />;
};
export default App;
