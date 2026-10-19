const jwt = require("jsonwebtoken");

function tokenFor(role, id = 1) {
  return jwt.sign(
    { id, name: `Test ${role}`, email: `${role.toLowerCase()}@test.com`, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { tokenFor };
