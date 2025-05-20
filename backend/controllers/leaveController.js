const LeaveRequest = require("../models/LeaveRequest.js");


const submitLeaveRequest = async (req, res) => {
  const { date, reason } = req.body;
  const employeeId = req.user.id; 

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

const updateLeaveRequest = async (req, res) => {
  const { id } = req.params; 
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
