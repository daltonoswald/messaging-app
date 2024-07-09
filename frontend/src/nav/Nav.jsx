import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './nav.styles.css'

export default function Nav() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    return (
        <div className='nav'>
            <div className='nav-left'>
                <Link to='/'>
                    <p className='nav-title'>Chit<span className='nav-title-right'>Chat</span></p>
                </Link>
            </div>
            <div className='nav-right'>
                {localStorage.getItem('authenticationToken') && (
                    <>
                        <p>{localStorage.getItem('username')}</p>
                        <button onClick={logout}>Log out</button>
                    </>
                )}
                {!localStorage.getItem('authenticationToken') && (
                    <>
                        <Link to='/log-in'>Log in</Link>
                        <Link to='/sign-up'>Sign up</Link>
                    </>
                )}
            </div>
        </div>
    )
}