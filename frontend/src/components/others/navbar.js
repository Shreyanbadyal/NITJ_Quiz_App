import React from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Text,
  Avatar,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = [
    { label: "Give Test", href: "/testpage" },
    { label: "Performance", href: "/performance" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Upload Question", href: "/uploadQuestion" },
  ];

  if (user?.isTeacher) {
    navItems.push({ label: "Create Quiz", href: "/create-quiz" });
  }

  const linkStyle = {
    textDecoration: "none",
    fontWeight: "medium",
  };

  return (
    <Flex
      as="nav"
      align="center"
      bg="blue.600"
      p={4}
      color="white"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={1000}
      boxShadow="md"
    >
      {/* Mobile Menu Icon */}
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="Open Menu"
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
        bg="transparent"
        _hover={{ bg: "blue.700" }}
        mr={2}
      />

      {/* Drawer for Mobile Navigation */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontWeight="bold">
            Menu
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              aria-label="Close"
              onClick={onClose}
              position="absolute"
              top={2}
              right={2}
            />
          </DrawerHeader>
          <DrawerBody>
            {navItems.map((item) => (
              <Link href={item.href} key={item.label} style={linkStyle}>
                <Box mb={4}>
                  <Text fontSize="md">{item.label}</Text>
                </Box>
              </Link>
            ))}
            <Link href="/profile" style={linkStyle}>
              <Box display="flex" alignItems="center" mt={6}>
                <Avatar size="sm" name={user.name} />
                <Text ml={2}>Profile</Text>
              </Box>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Navigation */}
      <HStack spacing={6} display={{ base: "none", md: "flex" }}>
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            _hover={{ textDecoration: "underline", color: "whiteAlpha.900" }}
            fontWeight="medium"
            fontSize="md"
          >
            {item.label}
          </Link>
        ))}
      </HStack>

      <Spacer />

      {/* Profile Section */}
      <Link href="/profile" style={linkStyle}>
        <Box display="flex" alignItems="center">
          <Avatar size="sm" name={user.name} />
          <Text ml={2} fontWeight="medium">
            Profile
          </Text>
        </Box>
      </Link>
    </Flex>
  );
};

export default Navbar;
