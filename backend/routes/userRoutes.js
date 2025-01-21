const express = require('express');
const { createUser, updateUser, deleteUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// Routes for user management
router.post('/create', createUser);
router.put('/update', updateUser);
router.delete('/delete/:user_id', deleteUser);
router.get('/all', getUsers);

module.exports = router;
