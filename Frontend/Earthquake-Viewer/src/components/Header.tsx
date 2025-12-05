import React, { useEffect, memo, useRef } from "react";
import {
  Box,
  Image,
  HStack,
  Button,
  IconButton,
  Text,
} from "@chakra-ui/react";

const Header = () => {
  return (
    <Box
      width="100%"
      backgroundColor="#2a3042"
      position="sticky"
      top={"-8px"}
      py={2}
      zIndex={1000}
      height={{ base: "60px", md: "72px" }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      mb={0}
    >
      <HStack
        maxW="100%"
        w="100%"
        h="100%"
        mx="auto"
        px={10}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Earthquake Viewer
        </Text>
      </HStack>
    </Box>
  );
}

export default Header;