const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const { verifyToken, allowRoles } = require("../middleware/auth");

// 📌 Manual Deal Entry
router.post("/", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    const { transporter_name, amount, material, date } = req.body;
    try {
        const created_by = req.user.uid;
        const result = await pool.query(
            `INSERT INTO deals (transporter_name, amount, material, date, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [transporter_name, amount, material, date, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📂 CSV Upload
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, allowRoles("staff", "admin"), upload.single("file"), (req, res) => {
    const filePath = req.file.path;
    const created_by = req.user.uid;

    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
            // Validate and push to results
            if (data.transporter_name && data.amount && data.material && data.date) {
                results.push([
                    data.transporter_name,
                    parseFloat(data.amount),
                    data.material,
                    new Date(data.date),
                    created_by
                ]);
            }
        })
        .on("end", async () => {
            try {
                const insertQuery = `
          INSERT INTO deals (transporter_name, amount, material, date, created_by)
          VALUES ($1, $2, $3, $4, $5)
        `;

                for (let deal of results) {
                    await pool.query(insertQuery, deal);
                }

                fs.unlinkSync(filePath); // Cleanup
                res.status(201).json({ message: `${results.length} deals uploaded.` });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
});

// 🔍 View All Deals
router.get("/", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM deals ORDER BY date DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
