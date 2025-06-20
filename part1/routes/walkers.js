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
            (
            select count(*)
            from WalkRequests wr
            join WalkApplications wa on wr.request_id = wa.request_id
            where wr.status = 'completed' and wa.walker_id = u.user_id
            ) as completed_walks
            from Users u
            left join WalkRatings r on u.user_id = r.walker_id
            where u.role = 'walker'
            group by u.user_id
            `);
            res.json(rows);
    } catch (err) {
       res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
