import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../nav/Nav';
import SignUp from '../signup/SignUp';
import './login.styles.css';
import Footer from '../footer/Footer';

export default function LogIn() {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('authenticationToken')) {
            console.log('Already signed in')
            navigate('/');
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const localUrl = `http://localhost:3000/users/log-in`;

        const formData = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        try {
            const response = await fetch(localUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                mode: 'cors',
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.token;
                const user = data.user;
                localStorage.setItem('authenticationToken', token);
                localStorage.setItem('username', user.username);
                navigate('/');
            } else {
                console.error("Error during authentication:", data.message);
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Error requesting authentication:", error);
            console.log(error);
            // setMessage(error);
        }
    }

    return (
        <>
            <Nav />
            <div className='content'>
                <div className='log-in-hero'>
                    <div className='log-in-left'>
                            <div className='log-in-left-content'>
                            <div className='welcome-back'>Welcome Back</div>
                            <form onSubmit={handleSubmit} className='log-in-form'>
                                <label htmlFor='username'>Username</label>
                                <input
                                    type='text'
                                    id='username'
                                    required
                                />
                                <label htmlFor='password'>Password</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    minLength={8}
                                    required
                                />
                                <button className='submit-button' type='submit'>Log in</button>
                            </form>
                            {message && (
                            <div className='log-in-message'>
                                <p>{message}</p>
                            </div>
                            )}
                        </div>
                    </div>
                    <div className='log-in-right'>
                            <div className='log-in-right-content'>
                            <div className='new-here'>New Here?</div>
                            <div className='sign-up-text'>Sign up now and join the community!</div>
                            <Link className='link-sign-up' to='/sign-up'>Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )

}