const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    isLive: { type: Boolean, default: false },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model for teachers
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
