const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select
            d.dog_id,
            d.name,
            d.size,
            d.owner_id
            `);
            res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
