import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import Nav from '../nav/Nav';
import Footer from "../footer/Footer";
import Chatbox from "./Chatbox";
import friendRemove from '../assets/icons/friend-remove.svg';
import friendAdd from '../assets/icons/friend-add.svg';
import './profile.styles.css';
import Loading from "../loading/Loading";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || location.state?.friend || location.state[1]
    // const user = location.state[1]
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userData, setUserData] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);
    const [myFriends, setMyFriends] = useState(null);
    const [friendsListLoading, setFriendsListLoading] = useState(true);

    useEffect(() => {
        const findMyFriends = async () => {
            const localUrl = `http://localhost:3000/users/my-friends`;
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
                    const myData = await response.json();
                    console.log(myData);
                    setMyFriends(myData)
                    setFriendsListLoading(false);
                } else {
                    console.error(error);
                    setError(true);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        findMyFriends();
    }, [token])


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
                    setUserData(userData)
                    setFormattedDate(format(userData.date_joined, 'MM-dd-yyyy'))
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

    const handleRemoveFriend = async (event) => {
        event.preventDefault();
        const stringedId = userData._id.toString();
        const localUrl = `http://localhost:3000/users/remove-friend/${user._id}`
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
            <Loading />
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
                        {(!friendsListLoading) && (
                            <>
                                {(myFriends.friends.includes(userData._id) && (
                                    <button className="remove-friend-button" onClick={handleRemoveFriend}>
                                        <img className="remove-friend-icon" id={userData._id} src={friendRemove} alt='remove friend' /> 
                                    </button>
                                ))}
                                {(!myFriends.friends.includes(userData._id) && (
                                    <button className="add-friend-button" onClick={handleAddFriend}>
                                        <img className="add-friend-icon" id={userData._id} src={friendAdd} alt='add friend' />
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                    <div className="profile-info-middle">
                        <h3>{userData.first_name} {userData.last_name}</h3>
                        <p>{userData.bio}</p>
                        <p>Member since: {formattedDate}</p>
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
                    {(userData.friends.length === 0) && (
                        <>
                            <p>No friends yet...</p>
                        </>
                    )}
                    </div>
                </div>
                <Chatbox user={user}/>
            </div>
            <Footer />
        </>
    )
}