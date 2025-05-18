import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

// ✅ Pages and Components
import Homepage from "./pages/Homepage";
import Mainpage from "./pages/Mainpage";
import GiveTestPage from "./components/others/GiveTestPage";
import TestPage from "./components/others/TestPage";
import ProfilePage from "./components/others/profile";
import LeaderboardPage from "./components/others/leaderboard";
import UploadQuestionPage from "./components/others/upload";
import PerformanceGraph from "./components/others/performance";
import CreateQuiz from "./components/others/createquiz";
import AddQuestions from "./components/others/addQuestions";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/main" element={<Mainpage />} />
          <Route path="/testpage" element={<GiveTestPage />} />
          <Route path="/testpage/:quizId" element={<TestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/uploadQuestion" element={<UploadQuestionPage />} />
          <Route path="/performance" element={<PerformanceGraph />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/add-question/:quizId" element={<AddQuestions />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
