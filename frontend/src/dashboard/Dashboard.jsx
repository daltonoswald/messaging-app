import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from '../nav/Nav';
import UserList from "./UserList";

export default function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('authenticationToken')) {
            console.log("");
            navigate('/log-in');
        }
    })

    return (
        <>
            <Nav />
            <div className="content">
                <UserList />
            </div>
        </>
    )
}