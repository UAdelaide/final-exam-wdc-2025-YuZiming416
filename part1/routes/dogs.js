const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select d.name as dog_name, d.size, u.username as owner_username
            from Dogs d
            join Users u on d.owner_id = u.user_id
            `);
            res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
