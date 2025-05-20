const LeaveRequest = require("../models/LeaveRequest.js");

// Employee submits leave request
const submitLeaveRequest = async (req, res) => {
  const { date, reason } = req.body;
  const employeeId = req.user.id; // from auth middleware

  try {
    const leaveRequest = new LeaveRequest({
      employee: employeeId,
      date,
      reason,
    });
    await leaveRequest.save();
    res.status(201).json({ message: "Leave request submitted", leaveRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Employee views own leave requests
const getMyLeaveRequests = async (req, res) => {
  const employeeId = req.user.id;
  try {
    const leaves = await LeaveRequest.find({ employee: employeeId }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Manager views all leave requests
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Manager approves or rejects request
const updateLeaveRequest = async (req, res) => {
  const { id } = req.params; // leave request id
  const { status, managerComment } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest)
      return res.status(404).json({ message: "Leave request not found" });

    leaveRequest.status = status;
    if (managerComment) leaveRequest.managerComment = managerComment;

    await leaveRequest.save();
    res.json({ message: "Leave request updated", leaveRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequest,
};
