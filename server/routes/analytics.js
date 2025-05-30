const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, allowRoles } = require("../middleware/auth");

// 📊 Average ₹/km-ton by Material
router.get("/rate-by-material", verifyToken, allowRoles("admin", "staff"), async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        material,
        ROUND(AVG(amount / NULLIF(distance_km, 0)), 2) AS avg_rate_per_km
      FROM deals
      WHERE distance_km IS NOT NULL
      GROUP BY material
      ORDER BY avg_rate_per_km DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📊 Average ₹/km-ton by Route
router.get("/rate-by-route", verifyToken, allowRoles("admin", "staff"), async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        pickup_location,
        delivery_location,
        ROUND(AVG(amount / NULLIF(distance_km, 0)), 2) AS avg_rate_per_km
      FROM bids
      WHERE distance_km IS NOT NULL AND status = 'accepted'
      GROUP BY pickup_location, delivery_location
      ORDER BY avg_rate_per_km DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/predict-price", verifyToken, allowRoles("admin", "staff"), async (req, res) => {
    const { material, distance_km, quantity_ton } = req.body;

    try {
        const rateRes = await pool.query(
            `SELECT ROUND(AVG(amount / NULLIF(distance_km, 0)), 2) AS avg_rate_per_km
         FROM deals
         WHERE material = $1 AND distance_km IS NOT NULL`,
            [material]
        );

        const rate = rateRes.rows[0]?.avg_rate_per_km || 6.5; // fallback default rate
        const estimatedPrice = Number(rate) * Number(distance_km) * Number(quantity_ton);

        res.json({ suggested_base_price: Math.round(estimatedPrice), used_rate: rate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;