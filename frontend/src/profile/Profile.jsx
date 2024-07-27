import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../nav/Nav';
import Footer from "../footer/Footer";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || location.state?.friend;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            const localUrl = `http://localhost:3000/users/profile/${user._id}`;

            const token = localStorage.getItem('authenticationToken')
            try {
                const response = await fetch(localUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": `${localStorage.getItem('username')}`,
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const userData = await response.json();
                    console.log(userData);
                    setUserData(userData)
                    setIsLoading(false);
                } else {
                    console.error(error);
                    setIsLoading(false);
                    setError(true);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
                setIsLoading(false);
                setError(error);
            }
        }
        getUserProfile();
    }, [token])

    const handleAddFriend = async (event) => {
        event.preventDefault();
        const stringedId = (user._id).toString();
        const localUrl = `http://localhost:3000/users/add-friend/${user._id}`;
        const friendData = {
            text: stringedId
        }
        console.log(friendData);

        try {
            const token = localStorage.getItem('authenticationToken')
            const response = await fetch(localUrl, 
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(friendData)
            });
            const data = await response.json();
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error requesting:", error);
            console.log(error);
        }
    }

    const handleNewMessage = async (event) => {
        event.preventDefault();
        const receiver = (user._id).toString();
        const messageData = {
            receiver: receiver,
            content: event.target.content.value
        }
        console.log(messageData);

    }

    if (isLoading) return (
        <>
            <p>Loading profile</p>
        </>
    )
    if (error) return (
        <>
            <p>Error, please try again later</p>
        </>
    )


    return (
        <>
            <Nav />
            <div className="content">
                <div className="profile-info">
                    <div className="profile-info-top">
                        <h1>{userData.username}</h1>
                        <button onClick={handleAddFriend}>Add Friend</button>
                    </div>
                    <div className="profile-info-middle">
                        <h3>{userData.first_name} {userData.last_name}</h3>
                    </div>
                    <div className="profile-info-bottom">
                        <div className="profile-info-bottom-header">
                            {userData.username}'s friends
                        </div>
                    {userData.friends && (
                        <>
                    {userData.friends.map((friend) => (
                        <div className="friend" key={friend._id}>
                            {/* <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                state={{ user }}
                                > */}
                                    {/* <img src={friend.profile_picture}></img> */}
                                    <p>{friend.username}</p>
                            {/* </Link> */}
                        </div>
                    ))}
                    </>
                    )}
                    {(userData.friends) && (
                        <>
                            <p>No friends yet...</p>
                        </>
                    )}
                    </div>
                </div>
                <div className="chatbox">
                    <div className="new-message">
                        <form onSubmit={handleNewMessage} className="new-message-form">
                            <label htmlFor='content'>Message</label>
                            <input
                                type='text'
                                id='content'
                                required
                            />
                            <button className="send-message" type='submit'>Send</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}