import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Nav from '../nav/Nav';
import Footer from "../footer/Footer";

export default function ErrorPage() {

    return (
        <>
            <Nav />
            <div className="content">
                <div className="error-title">
                    <h1>Uh oh! Whatever you were looking for doesn't exist. Let's get you back on track.</h1>
                </div>
                <div className="error-link">
                    <Link to='/dashboard'>Dashboard</Link>
                </div>
            </div>
            <Footer />
        </>
    )
}