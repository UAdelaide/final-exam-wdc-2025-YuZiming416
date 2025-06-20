const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', async (req, res) => {
    try {
        const[rows] = await db.query(`
            select
            u.username as walker_username,
            count(r.rating_id) as total_ratings,
            round(avg(r.rating), 1) as average_rating,
            ()`)
    }
})