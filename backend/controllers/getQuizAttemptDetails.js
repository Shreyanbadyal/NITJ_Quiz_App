const expressAsyncHandler = require("express-async-handler");
const History = require("../models/historyModel");
const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");

const getQuizAttemptDetails = expressAsyncHandler(async (req, res) => {
  const { historyId } = req.params;

  const history = await History.findById(historyId)
    .populate("quiz_id", "name teacher")
    .populate("answers.questionId");

  if (!history) {
    res.status(404);
    throw new Error("History not found");
  }
  const resultDetails = {
    quizName: history.quiz_id.name,
    teacher: history.quiz_id.teacher,
    score: Number(history.score_percent),
    correctAnswers: history.correct_answers,
    totalQuestions: history.total_questions,
    accuracy: Number(history.accuracy), // ✅ convert to number
    answers: history.answers.map((entry) => ({
      desc: entry.questionId.desc,
      options: entry.questionId.options,
      correctAnswer: entry.questionId.correct_answer,
      givenAnswer: entry.givenAnswer,
    })),
  };
  

  res.status(200).json(resultDetails);
});

module.exports = { getQuizAttemptDetails };

