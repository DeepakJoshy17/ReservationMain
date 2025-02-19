import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext"; 
import AdminNavbar from "../components/AdminNavbar";

const AdminChat = () => {
    const { adminSession } = useSession();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [replyMessage, setReplyMessage] = useState({});
    
    useEffect(() => {
        axios.get("http://localhost:5000/api/chat/admin/users")
            .then(response => setUsers(response.data))
            .catch(() => alert("Failed to load users"));
    }, []);

    const loadChatHistory = (user_id) => {
        setSelectedUser(user_id);
        axios.get(`http://localhost:5000/api/chat/admin/user/${user_id}`)
            .then(response => setChats(response.data))
            .catch(() => alert("Failed to load chat history"));
    };

    const sendReply = (chat_id) => {
        if (!replyMessage[chat_id]?.trim()) return alert("Reply cannot be empty");

        axios.post("http://localhost:5000/api/chat/admin/respond", { 
            chat_id, 
            admin_id: adminSession?.user_id, 
            response: replyMessage[chat_id] 
        })
        .then(() => {
            setChats(chats.map(chat => chat.chat_id === chat_id ? { ...chat, admin_response: replyMessage[chat_id] } : chat));
            setReplyMessage({ ...replyMessage, [chat_id]: "" }); // Clear input after sending
        })
        .catch(() => alert("Failed to send reply"));
    };

    return (
        
        <div className="admin-chat">
            <AdminNavbar/>
            <h2>Admin Chat</h2>
            <div className="users-list">
                {users.map(user => (
                    <button key={user.user_id} onClick={() => loadChatHistory(user.user_id)}>
                        {user.name}
                    </button>
                ))}
            </div>
            {selectedUser && (
                <div className="chat-box">
                    {chats.map((chat, index) => (
                        <div key={index} className="chat-message">
                            <p className={chat.sender === "User" ? "user-message" : "admin-message"}>
                                <strong>{chat.sender}:</strong> {chat.message}
                            </p>
                            {chat.admin_response && <p className="admin-response">👨‍💼 {chat.admin_response}</p>}
                            
                            {/* Reply Input for Admin */}
                            <div className="reply-section">
                                <input 
                                    type="text" 
                                    placeholder="Reply to this message..." 
                                    value={replyMessage[chat.chat_id] || ""}
                                    onChange={(e) => setReplyMessage({ ...replyMessage, [chat.chat_id]: e.target.value })}
                                />
                                <button onClick={() => sendReply(chat.chat_id)}>Reply</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminChat;
