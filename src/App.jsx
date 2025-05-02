import { canUserLogin, getUserCredentials } from "./utils/auth";
import Routers from "./router/Routers";
import Login from "./features/auth/Login";

import { useEffect, useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = getUserCredentials();

  const checkAuth = async () => {
    const canLogin = await canUserLogin();
    setIsAuthenticated(canLogin);
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return isAuthenticated && user ? <Routers user={user} /> : <Login checkAuth={checkAuth} />;
};

export default App;