import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="custom-loader"></div>
            <div className="text-blue-500/80 font-bold tracking-widest animate-pulse text-xs uppercase">
                Loading
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-[var(--bg-color)] z-[9999] flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return (
        <div className="w-full py-20 flex items-center justify-center">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
