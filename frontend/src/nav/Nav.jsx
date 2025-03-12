import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './nav.styles.css'

export default function Nav() {
    const [loggedInUser, setLoggedInUser] = useState('')
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('authenticationToken');

    function logout() {
        localStorage.removeItem('authenticationToken');
        localStorage.removeItem('username');
        navigate('/');
    }

    useEffect(() => {
        if (!localStorage.getItem('authenticationToken')) {
            localStorage.removeItem('authenticationToken');
            localStorage.removeItem('username');
        }
    }, [token])

    // useEffect(() => {
    //     const myProfile = async () => {
    //         // const localUrl = `http://localhost:3000/users/my-profile`;
    //         const devUrl = `https://daltonoswald-messaging-app.up.railway.app/users/my-profile`;
    //         try {
    //             const response = await fetch(devUrl, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Username": `${localStorage.getItem('username')}`,
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             })
    //             if (response.ok) {
    //                 const myData = await response.json();
    //                 setLoggedInUser(myData)
    //                 console.log(myData)
    //                 setIsLoading(false);
    //                 localStorage.setItem("username", myData.username);
    //                 localStorage.setItem('myId', myData._id);
    //             } else {
    //                 console.error(error);
    //                 setIsLoading(false);
    //                 setError(true);
    //             }
    //         } catch (error) {
    //             console.error(`Errors: ${error}`);
    //         }
    //     }
    //     if (token) {
    //         myProfile();  
    //     }
    // }, [token])

    // if (isLoading) return (
    //     <>
    //         <p className='nav-loading'>Loading...</p>
    //     </>
    // )

    return (
        <div className='nav'>
            <div className='nav-left'>
                <Link to='/'>
                    <p className='nav-title'>&#91;Chit<span className='nav-title-right'>Chat&#93;</span></p>
                </Link>
            </div>
            <div className='nav-right'>
                {(localStorage.getItem('authenticationToken')) && (
                    <>
                        <Link
                            to={`/my-profile/`}
                            // key={ loggedInUser._id }
                            key={localStorage.getItem('myId')}
                            state={{loggedInUser}}
                        // >{loggedInUser.username}</Link>
                        >{localStorage.getItem('username')}</Link>
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