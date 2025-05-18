import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
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
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "./navbar";

const PerformanceGraph = () => {
  const [history, setHistory] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    } catch {
      toast({
        title: "Error",
        description: "Could not fetch performance history.",
        status: "error",
        duration: 3000,
      });
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
      <Container maxW="5xl" mt={24}>
        <Heading size="lg" mb={6} textAlign="center">
          Previous Quiz Attempts
        </Heading>

        <VStack spacing={6}>
          {history.map((attempt) => (
            <Box
              key={attempt._id}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              shadow="md"
              width="100%"
              bg="white"
            >
              <Text fontSize="xl" fontWeight="bold" color="blue.700">
                {attempt.quizName}
              </Text>
              <Text color="gray.600">Teacher: {attempt.teacherName}</Text>
              <Text color="gray.500">
                Attempted on: {new Date(attempt.attemptedAt).toLocaleString()}
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
      </Container>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            <Text>Quiz Results</Text>
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
