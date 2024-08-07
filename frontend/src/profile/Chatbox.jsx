import { useState, useEffect, useRef } from "react";
import './chatbox.styles.css'

export default function Chatbox({ user }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [messageImage, setMessageImage] = useState(null);

    useEffect(() => {
        const getChats = async () => {
            // const localUrl = `http://localhost:3000/chats/get-chats`;
            const devUrl = `https://daltonoswald-messaging-app.up.railway.app/chats/get-chats`;
            const token = localStorage.getItem('authenticationToken')
            const receiver = (user._id).toString();
            const messageData = {
                receiver: receiver,
            }
            try {
                const response = await fetch(devUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(messageData)
                })
                if (response.ok) {
                    const chatData = await response.json();
                    if (chatData === null) {
                        setMessages(null);
                    } else {
                        setMessages(chatData.messages);  
                    }
                    setIsLoading(false);
                }

            } catch (error) {
                console.error(`Errors: ${error}`);
                setError(error);
            }
        }
        getChats();
    }, [token])

    const handleNewMessage = async (event) => {
        event.preventDefault();
        // const localUrl = `http://localhost:3000/chats/new-message`;
        const devUrl = `https://daltonoswald-messaging-app.up.railway.app/chats/new-message`;
        const receiver = (user._id).toString();
        const text = (event.target.text.value).toString();
        const messageData = {
            receiver: receiver,
            text: text
        }
        console.log(messageData);

        try {
            const token = localStorage.getItem('authenticationToken') 
            const response = await fetch(devUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(messageData)
                })
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    window.location.reload();
                }
        } catch (error) {
            console.error("Error requesting:", error);
        }
    }

    // const handleNewImageMessage = async (event) => {
    //     event.preventDefault();
    //     const localUrl = `http://localhost:3000/chats/new-chat-image`;
    //     const receiver = (user._id).toString();

    //     const messageData = new FormData();
    //     messageData.append('file', messageImage);

    //     console.log(messageData);
    //     console.log(messageImage);
    //     try {
    //         const token = localStorage.getItem('authenticationToken');
    //         const response = await fetch(localUrl, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: messageData,
    //         })
    //         const data = await response.json();
    //         if (response.ok) {
    //             console.log(data);
    //         }
    //     } catch (error) {
    //         console.error("Error requesting:", error);
    //     }
    // }

    const handleCreateChat = async (event) => {
        event.preventDefault();
        // const localUrl = `http://localhost:3000/chats/new-chat`;
        const devUrl = `https://daltonoswald-messaging-app.up.railway.app/chat/new-chat`;
        const receiver = (user._id).toString();
        const chatData = {
            receiver: receiver,
        }
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(devUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(chatData)
                })
                const data = await response.json();
                if (response.ok) {
                    console.log(data);
                    window.location.reload();
                }
        } catch (error) {
            console.error("Error requesting:", error);
        }
    }

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollTo({ top: 1000000000000000, behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom();
    },[messages])

    return (
    <div className="chatbox">
        <div className="message-container" ref={messagesEndRef}>
            {messages && (
                <>
                            {messages.map((message) => (
                                <div className={"message" + ' ' + ((message.sender._id === user._id) ? 'left' : 'right') } key={message._id}>
                                    <p>{message.text}</p>
                                </div>
                            ))}
                </>
            )}
            {isLoading && (
                <>
                    <p>Loading messages...</p>
                </>
            )}
            {error && (
                    <>
                        <p>Error, please try again later or create a new chat.</p>
                    </>
            )}
            {(messages === null) && (
                <>
                    <p>No messages yet</p>
                    <button onClick={handleCreateChat} className="create-chat">Create chat</button>
                </>
            )}
        </div>
        {messages && (
        <div className="new-message">
            <form onSubmit={handleNewMessage} className="new-message-form" encType='multipart/form-data'>
                {/* <button onClick={handleNewImageMessage}>Upload Image</button>
                <input onChange={(e) => {setMessageImage(e.target.files[0])}} type='file' name='message-image' /> */}
                <label htmlFor='text'>Message</label>
                <input
                    type='text'
                    id='text'
                    required
                />
                <button className="send-message" type='submit'>Send</button>
            </form>
        </div>
        )}
    </div>    
    )

}