const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    desc: { type: String, required: true },
    options: {
      type: [String], // array of 4 options
      validate: [arr => arr.length === 4, 'Must have exactly 4 options'],
    },
    correct_answer: {
      type: Number, // index of correct option (0-3)
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
