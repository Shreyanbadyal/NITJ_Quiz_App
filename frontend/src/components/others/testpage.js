import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Button,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Center,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "./navbar";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [lang_id, setLangId] = useState("");
  const [category, setCategory] = useState("");
  const [initialRenderAnswers, setInitialRenderAnswers] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [languages, setLanguages] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [responseDetails, setResponseDetails] = useState({});
  const [shouldShow, setShouldShow] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const difficulties = ["easy", "medium", "hard"];

  const fetchLanguages = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:4000/quiz/languages`,
        config
      );
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const getQuestions = async (language, difficulty) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:4000/quiz/questions",
        {
          language_id: language,
          category: difficulty,
        },
        config
      );
      setQuestions(response.data);
      setLangId(language);
      setCategory(difficulty);
      setShouldShow(true);
    } catch (err) {
      console.error("Error occurred in fetching questions from the database", err);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (initialRenderAnswers) {
      setInitialRenderAnswers(false);
      return;
    }
    if (questions.length) {
      setSelectedAnswers((prevSelectedAnswers) => {
        const updatedAnswers = { ...prevSelectedAnswers };
        questions.forEach((question) => {
          updatedAnswers[question._id] = "-1";
        });
        return updatedAnswers;
      });
    }
  }, [questions]);

  const handleOptionSelect = (questionId, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        uid: userInfo._id,
        pairs: Object.entries(selectedAnswers).map(([objectId, givenAnswer]) => ({
          objectId,
          givenAnswer,
        })),
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:4000/quiz/answers",
        dataToSend,
        config
      );
      setResponseDetails(response.data);
      onOpen();
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent textAlign="center" maxW={{ base: "95%", md: "lg", lg: "2xl" }}>
          <ModalHeader fontSize="3xl">Quiz Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="xl">
            <Text>Total Questions: {responseDetails.totalMarks}</Text>
            <Text>Attempted: {responseDetails.attempted}</Text>
            <Text>Unattempted: {responseDetails.unAttempted}</Text>
            <Text>Correctly Answered: {responseDetails.corrected}</Text>
            <Text>Incorectly Answered: {responseDetails.incorrected}</Text>
            <Text>Total Marks: {responseDetails.totalMarks}</Text>
            <Text>Your Score: {responseDetails.score}</Text>
            <Text>Accuracy: {responseDetails.accuracy}%</Text>
            <Text>Negative Marking Per Each Question: -0.5 (50%)</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW="6xl" py={8} px={4} mt={12}>
        {!shouldShow && (
          <>
            <Text
              textAlign="center"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              color="white"
              mb={5}
            >
              Choose a Quiz to Begin
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {languages.map((lang) =>
                difficulties.map((level) => (
                  <Card
                    key={`${lang}-${level}`}
                    background="white"
                    _hover={{ shadow: "md" }}
                  >
                    <CardBody textAlign="center">
                      <Heading size="md">{lang.toUpperCase()}</Heading>
                      <Text mt={2}>{level.toUpperCase()} Level</Text>
                      <Button
                        mt={4}
                        colorScheme="blue"
                        onClick={() => getQuestions(lang, level)}
                      >
                        Start Test
                      </Button>
                    </CardBody>
                  </Card>
                ))
              )}
            </SimpleGrid>
          </>
        )}

        {shouldShow && (
          <VStack spacing={4}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Quiz of {lang_id.toUpperCase()} (LEVEL: {category.toUpperCase()})
            </Text>
            <form>
              {questions.map((question, ind) => (
                <Box
                  key={question._id}
                  borderWidth="1px"
                  p={4}
                  borderRadius="md"
                  background="white"
                  fontSize="xl"
                  mb={5}
                >
                  <Text mb={5}>
                    {ind + 1}. {question.desc}
                  </Text>
                  <RadioGroup
                    value={selectedAnswers[question._id] || "-1"}
                    onChange={(value) => handleOptionSelect(question._id, value)}
                    display="flex"
                    flexDirection="column"
                  >
                    {JSON.parse(question.options).map((option, index) => (
                      <Radio key={index} value={index.toString()} mb={5}>
                        {option}
                      </Radio>
                    ))}
                  </RadioGroup>
                </Box>
              ))}
              <Center>
                <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
                  Submit Test
                </Button>
              </Center>
            </form>
          </VStack>
        )}
      </Container>
    </>
  );
};

export default TestPage;
