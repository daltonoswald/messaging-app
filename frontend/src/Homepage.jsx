import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate, Link } from 'react-router-dom'
import Nav from './nav/Nav'

function Homepage() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('username');
    navigate('/');
  }

  return (
    <>
      <Nav />
      <div className='content'>
        <Link to='/log-in'>Log in</Link>
        <Link to='/sign-up'>Sign up</Link>
        <Link to='/dashboard'>Dashboard</Link>
      </div>
    </>
  )
}

export default Homepage
