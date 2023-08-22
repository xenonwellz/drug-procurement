import React from 'react';

const Loading = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-10 h-10 rounded-full animate-spin border-y-sky-600 border-4 border-x-sky-200"></div>
        </div>
    );
}

export default Loading;
