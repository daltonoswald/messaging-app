import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Nav from '../nav/Nav';
import LogIn from "../login/LogIn";
import './signup.styles.css';
import Footer from "../footer/Footer";

export default function SignUp() {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('authenticationToken')) {
            console.log("Already signed in");
            navigate('/');
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const localUrl = `http://localhost:3000/users/sign-up`;

        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            username: event.target.username.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            // profile_picture: event.target.profile_picture.value,
            bio: event.target.bio.value,
        };
        try {
            const response = await fetch(localUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(response)
                navigate('/log-in');
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Error requesting authentication:", error);
        }
    }

    return (
        <>
            <Nav />
            <div className='content'>
                <div className="sign-up-hero">
                    <div className="sign-up-left">
                        <form onSubmit={handleSubmit} className="sign-up-form sign-up-left-content">
                            <h3 className="sign-up-form-title">Sign up</h3>
                            <label htmlFor='first_name'>First Name</label>
                            <input 
                                type='text'
                                id='first_name'
                                name='first_name'
                                required
                            />
                            <label htmlFor='last_name'>Last Name</label>
                            <input 
                                type='text'
                                id='last_name'
                                name='last_name'
                                required
                            />
                            <label htmlFor='username'>Username</label>
                            <input 
                                type='text'
                                id='username'
                                name='username'
                                maxLength={50}
                                required
                            />
                            <label htmlFor="password">Password</label>
                            <input 
                                type='password'
                                id='password'
                                name='password'
                                minLength={8}
                                required
                            />
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input 
                                type='password'
                                id='confirm_password'
                                name='confirm_password'
                                minLength={8}
                                required
                            />
                            {/* <label htmlFor="profile_picture">Profile Picture</label>
                            <input
                                type='file'
                                id='profile_picture'
                                name='profile_picture'
                            /> */}
                            <label htmlFor='bio'>About Me</label>
                            <input 
                                type='text'
                                id='bio'
                                name='bio'
                            />
                            <button className="submit-button" type='submit'>Sign up</button>
                            {message && (
                            <div className='log-in-message'>
                                <p>{message}</p>
                            </div>
                        )}
                        </form>
                    </div>
                    <div className="sign-up-right">
                        <div className='log-in-right-content'>
                            <div className='new-here'>Already have an account?</div>
                            <div className='sign-up-text'>Log in now and get back to chatting!</div>
                            <Link className='link-log-in' to='/log-in'>Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}