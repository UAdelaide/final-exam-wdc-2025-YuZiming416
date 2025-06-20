const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', async (req, res) => {
    try {
        const[rows] = await db.query(`
            select
            `)
    }
})