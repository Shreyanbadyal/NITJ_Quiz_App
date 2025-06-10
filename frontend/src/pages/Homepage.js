import { React, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Center,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/main");
    }
  }, [navigate]);

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      py={10}
      px={4}
    >
      <Container maxW="xl" centerContent>
        <Box
          textAlign="center"
          p={4}
          bg="white"
          w="100%"
          borderRadius="lg"
          boxShadow="md"
          mb={6}
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            fontFamily="Work Sans"
            color="blue.600"
          >
            NITJ QUIZ HUB
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Practice. Compete. Learn.
          </Text>
        </Box>

        <Box
          bg="white"
          w="100%"
          p={6}
          borderRadius="lg"
          boxShadow="xl"
        >
          <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
            <TabList mb={4}>
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Stack
          direction="row"
          mt={10}
          spacing={4}
          justify="center"
          color="gray.500"
          fontSize="sm"
        >
          <Text>© {new Date().getFullYear()} NITJ QUIZ HUB</Text>
          <Text>|</Text>
          <Text>Made with ❤️ by Team NITJ</Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Homepage;
