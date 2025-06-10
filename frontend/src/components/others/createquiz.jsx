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
  Text,
  useColorModeValue,
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
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, blue.100, blue.300)"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        w={{ base: "100%", sm: "400px", md: "450px" }}
      >
        <Heading
          mb={2}
          textAlign="center"
          fontSize="2xl"
          color="blue.600"
        >
          Create a New Quiz
        </Heading>
        <Text textAlign="center" mb={6} color="gray.500">
          Enter the quiz name and duration to get started.
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Quiz Name</FormLabel>
              <Input
                placeholder="Enter quiz name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg="gray.50"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Duration (minutes)</FormLabel>
              <Input
                type="number"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                bg="gray.50"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              borderRadius="md"
              _hover={{ bg: "blue.600" }}
            >
              Create Quiz
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateQuiz;
