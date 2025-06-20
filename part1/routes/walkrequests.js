const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/open', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select wr.request_id`)
    }
})