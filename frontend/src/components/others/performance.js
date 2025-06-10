import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Badge,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../others/navbar"; // Adjust path as needed

const PerformanceGraph = () => {
  const [history, setHistory] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const reportRef = useRef();

  const fetchHistory = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const res = await axios.get(
        `http://localhost:4000/performance/all-history?uid=${userInfo._id}`,
        config
      );
      setHistory(res.data);
      setLoading(false);
    } catch {
      toast({
        title: "Error",
        description: "Could not fetch performance history.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleEvaluate = async (historyId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const res = await axios.get(
        `http://localhost:4000/performance/history-detail/${historyId}`,
        config
      );
      setSelectedAttempt(res.data);
      setModalOpen(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load result.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExportPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("quiz-result.pdf");
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
          <Heading
            textAlign="center"
            fontSize={{ base: "2xl", md: "3xl" }}
            color="blue.600"
            mb={6}
          >
            Previous Quiz Attempts
          </Heading>

          {loading ? (
            <Center py={8}>
              <Spinner size="lg" color="blue.500" />
            </Center>
          ) : history.length === 0 ? (
            <Center>
              <Text fontSize="lg" color="gray.600">
                No quiz attempts found.
              </Text>
            </Center>
          ) : (
            <VStack spacing={6}>
              {history.map((attempt) => (
                <Box
                  key={attempt._id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  shadow="sm"
                  w="100%"
                  bg="gray.50"
                >
                  <Text fontSize="xl" fontWeight="bold" color="blue.700">
                    {attempt.quizName}
                  </Text>
                  <Text color="gray.600">Teacher: {attempt.teacherName}</Text>
                  <Text color="gray.500">
                    Attempted on:{" "}
                    {new Date(attempt.attemptedAt).toLocaleString()}
                  </Text>
                  <Button
                    mt={3}
                    colorScheme="blue"
                    onClick={() => handleEvaluate(attempt._id)}
                  >
                    Evaluate Results
                  </Button>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>

      {/* Result Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            <Text fontWeight="bold">Quiz Results</Text>
            <Button
              size="sm"
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody ref={reportRef}>
            {selectedAttempt && (
              <Box>
                <Box mb={6}>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Summary
                  </Text>
                  <Text>
                    <strong>Score:</strong> {selectedAttempt.score} /{" "}
                    {selectedAttempt.totalQuestions}
                  </Text>
                  <Text>
                    <strong>Correct:</strong> {selectedAttempt.correctAnswers}
                  </Text>
                  <Text>
                    <strong>Incorrect:</strong>{" "}
                    {selectedAttempt.totalQuestions -
                      selectedAttempt.correctAnswers}
                  </Text>
                  <Text>
                    <strong>Accuracy:</strong>{" "}
                    {typeof selectedAttempt.accuracy === "number"
                      ? selectedAttempt.accuracy.toFixed(2)
                      : selectedAttempt.accuracy}
                    %
                  </Text>
                </Box>

                <Divider my={4} />

                {selectedAttempt.answers.map((q, idx) => (
                  <Box
                    key={idx}
                    mb={6}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <Text fontWeight="semibold" fontSize="md">
                      Q{idx + 1}. {q.desc}
                    </Text>
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correctAnswer;
                      const isSelected = i === parseInt(q.givenAnswer);
                      return (
                        <HStack key={i} pl={4} spacing={3}>
                          <Text
                            color={
                              isCorrect
                                ? "green.600"
                                : isSelected
                                  ? "red.500"
                                  : "gray.700"
                            }
                          >
                            {i + 1}. {opt}
                          </Text>
                          {isCorrect && (
                            <Badge colorScheme="green">Correct</Badge>
                          )}
                          {isSelected && !isCorrect && (
                            <Badge colorScheme="red">Your Answer</Badge>
                          )}
                        </HStack>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PerformanceGraph;
