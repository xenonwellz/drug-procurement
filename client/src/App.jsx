import React, { useContext } from "react";
import { Web3Context } from './utils/contexts/Contract';
import { RouterProvider } from "react-router-dom";
import routes from "./utils/Routes";
import Loading from "./components/Loading";
import ErrorPage from "./components/ErrorPage";
import "./index.css";


const App = () => {

  const { connectionStatus } = useContext(Web3Context);

  return (
    connectionStatus === 3 ? <RouterProvider router={routes} />
      : connectionStatus === 1 ?
        <Loading />
        : <ErrorPage error={connectionStatus} />
  );
}

export default App;
