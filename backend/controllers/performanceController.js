const expressAsyncHandler = require("express-async-handler");
const History = require("../models/historyModel");
const Proficiency = require("../models/proficiencyModel");
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");

const getPerformance = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;
  const lang_id = req.query.lang_id;

  try {
    const userHistory = await History.find({
      user_id: uid,
      language_id: lang_id,
    })
      .select("score_percent accuracy correct_answers total_questions createdAt")
      .sort({ createdAt: 1 });

    const performanceArray = userHistory.map((history) => ({
      score_percent: history.score_percent,
      accuracy: history.accuracy,
      correct_answers: history.correct_answers,
      total_questions: history.total_questions,
      date: history.createdAt,
    }));

    res.status(200).json(performanceArray);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const getAllHistory = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;

  const history = await History.find({ user_id: uid })
    .sort({ createdAt: -1 })
    .populate("user_id", "name")
    .populate("quiz_id", "name teacher createdAt")
    .lean();

  const formatted = await Promise.all(
    history.map(async (entry) => {
      const quiz = await Quiz.findById(entry.quiz_id).populate("teacher", "name");
      return {
        _id: entry._id,
        quizName: quiz?.name || "Unknown Quiz",
        teacherName: quiz?.teacher?.name || "Unknown Teacher",
        attemptedAt: entry.createdAt,
      };
    })
  );

  res.status(200).json(formatted);
});

const getLeaderboard = expressAsyncHandler(async (req, res) => {
  const quizId = req.query.quiz_id; // optional filter

  const matchStage = quizId ? { quiz_id: quizId } : {};

  try {
    const leaderboard = await History.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            user: "$user_id",
            quiz: "$quiz_id",
          },
          avgScore: { $avg: "$score_percent" },
          attempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id.quiz",
          foreignField: "_id",
          as: "quiz",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$quiz" },
      {
        $project: {
          uid: "$user._id",
          name: "$user.name",
          email: "$user.email",
          quizName: "$quiz.name",
          score_percent: { $round: ["$avgScore", 2] },
          attempts: 1,
        },
      },
      { $sort: { score_percent: -1 } },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500);
    throw new Error("Failed to fetch leaderboard");
  }
});

const getProficiency = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;

  const proficiencyData = await Proficiency.find({ user_id: uid }).select(
    "language_id proficiencyLevel"
  );

  res.status(200).json(proficiencyData);
});

const deleteHistory = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;

  try {
    const isDeleted = await History.deleteMany({ user_id: uid });

    await Proficiency.updateMany(
      { user_id: uid },
      { proficiencyLevel: "Apprentice" }
    );

    if (isDeleted) {
      res.status(200).send("Performance History deleted for the user");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

module.exports = {
  getPerformance,
  getLeaderboard,
  getProficiency,
  deleteHistory,
  getAllHistory,
};
