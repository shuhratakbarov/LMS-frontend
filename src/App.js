import React from "react";
import Login from "./pages/login/Login";
import {getToken} from "./util/TokenUtil";
import Dashboard from "./pages/dashboard/Dashboard";


export const formatDate = (fetchedDate) =>{
    const date = new Date(fetchedDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
}
class App extends React.Component{

    render() {
        return(
            <React.Fragment>
                {getToken() ?
                    <Dashboard /> :
                    <Login/>
                }
            </React.Fragment>
            // <div>
            //     <Switch>
            //         <Route path="/dashboard" component={Dashboard} />
            //         <Route path="/" component={Login} />
            //     </Switch>
            // </div>
        )
    }
}

export default App;
