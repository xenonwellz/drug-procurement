import React from "react";
import NavBar from "./NavBar";


const PageLayout = ({ children }) => {
    return (
        <main className="min-h-screen bg-gray-100 pt-28">
            <NavBar />

            <div className="container p-3">
                {children}
            </div>

        </main>
    );
}

export default PageLayout;
