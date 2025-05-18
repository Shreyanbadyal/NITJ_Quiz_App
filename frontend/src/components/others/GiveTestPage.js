import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const GiveTestPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const res = await axios.get("http://localhost:4000/quiz/live", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        toast({
          title: "Error",
          description: "Could not fetch live quizzes.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttempt = (quizId) => {
    navigate(`/testpage/${quizId}`);
  };

  return (
    <Container maxW="5xl" mt={20}>
      <Heading mb={6} textAlign="center">
        Available Quizzes
      </Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : quizzes.length === 0 ? (
        <Box textAlign="center">No quizzes available right now.</Box>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Quiz Name</Th>
              <Th>Duration</Th>
              <Th>Teacher</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quizzes.map((quiz) => (
              <Tr key={quiz._id}>
                <Td>{quiz.name}</Td>
                <Td>{quiz.duration} min</Td>
                <Td>{quiz.teacher?.name || "Unknown"}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleAttempt(quiz._id)}
                  >
                    Attempt Test
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
};

export default GiveTestPage;
