import React from "react";
import axios from "axios";

const MakeLiveButton = ({ quizId }) => {
  const handleMakeLive = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "/api/quiz/make-live",
        { quizId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz is now live!");
    } catch (err) {
      console.error("Failed to make quiz live:", err);
    }
  };

  return <button onClick={handleMakeLive}>Make Quiz Live</button>;
};

export default MakeLiveButton;
