const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, allowRoles } = require("../middleware/auth");

// 📌 Create Bid
router.post("/", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    const {
        material_type,
        quantity,
        pickup_location,
        delivery_location,
        deadline,
        transporter_requirements
    } = req.body;

    try {
        const base_price = await calculateBasePrice(pickup_location, delivery_location, quantity); // dummy for now
        const created_by = req.user.uid;

        const result = await pool.query(
            `INSERT INTO bids 
        (material_type, quantity, pickup_location, delivery_location, deadline, transporter_requirements, base_price, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [material_type, quantity, pickup_location, delivery_location, deadline, transporter_requirements, base_price, created_by]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Get All Bids
router.get("/", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bids ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Accept Bid
router.post("/:id/accept", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE bids SET status = 'accepted' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Close Bid
router.post("/:id/close", verifyToken, allowRoles("staff", "admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE bids SET status = 'closed' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dummy function for base price prediction (replace later)
async function calculateBasePrice(pickup, drop, quantity) {
    return 5 * quantity; // ₹5 per ton-km approx (can be enhanced later)
}

module.exports = router;
