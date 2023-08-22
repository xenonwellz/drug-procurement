import React from 'react';
import disconnected from "../imgs/disconneted.png"
import { Link } from "react-router-dom";

const ErrorPage = ({ error }) => {
    let statusText;
    const errCode = Number(error);
    switch (errCode) {
        case -1:
            statusText = 'The page you are looking for could not be found.';
            break;
        case 0:
            statusText = 'No ethereum interface detected or account not connected';
            break;
        case 1:
            statusText = 'Loading..';
            break;
        case 2:
            statusText = 'Contract not deployed on detected network';
            break;
        case 3:
            statusText = 'Connected';
            break;
        default:
            statusText = '';
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-[250px] h-[250px] ring-sky-800/30 bg-[#FAFAFA] overflow-hidden rounded-full flex items-center justify-center">
                <img src={disconnected} alt="" />
            </div>
            {error > 0 ? <div className="mt-2 text-xl font-semibold text-gray-800"> There was an error connecting to the blockchain</div> :
                <div className="mt-2 text-xl font-semibold text-gray-800"> Oops! </div>}
            <div className="font-semibold text-gray-500"> {statusText}</div>
            {error == -1 ? <div><Link className="underline text-sky-800" to="/">Go Home</Link></div> : null}
        </div>
    );
}

export default ErrorPage;
