const express = require("express");
const { createTicket, getTickets, updateTicketStatus } = require("../controllers/ticketController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("EMPLOYEE"), createTicket);
router.get("/", getTickets);
router.put("/:id", authorize("ADMIN"), updateTicketStatus);

module.exports = router;