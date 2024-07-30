import { useState, useEffect } from "react";
import './chatbox.styles.css'

export default function Chatbox({ user }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getChats = async () => {
            const localUrl = `http://localhost:3000/chats/get-chats`;
            const token = localStorage.getItem('authenticationToken')
            const receiver = (user._id).toString();
            const messageData = {
                receiver: receiver,
            }
            try {
                const response = await fetch(localUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(messageData)
                })
                if (response.ok) {
                    const chatData = await response.json();
                    setMessages(chatData.messages);
                    setIsLoading(false);
                    console.log(chatData.messages);
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
        const localUrl = `http://localhost:3000/chats/new-message`;
        const receiver = (user._id).toString();
        const text = (event.target.text.value).toString();
        const messageData = {
            receiver: receiver,
            text: text
        }
        console.log(messageData);

        try {
            const token = localStorage.getItem('authenticationToken') 
            const response = await fetch(localUrl,
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

    if (isLoading) return (
        <>
            <p>Loading messages...</p>
        </>
    )
    if (error) return (
        <>
            <p>Error, please try again later</p>
        </>
    )


    return (
    <div className="chatbox">
        <div className="message-container">
            {messages.map((message) => (
                <div className={"message" + ' ' + ((message.sender._id === user._id) ? 'left' : 'right') } key={message._id}>
                    <p>{message.text}</p>
                </div>
            ))}
        </div>
        <div className="new-message">
            <form onSubmit={handleNewMessage} className="new-message-form">
                <label htmlFor='text'>Message</label>
                <input
                    type='text'
                    id='text'
                    required
                />
                <button className="send-message" type='submit'>Send</button>
            </form>
        </div>
    </div>    
    )

}