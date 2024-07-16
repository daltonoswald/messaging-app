import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../nav/Nav';

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
               <h1>{userData.username}</h1> 
               <h3>{userData.first_name} {userData.last_name}</h3>
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
               {(!userData.friends) && (
                <>
                    <p>No friends yet...</p>
                </>
               )}
               {/* <button onClick={handleAddFriend}>Add Friend</button> */}
            </div>
        </>
    )
}