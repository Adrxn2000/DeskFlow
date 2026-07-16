const express = require("express");
const { login, register } = require("../controllers/authController");

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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new account (Employee or Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [EMPLOYEE, ADMIN] }
 *     responses:
 *       201: { description: Account created, returns JWT + user profile }
 *       400: { description: Missing fields, weak password, or email already exists }
 */
router.post("/register", register);

module.exports = router;