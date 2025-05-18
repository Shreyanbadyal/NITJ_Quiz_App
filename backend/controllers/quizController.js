const expressAsyncHandler = require("express-async-handler");
const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");

// ✅ 1. Create a new quiz
const createQuiz = expressAsyncHandler(async (req, res) => {
  const { name, duration, teacherId } = req.body;

  if (!name || !duration || !teacherId) {
    res.status(400);
    throw new Error("Please provide name, duration, and teacherId.");
  }

  const newQuiz = await Quiz.create({
    name,
    duration,
    teacher: teacherId,
  });

  res.status(201).json(newQuiz);
});

// ✅ 2. Add a question to a quiz
const addQuestionToQuiz = expressAsyncHandler(async (req, res) => {
  const { quizId, desc, options, correct_answer } = req.body;

  if (!quizId || !desc || !options || correct_answer === undefined) {
    res.status(400);
    throw new Error("All fields are required: quizId, desc, options, correct_answer");
  }

  if (!Array.isArray(options) || options.length !== 4) {
    res.status(400);
    throw new Error("Options must be an array of exactly 4 elements.");
  }

  const question = await Question.create({
    quizId,
    desc,
    options,
    correct_answer,
  });

  res.status(201).json(question);
});

// ✅ 3. Make quiz live
const makeQuizLive = expressAsyncHandler(async (req, res) => {
  const { quizId } = req.body;

  if (!quizId) {
    res.status(400);
    throw new Error("Quiz ID is required.");
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    { isLive: true },
    { new: true }
  );

  if (!updatedQuiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }

  res.status(200).json({ message: "Quiz is now live.", quiz: updatedQuiz });
});

// ✅ 4. Get all live quizzes (for student view)
const getLiveQuizzes = expressAsyncHandler(async (req, res) => {
  const liveQuizzes = await Quiz.find({ isLive: true }).populate("teacher", "name email");

  res.status(200).json(liveQuizzes);
});

// ✅ 5. Get all questions of a quiz (without correct answer)
const getQuizQuestions = expressAsyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    res.status(400);
    throw new Error("Quiz ID is required.");
  }

  const questions = await Question.find({ quizId }).select("-correct_answer");

  res.status(200).json(questions);
});

module.exports = {
  createQuiz,
  addQuestionToQuiz,
  makeQuizLive,
  getLiveQuizzes,
  getQuizQuestions,
};
