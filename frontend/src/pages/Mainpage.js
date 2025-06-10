import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "../components/others/navbar";

const Mainpage = () => {
  return (
    <>
      <Navbar />
      <Box
        minH="100vh"
        bgGradient="linear(to-br, teal.400, blue.500)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
        py={{ base: 10, md: 20 }}
      >
        <Stack spacing={6} align="center" textAlign="center" maxW="3xl">
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="extrabold"
            color="white"
            lineHeight="short"
          >
            Welcome to NITJ Quiz App
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "2xl" }}
            color="whiteAlpha.900"
            px={{ base: 4, md: 10 }}
          >
            Practice. Compete. Learn. Explore quizzes created by teachers and improve your skills every day.
          </Text>
        </Stack>
      </Box>
    </>
  );
};

export default Mainpage;
