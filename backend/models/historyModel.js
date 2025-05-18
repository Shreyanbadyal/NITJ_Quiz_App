const mongoose = require("mongoose");

const historySchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    language_id: { type: String, required: true },
    score_percent: { type: Number, required: true },
    accuracy: { type: String, required: true },
    correct_answers: { type: Number, required: true },
    total_questions: { type: Number, required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        givenAnswer: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
module.exports = History;
