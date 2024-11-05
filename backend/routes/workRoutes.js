const express = require('express');
const router = express.Router();
const { newWorkSpace, getWorkSpace } = require('../controllers/workController');
const isAuthenticated = require('../middlewares/auth');

router.post('/newWorkSpace', isAuthenticated, newWorkSpace);
router.get('/getWorkSpace/:roomId', isAuthenticated, getWorkSpace);


module.exports = router;