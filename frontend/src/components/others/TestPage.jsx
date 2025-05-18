import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const res = await axios.get(
          `http://localhost:4000/quiz/questions/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        toast({
          title: "Error",
          description: "Unable to load quiz questions.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchQuestions();
  }, [quizId, toast]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
    const uid = userInfo?._id;

    if (!uid) {
      toast({
        title: "Unauthorized",
        description: "Please log in to submit the quiz.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const pairs = questions.map((q) => ({
      objectId: q._id,
      givenAnswer:
        answers[q._id] !== undefined ? answers[q._id].toString() : "-1",
    }));

    try {
      const res = await axios.post(
        "http://localhost:4000/quiz/answers",
        {
          uid,
          quizId,
          pairs,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReport(res.data);
      setSubmitted(true);
      toast({
        title: "Quiz Submitted!",
        description: "Your quiz has been evaluated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error submitting answers:", err);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="4xl" mt={20}>
      <Heading size="lg" mb={6}>
        Quiz Attempt
      </Heading>

      {!submitted ? (
        <>
          {questions.map((q, idx) => (
            <Box key={q._id} mb={6} p={4} borderWidth="1px" borderRadius="md">
              <Text mb={2}>
                <strong>Q{idx + 1}.</strong> {q.desc}
              </Text>
              <RadioGroup
                onChange={(val) =>
                  handleOptionChange(q._id, parseInt(val))
                }
                value={
                  answers[q._id] !== undefined
                    ? answers[q._id].toString()
                    : ""
                }
              >
                <Stack spacing={2}>
                  {q.options.map((opt, i) => (
                    <Radio key={i} value={i.toString()}>
                      {opt}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          ))}

          {questions.length > 0 && (
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </>
      ) : (
        <Box p={6} borderWidth="1px" borderRadius="md" mt={4}>
          <Heading size="md" mb={4}>
            Quiz Report
          </Heading>
          <Text><strong>Total Questions:</strong> {report.totalMarks}</Text>
          <Text><strong>Attempted:</strong> {report.attempted}</Text>
          <Text><strong>Correct:</strong> {report.corrected}</Text>
          <Text><strong>Incorrect:</strong> {report.incorrected}</Text>
          <Text><strong>Score:</strong> {report.score} / {report.totalMarks}</Text>
          <Text><strong>Accuracy:</strong> {report.accuracy.toFixed(2)}%</Text>
        </Box>
      )}
    </Container>
  );
};

export default TestPage;
