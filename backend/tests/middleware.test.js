const jwt = require("jsonwebtoken");
const { authenticate, authorize } = require("../src/middleware/auth");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authenticate middleware", () => {
  test("rejects a request with no Authorization header", () => {
    const res = mockRes();
    const next = jest.fn();
    authenticate({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects a header that is not a Bearer token", () => {
    const res = mockRes();
    const next = jest.fn();
    authenticate({ headers: { authorization: "Basic abc" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects a token signed with the wrong secret", () => {
    const bad = jwt.sign({ id: 1, role: "ADMIN" }, "wrong-secret");
    const res = mockRes();
    const next = jest.fn();
    authenticate({ headers: { authorization: `Bearer ${bad}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects an expired token", () => {
    const expired = jwt.sign({ id: 1, role: "ADMIN" }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = mockRes();
    const next = jest.fn();
    authenticate({ headers: { authorization: `Bearer ${expired}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("accepts a valid token and attaches the user to the request", () => {
    const token = jwt.sign({ id: 7, role: "EMPLOYEE" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    authenticate(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 7, role: "EMPLOYEE" });
  });
});

describe("authorize middleware", () => {
  test("returns 401 when there is no authenticated user", () => {
    const res = mockRes();
    const next = jest.fn();
    authorize("ADMIN")({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when the role is not allowed", () => {
    const res = mockRes();
    const next = jest.fn();
    authorize("ADMIN")({ user: { role: "EMPLOYEE" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when the role is allowed", () => {
    const res = mockRes();
    const next = jest.fn();
    authorize("ADMIN", "EMPLOYEE")({ user: { role: "EMPLOYEE" } }, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
