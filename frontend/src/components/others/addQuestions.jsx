import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AddQuestions = () => {
  const { quizId } = useParams();
  const [desc, setDesc] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    try {
      await axios.post(
        "http://localhost:4000/quiz/add-question",
        {
          quizId,
          desc,
          options,
          correct_answer: correctAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Success",
        description: "Question added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setDesc("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);
    } catch (err) {
      console.error("Failed to add question:", err);
      toast({
        title: "Error",
        description: "Failed to add question. See console for details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" mt={20} p={6} bg="whiteAlpha.900" borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center" size="lg">
        Add Question to Quiz
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Question Description</FormLabel>
            <Textarea
              placeholder="Enter the question"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </FormControl>

          {options.map((opt, i) => (
            <FormControl key={i} isRequired>
              <FormLabel>Option {i + 1}</FormLabel>
              <Input
                placeholder={`Enter option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i] = e.target.value;
                  setOptions(newOpts);
                }}
              />
            </FormControl>
          ))}

          <FormControl isRequired>
            <FormLabel>Select Correct Option</FormLabel>
            <Select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
            >
              {options.map((_, i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Add Question
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default AddQuestions;
