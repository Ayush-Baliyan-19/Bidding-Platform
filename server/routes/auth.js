const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const { verifyToken, allowRoles } = require("../middleware/auth");

// Get all users (Admin only)
router.get("/users", verifyToken, allowRoles("admin"), async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            role: user.customClaims?.role || "none",
        }));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add user (Admin only)
router.post("/users", verifyToken, allowRoles("admin"), async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const userRecord = await admin.auth().createUser({ email, password });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role });
        res.status(201).json({ uid: userRecord.uid, email, role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (Admin only)
router.delete("/users/:uid", verifyToken, allowRoles("admin"), async (req, res) => {
    try {
        await admin.auth().deleteUser(req.params.uid);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset password email (Admin only)
router.post("/users/:uid/reset", verifyToken, allowRoles("admin"), async (req, res) => {
    const { email } = req.body;
    try {
        const link = await admin.auth().generatePasswordResetLink(email);
        res.json({ resetLink: link });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
