const request = require("supertest");

jest.mock("../src/config/prisma", () => ({
  user: { findUnique: jest.fn(), create: jest.fn() },
  ticket: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
}));

const app = require("../src/app");

test("SYS-01 health endpoint returns ok", async () => {
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: "ok" });
});

test("SYS-02 unknown route returns 404", async () => {
  const res = await request(app).get("/api/does-not-exist");
  expect(res.status).toBe(404);
});
