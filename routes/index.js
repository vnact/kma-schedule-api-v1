const express = require('express');
const router = express.Router();
const { resolve } = require('path');
router.get('/', function (req, res, next) {
    res.sendFile(resolve(__dirname, '../public/index.html'));
});

module.exports = router;