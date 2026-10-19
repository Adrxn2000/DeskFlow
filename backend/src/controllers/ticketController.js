const prisma = require("../config/prisma");

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

async function createTicket(req, res) {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({ success: false, message: "Title, description, and priority are required" });
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        createdById: req.user.id,
      },
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create ticket" });
  }
}

async function getTickets(req, res) {
  try {
    const where = req.user.role === "EMPLOYEE" ? { createdById: req.user.id } : {};

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    });

    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
}

async function updateTicketStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: "Ticket id must be a number" });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: `Ticket ${id} not found` });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update ticket" });
  }
}

module.exports = { createTicket, getTickets, updateTicketStatus };