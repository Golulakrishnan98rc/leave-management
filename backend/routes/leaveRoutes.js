const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRole,
} = require("../middleware/authMiddleware.js");
const {
  submitLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequest,
} = require("../controllers/leaveController.js");

// Employee routes
router.post(
  "/submit",
  authMiddleware,
  authorizeRole(["employee"]),
  submitLeaveRequest
);
router.get(
  "/my",
  authMiddleware,
  authorizeRole(["employee"]),
  getMyLeaveRequests
);

// Manager routes
router.get(
  "/all",
  authMiddleware,
  authorizeRole(["manager"]),
  getAllLeaveRequests
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRole(["manager"]),
  updateLeaveRequest
);

module.exports = router;
