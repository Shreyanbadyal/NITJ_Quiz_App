import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      const teacherId = userInfo?._id || userInfo?.id;

      if (!token || !teacherId) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to create a quiz.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/quiz/create",
        { name, duration, teacherId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Quiz Created",
        description: `Quiz "${res.data.name}" created successfully!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // ✅ Redirect to add questions page with quiz ID
      navigate(`/add-question/${res.data._id}`);

      setName("");
      setDuration("");
    } catch (err) {
      console.error("Quiz creation failed:", err.response?.data || err.message);
      toast({
        title: "Error",
        description: "Quiz creation failed. Check console for details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" mt={20} p={6} bg="whiteAlpha.800" borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">
        Create a New Quiz
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Quiz Name</FormLabel>
            <Input
              placeholder="Enter quiz name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Duration (minutes)</FormLabel>
            <Input
              type="number"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Create Quiz
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default CreateQuiz;
