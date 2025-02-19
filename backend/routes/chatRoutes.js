const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// User endpoints
router.post('/user/send', chatController.userSendMessage);
router.get('/user/:user_id', chatController.getUserChats);

// Admin endpoints
router.get('/admin/users', chatController.getUsersWithChats);
router.get('/admin/user/:user_id', chatController.getUserChatForAdmin);
router.post('/admin/respond', chatController.sendAdminResponse);

module.exports = router;
