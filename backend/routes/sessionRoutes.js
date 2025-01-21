const express = require('express');
const router = express.Router();

// Check session status (e.g., if user is logged in)
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({ message: 'User is logged in', userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// You can add other session-related routes if needed (e.g., to destroy sessions)
module.exports = router;
