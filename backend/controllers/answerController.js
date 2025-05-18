const expressAsyncHandler = require("express-async-handler");
const Question = require("../models/questionModel");
const History = require("../models/historyModel");
const Proficiency = require("../models/proficiencyModel");

const submitAnswers = expressAsyncHandler(async (req, res) => {
  const { uid, pairs, quizId } = req.body; // ✅ include quizId

  let lang_id;
  let positiveMarks = 0,
    negativeMarks = 0,
    unAttempted = 0;
  const totalMarks = pairs.length;

  const answersForHistory = [];

  for (let i = 0; i < pairs.length; i++) {
    const { objectId, givenAnswer } = pairs[i];
    const question = await Question.findById(objectId);

    if (question) {
      lang_id = question.language_id || "default";

      answersForHistory.push({
        questionId: objectId,
        givenAnswer,
      });

      if (givenAnswer !== "-1") {
        if (question.correct_answer.toString() === givenAnswer) {
          positiveMarks++;
        } else {
          negativeMarks++;
        }
      } else {
        unAttempted++;
      }
    }
  }

  const attempted = totalMarks - unAttempted;
  const accuracy = attempted ? (positiveMarks * 100) / attempted : 0;
  const score = positiveMarks - negativeMarks * 0.25;
  const scorePercentage = (score * 100) / totalMarks;

  const report = {
    totalMarks,
    attempted,
    corrected: positiveMarks,
    incorrected: negativeMarks,
    unAttempted,
    score,
    scorePercentage,
    accuracy,
  };

  await History.create({
    user_id: uid,
    quiz_id: quizId, // ✅ required for joining with quiz & teacher
    language_id: lang_id || "default",
    score_percent: scorePercentage,
    accuracy,
    correct_answers: positiveMarks,
    total_questions: totalMarks,
    answers: answersForHistory, // ✅ if your schema supports it
  });

  res.status(200).json(report);
});

module.exports = { submitAnswers };
