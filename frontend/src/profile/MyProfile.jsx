import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { format } from 'date-fns';
import Nav from '../nav/Nav';
import './myProfile.styles.css'
import Footer from "../footer/Footer";
import friendRemove from '../assets/icons/friend-remove.svg';
import editIcon from '../assets/icons/edit.svg';

export default function MyProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedInUser = location.state?.loggedInUser;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userData, setUserData] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [bio, setBio] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            // const localUrl = `http://localhost:3000/users/profile/${loggedInUser._id}`;
            const localUrl = `http://localhost:3000/users/my-profile`;

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
                    console.log(userData);
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

    const handleEditToggle = () => {
        setOpenEdit(!openEdit);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setBio(userData.bio);
    }

    const handleProfileEdit = async (event) => {
        event.preventDefault();
        const localUrl = `http://localhost:3000/users/update-user`
        const updatedData = {
            first_name: firstName,
            last_name: lastName,
            bio: bio,
        };
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch (localUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            })
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error requesting:", error);
        }
    }

    const handleBio = (e) => {
        setBio(e.target.value);
    }

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
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
                    <div className="my-profile">
                        <div className="my-profile-header">
                            <h1>{userData.username}</h1> 
                            <button className="edit-profile-button" onClick={handleEditToggle}>
                                            <img className="edit-profile-icon" src={editIcon} alt='edit profile' /> 
                            </button>
                        </div>
                        <h3>{userData.first_name} {userData.last_name}</h3> 
                        <p>{userData.bio}</p>
                        <p>Member since: {formattedDate}</p>
                    </div>

                <div className="friends-list">
                {userData.friends && (
                    <>
                    {/* <div className="friends-list"> */}
                        <h3>My Friends</h3>
                    <div className="friends-list-friends">
                        {userData.friends.map((friend) => (
                            <div className="friend" key={friend._id}>
                                <Link
                                    to={`/profile/${friend._id}`}
                                    key={friend._id}
                                    state={{ friend }}
                                    >
                                        {/* <img src={friend.profile_picture}></img> */}
                                        <p>{friend.username}</p>
                                        <button className="remove-friend-button" id={friend._id} onClick={handleRemoveFriend}>
                                            <img className="remove-friend-icon" id={friend._id} src={friendRemove} alt='remove friend' />
                                        </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                {/* </div> */}
                </>
                )}
                {(userData.friends.length === 0) && (
                    <>
                        <p>No friends yet...</p>
                    </>
                )}
                </div>
                <div className="my-chats">
                {userData.chats && (
                    <>
                        <h3>My Chats</h3>
                        <div className="my-chats-list">
                            {userData.chats.map((chat) => (
                                <div className='profile-chat' key={chat._id}>
                                    <Link 
                                        to={`/profile/${chat.users[1]._id}`}
                                        key={chat.users[1]._id}
                                        state={chat.users}
                                    >
                                        {chat.users.filter((user) => user.username !== userData.username).map((user) => (
                                            <p>{user.username}</p>
                                        ))}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {(userData.chats.length === 0) && (
                    <>
                        <p>No chats yet...</p>
                    </>
                )}
                </div>
                </div>
                {openEdit && (
                    <div className="my-profile-edit">
                        <form onSubmit={handleProfileEdit} className="edit-profile-form">
                            <label htmlFor="first_name">First Name:</label>
                            <input
                                type='text'
                                id='first_name'
                                name='first_name'
                                minLength={0}
                                maxLength={50}
                                defaultValue={userData.first_name}
                                onChange={handleFirstName}
                                required
                            />
                            <label htmlFor="last_name">Last Name:</label>
                            <input
                                type='text'
                                id='last_name'
                                name='last_name'
                                minLength={0}
                                maxLength={50}
                                defaultValue={userData.last_name}
                                onChange={handleLastName}
                                required
                            />
                            <label htmlFor="bio">Bio: </label>
                            <input 
                                type='text'
                                id='bio'
                                name='bio'
                                minLength={0}
                                maxLength={100}
                                defaultValue={userData.bio}
                                onChange={handleBio}
                            />
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}