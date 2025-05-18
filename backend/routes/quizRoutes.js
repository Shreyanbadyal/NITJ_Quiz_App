const express = require("express");
const {
  createQuiz,
  addQuestionToQuiz,
  makeQuizLive,
  getLiveQuizzes,
  getQuizQuestions,
} = require("../controllers/quizController");

const { submitAnswers } = require("../controllers/answerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher Routes
router.post("/create", protect, createQuiz);
router.post("/add-question", protect, addQuestionToQuiz);
router.put("/make-live", protect, makeQuizLive);

// Student Routes
router.get("/live", protect, getLiveQuizzes);
router.get("/questions/:quizId", protect, getQuizQuestions);
router.post("/answers", protect, submitAnswers); // ✅ This line MUST be here

module.exports = router;
