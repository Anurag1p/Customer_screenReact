import React from 'react';
import '../assets/css/notfound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="title">404</h1>
            <p className="subtitle">Page Not Found</p>
            <div className="animation-wrapper">
                <div className="ghost">
                    <div className="face"></div>
                </div>
                <div className="shadow"></div>
            </div>
            <p className="message">Sorry, the page you are looking for does not exist.</p>
            <a href="/" className="home-button">Go Home</a>
        </div>
    );
};

export default NotFound;
