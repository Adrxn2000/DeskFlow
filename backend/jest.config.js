module.exports = {
  testEnvironment: "node",
  setupFiles: ["./tests/setup.js"],
  collectCoverageFrom: ["src/controllers/**/*.js", "src/middleware/**/*.js"],
};