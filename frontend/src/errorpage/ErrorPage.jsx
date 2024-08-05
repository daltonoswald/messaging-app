import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Nav from '../nav/Nav';
import Footer from "../footer/Footer";
import './errorpage.styles.css'

export default function ErrorPage() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <>
            <Nav />
            <div className="content">
                <div className="error-page">
                    <div className="error-title">
                        <h1>Uh oh! Whatever you were looking for doesn't exist. Let's get you back on track.</h1>
                    </div>
                    <div className="error-link">
                        <Link to='/'>Dashboard</Link>
                        <Link to='/log-in'>Log in</Link>
                        <button className="error-logout" onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}