const db = require("../database/db");

// Fetch all knowledge base entries
exports.getAllKnowledge = (req, res) => {
    db.all("SELECT * FROM knowledgeBase", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// Add a new question-answer entry
exports.addKnowledge = (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Question and Answer are required." });

    db.run("INSERT INTO knowledgeBase (question, answer) VALUES (?, ?)", [question, answer], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, question, answer });
    });
};

// Update an existing entry
exports.updateKnowledge = (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Both Question and Answer are required." });

    db.run("UPDATE knowledgeBase SET question = ?, answer = ? WHERE id = ?", [question, answer, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, question, answer });
    });
};

// Delete an entry
exports.deleteKnowledge = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM knowledgeBase WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully", id });
    });
};
