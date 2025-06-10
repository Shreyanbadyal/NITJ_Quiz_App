import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Button,
  VStack,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import Navbar from "../others/navbar";

function UploadQuestion() {
  const [langId, setLangId] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      uid: userInfo._id,
      lang_id: langId,
      category,
      desc,
      option1,
      option2,
      option3,
      option4,
      correct_answer: correctAnswer,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("http://localhost:4000/quiz/upload", dataToSend, config);

      toast({
        title: "Question Uploaded",
        description: "Your question has been successfully uploaded.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      // Clear form fields
      setLangId("");
      setCategory("");
      setDesc("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload Failed",
        description: "Question uploading failed. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const formWidth = useBreakpointValue({ base: "100%", sm: "90%", md: "500px" });

  return (
    <>
      <Navbar />
      <Box
        minH="100vh"
        w="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-br, blue.100, blue.300)"
        px={4}
        pt="5rem" // ensures space for fixed navbar
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          w={formWidth}
          maxW="600px"
          mx="auto"
        >
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            textAlign="center"
            fontWeight="bold"
            color="blue.600"
            mb={6}
          >
            Add a New Question
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Language</FormLabel>
                <Input
                  placeholder="Enter language"
                  value={langId}
                  onChange={(e) => setLangId(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Question</FormLabel>
                <Input
                  placeholder="Enter the question"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Option 1</FormLabel>
                <Input
                  placeholder="Enter Option 1"
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Option 2</FormLabel>
                <Input
                  placeholder="Enter Option 2"
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Option 3</FormLabel>
                <Input
                  placeholder="Enter Option 3"
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Option 4</FormLabel>
                <Input
                  placeholder="Enter Option 4"
                  value={option4}
                  onChange={(e) => setOption4(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select difficulty level"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  bg="gray.50"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Correct Answer</FormLabel>
                <Select
                  placeholder="Select correct answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  bg="gray.50"
                >
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                mt={2}
              >
                Upload Question
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default UploadQuestion;
