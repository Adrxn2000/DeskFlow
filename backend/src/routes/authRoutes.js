const express = require("express");
const { login } = require("../controllers/authController");

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in as Employee or Admin (mock authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: employee@deskflow.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200: { description: Login successful, returns JWT + user profile }
 *       400: { description: Missing email or password }
 *       401: { description: Invalid credentials }
 */
router.post("/login", login);

module.exports = router;