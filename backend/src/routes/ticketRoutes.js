const express = require("express");
const { createTicket, getTickets, updateTicketStatus } = require("../controllers/ticketController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
/**
 * @openapi
 * /api/tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a new IT ticket (Employee only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, priority]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH, URGENT] }
 *     responses:
 *       201: { description: Ticket created }
 *       400: { description: Missing required fields }
 *       401: { description: Not authenticated }
 *       403: { description: Only Employees may create tickets }
 */
router.post("/", authorize("EMPLOYEE"), createTicket);

/**
 * @openapi
 * /api/tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: List tickets (Employees see own only; Admins see all)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of tickets }
 *       401: { description: Not authenticated }
 */
router.get("/", getTickets);

/**
 * @openapi
 * /api/tickets/{id}:
 *   put:
 *     tags: [Tickets]
 *     summary: Update a ticket's status (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED] }
 *     responses:
 *       200: { description: Ticket updated }
 *       400: { description: Invalid id or missing status }
 *       401: { description: Not authenticated }
 *       403: { description: Only Admins may update status }
 *       404: { description: Ticket not found }
 */
router.put("/:id", authorize("ADMIN"), updateTicketStatus);

module.exports = router;