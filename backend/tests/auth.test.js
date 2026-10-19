const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../src/config/prisma", () => ({
  user: { findUnique: jest.fn(), create: jest.fn() },
  ticket: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

beforeEach(() => jest.clearAllMocks());

describe("POST /api/auth/register", () => {
  const body = { name: "Ada", email: "ada@test.com", password: "secret123" };

  test("AUTH-01 creates an EMPLOYEE and returns a token", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1, name: "Ada", email: "ada@test.com", role: "EMPLOYEE" });

    const res = await request(app).post("/api/auth/register").send(body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.role).toBe("EMPLOYEE");
  });

  test("AUTH-02 ignores a client-supplied ADMIN role", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 2, name: "Eve", email: "eve@test.com", role: "EMPLOYEE" });

    await request(app).post("/api/auth/register").send({ ...body, role: "ADMIN" });

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create.mock.calls[0][0].data.role).toBe("EMPLOYEE");
  });

  test("AUTH-02b stores a hashed password, never the plain text", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 3, name: "Ada", email: "ada@test.com", role: "EMPLOYEE" });

    await request(app).post("/api/auth/register").send(body);

    const stored = prisma.user.create.mock.calls[0][0].data.password;
    expect(stored).not.toBe("secret123");
    expect(await bcrypt.compare("secret123", stored)).toBe(true);
  });

  test.each([
    ["name", { email: "a@test.com", password: "secret123" }],
    ["email", { name: "Ada", password: "secret123" }],
    ["password", { name: "Ada", email: "a@test.com" }],
  ])("AUTH-03 rejects a missing %s", async (_field, payload) => {
    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("AUTH-04 rejects a password under 6 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...body, password: "123" });
    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("AUTH-05 rejects an email that is already registered", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 9, email: "ada@test.com" });
    const res = await request(app).post("/api/auth/register").send(body);
    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("returns 500 when the database fails", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("db down"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await request(app).post("/api/auth/register").send(body);
    expect(res.status).toBe(500);
    console.error.mockRestore();
  });
});

describe("POST /api/auth/login", () => {
  const stored = { id: 5, name: "Ada", email: "ada@test.com", role: "EMPLOYEE", password: bcrypt.hashSync("secret123", 4) };

  test("AUTH-06 returns a token for valid credentials", async () => {
    prisma.user.findUnique.mockResolvedValue(stored);
    const res = await request(app).post("/api/auth/login").send({ email: "ada@test.com", password: "secret123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ id: 5, role: "EMPLOYEE" });
    expect(res.body.user.password).toBeUndefined();
  });

  test("AUTH-07 rejects a wrong password", async () => {
    prisma.user.findUnique.mockResolvedValue(stored);
    const res = await request(app).post("/api/auth/login").send({ email: "ada@test.com", password: "nope" });
    expect(res.status).toBe(401);
  });

  test("AUTH-08 rejects an unknown email", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post("/api/auth/login").send({ email: "ghost@test.com", password: "secret123" });
    expect(res.status).toBe(401);
  });

  test("AUTH-09 rejects missing credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
});
