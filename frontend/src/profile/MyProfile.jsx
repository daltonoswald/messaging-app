import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../nav/Nav';
import './myProfile.styles.css'
import Footer from "../footer/Footer";

export default function MyProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedInUser = location.state?.loggedInUser;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userData, setUserData] = useState(null);

    console.log(loggedInUser);

    useEffect(() => {
        const getUserProfile = async () => {
            const localUrl = `http://localhost:3000/users/profile/${loggedInUser._id}`;
            console.log(loggedInUser);

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

    const handleRemoveFriend = async (event) => {
        event.preventDefault();
        const stringedId = userData._id.toString();
        const localUrl = `http://localhost:3000/users/remove-friend/${event.target.id}`
        const removeData = {
            text: stringedId
        }
        console.log(removeData)

        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(localUrl,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(removeData)
                })
                const data = await response.json();
                console.log(response);
                if (response.ok) {
                    window.location.reload();
                }
        } catch (error) {
            console.error("Error requesting:", error);
            console.log(error);
        }
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
                <div className="my-profile-hero">
                    <div className="user-data">
                        <h1>{userData.username}</h1> 
                        <h3>{userData.first_name} {userData.last_name}</h3> 
                        <p>{userData.bio}</p>
                    </div>

                {userData.friends && (
                    <>
                    <div className="friends-list">
                        <h3>My Friends</h3>
                    {userData.friends.map((friend) => (
                        <div className="friend" key={friend._id}>
                            {/* <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                state={{ user }}
                                > */}
                                    {/* <img src={friend.profile_picture}></img> */}
                                    <p>{friend.username}</p>
                                    <button id={friend._id} onClick={handleRemoveFriend}>Remove Friend</button>
                            {/* </Link> */}
                        </div>
                    ))}
                </div>
                </>
                )}
                {(!userData.friends) && (
                    <>
                        <p>No friends yet...</p>
                    </>
                )}
                {/* <button onClick={handleAddFriend}>Add Friend</button> */}
                </div>
            </div>
            <Footer />
        </>
    )
}