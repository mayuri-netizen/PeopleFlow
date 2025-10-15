import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
    return (
        <div className="skeleton-table">
            <div className="skeleton-row-header">
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="skeleton-row" key={index}>
                    <div className="skeleton-cell profile"></div>
                    <div className="skeleton-cell"></div>
                    <div className="skeleton-cell"></div>
                    <div className="skeleton-cell"></div>
                    <div className="skeleton-cell"></div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;

