const db = require('../database/db'); // SQLite database connection

// 🟢 User sends a message
exports.userSendMessage = (req, res) => {
    const { user_id, message } = req.body;
    if (!user_id || !message) return res.status(400).json({ error: "User ID and message are required" });

    const query = `INSERT INTO Chats (user_id, message, sender) VALUES (?, ?, 'User')`;
    db.run(query, [user_id, message], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const chat_id = this.lastID;
        const botReply = "Hello! Our support team will respond soon.";

        // Bot auto-response
        db.run(`UPDATE Chats SET bot_response = ? WHERE chat_id = ?`, [botReply, chat_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            res.status(201).json({ chat_id, message, bot_response: botReply });
        });
    });
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
