import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import './userlist.styles.css'


export default function UserList() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!localStorage.getItem('authenticationToken')) {
    //         navigate('/log-in');
    //     }
    // })

    // const allUsers = async () => {
    //     const localUrl = `http://localhost:3000/users/user-list`;

    //     try {
    //         const response = await fetch(localUrl)
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

    // useEffect(() => {
    //     try {
    //         const userListData = async () => {
    //             const usersData = await allUsers();
    //             setUserList(usersData);
    //             setIsLoading(false);
    //         }
    //         userListData();
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.log(error);
    //         throw error;
    //     }
    // }, []);

    // const allUsers = async () => {
    //     const localUrl = `http://localhost:3000/users/user-list`;
    //     try {
    //         const response = await fetch(localUrl, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Username": `${localStorage.getItem('username')}`,
    //             },
    //         })
    //         if (response.ok) {
    //             const usersData = await response.json();
    //             setUserList(usersData);
    //             setIsLoading(false);
    //         } else {
    //             console.error(error);
    //         }
    //     } catch (error) {
    //         console.error(`Errors: ${error}`);
    //     }
    // }

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const allUsers = async () => {
            // const localUrl = `http://localhost:3000/users/user-list`;
            const devUrl = `https://daltonoswald-messaging-app.up.railway.app/users/user-list`;

            const token = localStorage.getItem('authenticationToken')
            try {
                const response = await fetch(devUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": `${localStorage.getItem('username')}`,
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const usersData = await response.json();
                    setUserList(usersData);
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
        allUsers();
    }, [token])

    if (isLoading) return (
        <>
            <p>Loading...</p>
        </>
    )
    if (error) return (
        <>
            <p>Error, please try again later</p>
        </>
    )

    return (
        <>
            <div className="user-list">
                {userList.map((user) => (
                    <div className="user" key={user._id}>
                        <Link
                            to={`/profile/${user._id}`}
                            key={user._id}
                            state={{ user }}
                            className="user-link"
                        >
                            <img src={user.profile_picture}></img>
                            <p>{user.username}</p>
                            <p>{user.first_name} {user.last_name}</p>
                            <p>{user.bio}</p>
                        </Link>
                        {/* <Link 
                            to={`/`}
                            state={{ user }}
                            >
                                Chat
                            </Link> */}
                    </div>
                ))}
            </div>
        </>
    )
}