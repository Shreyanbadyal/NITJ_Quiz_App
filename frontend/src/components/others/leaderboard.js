// Frontend Update: LeaderboardPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Spinner,
  Center,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "../others/navbar";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchQuizzes = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const res = await axios.get("http://localhost:4000/quiz/live", config);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const url = selectedQuizId
        ? `http://localhost:4000/performance/leaderboard?quiz_id=${selectedQuizId}`
        : `http://localhost:4000/performance/leaderboard`;
      const res = await axios.get(url, config);
      setLeaderboardData(res.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedQuizId]);

  return (
    <>
      <Navbar />
      <Box
        minH="100vh"
        w="100%"
        bgGradient="linear(to-br, blue.100, blue.300)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
        pt="5rem"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          w={{ base: "100%", sm: "90%", md: "800px" }}
          maxW="1000px"
        >
          <VStack spacing={5} mb={6}>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="blue.600">
              Quiz Leaderboard
            </Text>
            <Select
              placeholder="Select Quiz"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              bg="gray.50"
              w="100%"
              maxW="300px"
            >
              {quizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.name}
                </option>
              ))}
            </Select>
          </VStack>

          {loading ? (
            <Center py={8}>
              <Spinner size="lg" color="blue.500" />
            </Center>
          ) : leaderboardData.length === 0 ? (
            <Text textAlign="center" fontSize="md" color="gray.600">
              No leaderboard data available.
            </Text>
          ) : (
            <Table variant="striped" colorScheme="blue" size="md">
              <Thead>
                <Tr>
                  <Th>Rank</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Quiz</Th>
                  <Th>Score (%)</Th>
                  <Th>Attempts</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leaderboardData.map((entry, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{entry.name}</Td>
                    <Td>{entry.email}</Td>
                    <Td>{entry.quizName}</Td>
                    <Td>{entry.score_percent}</Td>
                    <Td>{entry.attempts || "-"}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LeaderboardPage;
