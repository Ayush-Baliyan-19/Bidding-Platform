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

// 📌 Get All Transporters
router.get("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Transporter ID is required" });
    }
    try {
        const result = await pool.query("SELECT * FROM transporters WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transporter not found" });
        }
        res.json(result.rows[0]);
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

// 📌 Get transporter history (Mocked)
router.get("/:id/history", async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch transporter name from DB
        const result = await pool.query("SELECT name FROM transporters WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transporter not found" });
        }

        const name = result.rows[0].name;

        // Mocked history
        const mockHistory = {
            transporter_id: id,
            name,
            history: [
                {
                    type: "bid",
                    material: "Cement",
                    quantity: 15,
                    from: "Panipat",
                    to: "Delhi",
                    status: "closed",
                    date: "2024-12-10",
                    price_offered: 5500,
                },
                {
                    type: "deal",
                    material: "Sand",
                    quantity: 10,
                    from: "Noida",
                    to: "Gurgaon",
                    amount: 6000,
                    date: "2024-12-18",
                },
                {
                    type: "bid",
                    material: "Bricks",
                    quantity: 5,
                    from: "Faridabad",
                    to: "Rohini",
                    status: "accepted",
                    date: "2025-01-05",
                    price_offered: 4000,
                },
                {
                    type: "deal",
                    material: "Steel Rods",
                    quantity: 20,
                    from: "Bahadurgarh",
                    to: "Noida",
                    amount: 15000,
                    date: "2025-03-02",
                },
            ],
        };

        res.json(mockHistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
  


module.exports = router;
