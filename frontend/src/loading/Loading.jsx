import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Nav from '../nav/Nav';
import Footer from "../footer/Footer";
import './loading.styles.css'

export default function Loading() {

    return (
        <>
            <div className="fake-nav"></div>
            <div className="content">
                <div className="loading-page">
                    Loading...
                </div>
            </div>
            <Footer />
        </>
    )
}