import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


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
            const localUrl = `http://localhost:3000/users/user-list`;
            try {
                const response = await fetch(localUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": `${localStorage.getItem('username')}`,
                    },
                })
                if (response.ok) {
                    const usersData = await response.json();
                    console.log(usersData);
                    setUserList(usersData);
                    setIsLoading(false);
                } else {
                    console.error(error);
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
            }
        }
        allUsers();
    }, [token])

    if (isLoading) return (
        <>
            <p>Loading users...</p>
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
                    <div className="user" key={user.id}>
                        <Link
                            to={`/messages/${user._id}`}
                            key={user._id}
                            state={{ user }}
                        >
                            <img src={user.profile_picture}></img>
                            <p>{user.username}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}