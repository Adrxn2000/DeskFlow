const request = require("supertest");
const { tokenFor } = require("./helpers");

jest.mock("../src/config/prisma", () => ({
  user: { findUnique: jest.fn(), create: jest.fn() },
  ticket: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

const employee = () => `Bearer ${tokenFor("EMPLOYEE", 7)}`;
const admin = () => `Bearer ${tokenFor("ADMIN", 1)}`;
const validTicket = { title: "Laptop broken", description: "Screen flickers", priority: "HIGH" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => console.error.mockRestore());

describe("authentication on ticket routes", () => {
  test("TKT-01 GET, POST and PUT reject a request with no token", async () => {
    expect((await request(app).get("/api/tickets")).status).toBe(401);
    expect((await request(app).post("/api/tickets").send(validTicket)).status).toBe(401);
    expect((await request(app).put("/api/tickets/1").send({ status: "OPEN" })).status).toBe(401);
  });

  test("TKT-02 rejects a malformed token", async () => {
    const res = await request(app).get("/api/tickets").set("Authorization", "Bearer garbage");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/tickets", () => {
  test("TKT-03 employee creates a ticket owned by themselves", async () => {
    prisma.ticket.create.mockResolvedValue({ id: 1, ...validTicket, status: "OPEN", createdById: 7 });

    const res = await request(app).post("/api/tickets").set("Authorization", employee()).send(validTicket);

    expect(res.status).toBe(201);
    expect(res.body.ticket.id).toBe(1);
    expect(prisma.ticket.create.mock.calls[0][0].data.createdById).toBe(7);
  });

  test.each(["title", "description", "priority"])("TKT-04 rejects a missing %s", async (field) => {
    const body = { ...validTicket };
    delete body[field];
    const res = await request(app).post("/api/tickets").set("Authorization", employee()).send(body);
    expect(res.status).toBe(400);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  test("TKT-05 admin cannot create a ticket", async () => {
    const res = await request(app).post("/api/tickets").set("Authorization", admin()).send(validTicket);
    expect(res.status).toBe(403);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  test("TKT-14 rejects an invalid priority value", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", employee())
      .send({ ...validTicket, priority: "BANANA" });
    expect(res.status).toBe(400);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  test("returns 500 when the database fails", async () => {
    prisma.ticket.create.mockRejectedValue(new Error("db down"));
    const res = await request(app).post("/api/tickets").set("Authorization", employee()).send(validTicket);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/tickets", () => {
  test("TKT-06 employee only sees their own tickets", async () => {
    prisma.ticket.findMany.mockResolvedValue([{ id: 1, createdById: 7 }]);

    const res = await request(app).get("/api/tickets").set("Authorization", employee());

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(prisma.ticket.findMany.mock.calls[0][0].where).toEqual({ createdById: 7 });
  });

  test("TKT-07 admin sees all tickets", async () => {
    prisma.ticket.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await request(app).get("/api/tickets").set("Authorization", admin());

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(prisma.ticket.findMany.mock.calls[0][0].where).toEqual({});
  });

  test("returns 500 when the database fails", async () => {
    prisma.ticket.findMany.mockRejectedValue(new Error("db down"));
    const res = await request(app).get("/api/tickets").set("Authorization", admin());
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/tickets/:id", () => {
  test("TKT-08 admin updates a ticket status", async () => {
    prisma.ticket.findUnique.mockResolvedValue({ id: 5 });
    prisma.ticket.update.mockResolvedValue({ id: 5, status: "RESOLVED" });

    const res = await request(app)
      .put("/api/tickets/5")
      .set("Authorization", admin())
      .send({ status: "RESOLVED" });

    expect(res.status).toBe(200);
    expect(res.body.ticket.status).toBe("RESOLVED");
    expect(prisma.ticket.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { status: "RESOLVED" } });
  });

  test("TKT-09 employee cannot update a status", async () => {
    const res = await request(app)
      .put("/api/tickets/5")
      .set("Authorization", employee())
      .send({ status: "RESOLVED" });
    expect(res.status).toBe(403);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  test("TKT-10 returns 404 when the ticket does not exist", async () => {
    prisma.ticket.findUnique.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/tickets/999")
      .set("Authorization", admin())
      .send({ status: "CLOSED" });
    expect(res.status).toBe(404);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  test("TKT-11 rejects a non-numeric id", async () => {
    const res = await request(app)
      .put("/api/tickets/abc")
      .set("Authorization", admin())
      .send({ status: "CLOSED" });
    expect(res.status).toBe(400);
  });

  test("TKT-12 rejects a missing status", async () => {
    const res = await request(app).put("/api/tickets/5").set("Authorization", admin()).send({});
    expect(res.status).toBe(400);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  test("TKT-13 rejects an invalid status value", async () => {
    prisma.ticket.findUnique.mockResolvedValue({ id: 5 });
    const res = await request(app)
      .put("/api/tickets/5")
      .set("Authorization", admin())
      .send({ status: "BANANA" });
    expect(res.status).toBe(400);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  test("returns 500 when the database fails", async () => {
    prisma.ticket.findUnique.mockResolvedValue({ id: 5 });
    prisma.ticket.update.mockRejectedValue(new Error("db down"));
    const res = await request(app)
      .put("/api/tickets/5")
      .set("Authorization", admin())
      .send({ status: "CLOSED" });
    expect(res.status).toBe(500);
  });
});
