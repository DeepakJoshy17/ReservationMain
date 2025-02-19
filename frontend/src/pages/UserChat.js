import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext"; 
import Navbar from "../components/Navbar";

const UserChat = () => {
    const { userSession } = useSession(); 
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (userSession?.user_id) {
            axios.get(`http://localhost:5000/api/chat/user/${userSession.user_id}`)
                .then(response => setChats(response.data))
                .catch(() => alert("Failed to load chat history"));
        }
    }, [userSession]);

    const sendMessage = () => {
        if (!message.trim()) return alert("Message cannot be empty");

        axios.post("http://localhost:5000/api/chat/user/send", { user_id: userSession.user_id, message })
        .then(response => {
            setChats([...chats, response.data]);
            setMessage("");
        })
        .catch(() => alert("Failed to send message"));
    };

    return (
        <div className="chat-container">
            <Navbar/>
            <h2>Chat Support</h2>
            <div className="chat-box">
                {chats.map((chat, index) => (
                    <div key={index} className="chat-message">
                        <p className={chat.sender === "User" ? "user-message" : "admin-message"}>
                            <strong>{chat.sender}:</strong> {chat.message}
                        </p>
                        {chat.bot_response && <p className="bot-response">🤖 {chat.bot_response}</p>}
                        {chat.admin_response && <p className="admin-response">👨‍💼 {chat.admin_response}</p>}
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default UserChat;
