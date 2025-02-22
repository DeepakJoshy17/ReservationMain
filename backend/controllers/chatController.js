require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('../database/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

exports.userSendMessage = async (req, res) => {
    const { user_id, message } = req.body;
    if (!user_id || !message) return res.status(400).json({ error: "User ID and message are required" });

    try {
        // ✅ Improved Knowledge Base Query for better matching
        const knowledgeQuery = `
            SELECT answer 
            FROM knowledgeBase 
            WHERE question LIKE ? 
            ORDER BY LENGTH(question) ASC 
            LIMIT 1
        `;

        db.get(knowledgeQuery, [`%${message}%`], async (err, row) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });

            let botReply;
            if (row) {
                // ✅ If knowledge base has an answer, return it directly
                botReply = row.answer;
            } else {
                // ❌ If no match in knowledge base, use Gemini AI
                const systemPrompt = `
                You are a chatbot for a Boat Seat Booking System. Assist users based on the given knowledge.

                System Info:
                - Users can book ferry seats via our website.
                - Payment is required for seat booking.
                - Users receive a ticket with a QR code after payment.
                - Tickets can be viewed and canceled in the profile section.
                - Refund policy: 75% refund if all seats are canceled.
                - Admins can monitor bookings and chat with users.

                User's question: ${message}
                `;

                try {
                    const result = await model.generateContent(systemPrompt);
                    botReply = await result.response.text();
                } catch (apiError) {
                    console.error("Gemini API Error:", apiError);
                    botReply = "Sorry, our AI assistant is currently unavailable. Please try again later.";
                }
            }

            // ✅ Save the conversation in the database
            const query = `INSERT INTO Chats (user_id, message, bot_response, sender) VALUES (?, ?, ?, 'User')`;
            db.run(query, [user_id, message, botReply], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ chat_id: this.lastID, message, bot_response: botReply });
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







// 🟢 Fetch all chat messages for a specific user
exports.getUserChats = (req, res) => {
    const { user_id } = req.params;
    db.all(`SELECT * FROM Chats WHERE user_id = ? ORDER BY created_at ASC`, [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// 🟢 Admin fetches all users with active chats
exports.getUsersWithChats = (req, res) => {
    const query = `SELECT DISTINCT Users.user_id, Users.name FROM Users JOIN Chats ON Users.user_id = Chats.user_id WHERE Chats.admin_response IS NULL OR Chats.admin_id IS NULL`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// 🟢 Admin fetches chat history with a specific user
exports.getUserChatForAdmin = (req, res) => {
    const { user_id } = req.params;
    db.all(`SELECT * FROM Chats WHERE user_id = ? ORDER BY created_at ASC`, [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// 🟢 Admin replies to a specific chat (FIXED)
exports.sendAdminResponse = (req, res) => {
    const { chat_id, admin_id, response } = req.body;
    if (!chat_id || !admin_id || !response) return res.status(400).json({ error: "Chat ID, Admin ID, and Response are required" });

    db.run(
        `UPDATE Chats SET admin_id = ?, admin_response = ?, sender = 'User' WHERE chat_id = ?`,
        [admin_id, response, chat_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, chat_id, admin_id, admin_response: response });
        }
    );
};
