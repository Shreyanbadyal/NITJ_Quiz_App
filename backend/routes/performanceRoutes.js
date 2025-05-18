const express = require("express");
const {
  getPerformance,
  getLeaderboard,
  getProficiency,
  deleteHistory,
  getAllHistory, // ✅ New controller function to fetch all attempts
} = require("../controllers/performanceController");

const { getQuizAttemptDetails } = require("../controllers/getQuizAttemptDetails");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Existing routes
router.get("/", protect, getPerformance);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/proficiency", protect, getProficiency);
router.get("/deletehistory", protect, deleteHistory);

// ✅ New routes
router.get("/all-history", protect, getAllHistory); // Fetch all quiz attempts for a user
router.get("/history-detail/:historyId", protect, getQuizAttemptDetails); // Fetch specific attempt details

module.exports = router;
