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
  Text,
  Center,
  useColorModeValue,
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
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttempt = (quizId) => {
    navigate(`/testpage/${quizId}`);
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, blue.100, blue.300)"
      px={4}
      py={20}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        w={{ base: "100%", sm: "90%", md: "800px" }}
        maxW="900px"
      >
        <Heading
          mb={6}
          textAlign="center"
          fontSize={{ base: "2xl", md: "3xl" }}
          color="blue.600"
        >
          Available Quizzes
        </Heading>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Center>
        ) : quizzes.length === 0 ? (
          <Center>
            <Text fontSize="lg" color="gray.600">
              No quizzes available right now.
            </Text>
          </Center>
        ) : (
          <Table variant="striped" colorScheme="blue" size="md">
            <Thead>
              <Tr>
                <Th>Quiz Name</Th>
                <Th>Duration</Th>
                <Th>Teacher</Th>
                <Th textAlign="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {quizzes.map((quiz) => (
                <Tr key={quiz._id}>
                  <Td fontWeight="medium">{quiz.name}</Td>
                  <Td>{quiz.duration} min</Td>
                  <Td>{quiz.teacher?.name || "Unknown"}</Td>
                  <Td textAlign="center">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleAttempt(quiz._id)}
                      variant="solid"
                    >
                      Attempt Test
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default GiveTestPage;

