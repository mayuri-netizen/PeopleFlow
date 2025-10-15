import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-content">
                <NavLink to="/" className="logo-link">
                    {/* Replace the text with an image tag for your new logo */}
                    <img src="/logo.png" alt="PeopleFlow Logo" className="logo-img" />
                </NavLink>
            </div>
        </header>
    );
};

export default Header;
