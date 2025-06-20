const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/open', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select wr.request_id, d.name as dog_name, wr.requested_time,
            wr.duration_minutes, wr.location, u.username as owner_username
            from WalkRequests wr
            join Dogs d on wr.dog_id = d.dog_id
            join Users u on d.owner_id = u.user_id
            where we.`)
    }
})