const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, allowRoles } = require("../middleware/auth");

// 📌 Add Transporter
router.post("/", verifyToken, allowRoles("admin"), async (req, res) => {
    const { name, contact, vehicle_type, capacity, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO transporters (name, contact, vehicle_type, capacity, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, contact, vehicle_type, capacity, status || "active"]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Get All Transporters
router.get("/", verifyToken, allowRoles("admin"), async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM transporters ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Update Transporter
router.put("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
    const { id } = req.params;
    const { name, contact, vehicle_type, capacity, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE transporters
       SET name = $1, contact = $2, vehicle_type = $3, capacity = $4, status = $5
       WHERE id = $6
       RETURNING *`,
            [name, contact, vehicle_type, capacity, status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Delete Transporter
router.delete("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM transporters WHERE id = $1", [id]);
        res.json({ message: "Transporter deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
