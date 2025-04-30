import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "./navbar";

const PerformanceGraph = () => {
  const [lang_id, setLangId] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [initialRenderLangId, setInitialRenderLangId] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:4000/performance?uid=${userInfo._id}&lang_id=${lang_id}`,
        config
      );
      setPerformanceData(response.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (initialRenderLangId) {
      setInitialRenderLangId(false);
      return;
    }
    fetchData();
  }, [lang_id]);

  const openModalWithDetails = (attempt) => {
    setSelectedAttempt(attempt);
    onOpen();
  };

  return (
    <>
      <Navbar />
      <Box
        p={4}
        background="white"
        width="100vw"
        minHeight="100vh"
        textAlign="center"
      >
        <Text fontSize="3xl" fontWeight="bold" my={6}>
          Test Attempts
        </Text>

        <Select
          placeholder="Select Language"
          value={lang_id}
          onChange={(e) => setLangId(e.target.value)}
          mb={5}
          width="300px"
          mx="auto"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language.toUpperCase()}
            </option>
          ))}
        </Select>

        {performanceData.length > 0 ? (
          <VStack spacing={5} mt={8}>
            {performanceData.map((item, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p={5}
                width="80%"
                shadow="md"
                textAlign="left"
              >
                <Text fontSize="lg" fontWeight="bold">
                  Attempt {index + 1} - {lang_id.toUpperCase()}
                </Text>
                <Text>Date: {new Date(item.date).toLocaleString()}</Text>
                <Button
                  colorScheme="blue"
                  mt={3}
                  onClick={() => openModalWithDetails(item)}
                >
                  See Performance
                </Button>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text mt={10} fontSize="xl">
            No attempts found.
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Performance Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAttempt && (
              <Box>
                <Text><strong>Score %:</strong> {selectedAttempt.score_percent}%</Text>
                <Text><strong>Accuracy:</strong> {selectedAttempt.accuracy}%</Text>
                <Text><strong>Correct Answers:</strong> {selectedAttempt.correct_answers}</Text>
                <Text><strong>Total Questions:</strong> {selectedAttempt.total_questions}</Text>
                <Text>
  <strong>Date:</strong>{" "}
  {selectedAttempt.date
    ? new Date(selectedAttempt.date).toLocaleDateString()
    : "Not available"}
</Text>


              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PerformanceGraph;
