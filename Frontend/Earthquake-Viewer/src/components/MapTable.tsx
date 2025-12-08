import React, { useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Center,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import {
  selectInViewEarthquakes,
  selectIsFiltering,
} from "../state/slices/Earthquakes.ts";
import {
  selectListOpen,
  selectGraphOpen,
  selectFilterOpen,
  selectIsOpen,
} from "../state/slices/Table.ts";
import { useSelector } from "react-redux";
import MapTableSection from "./MapTableSection.tsx";

const MapTable = () => {
  const isFiltering = useSelector(selectIsFiltering);
  const listOpen = useSelector(selectListOpen);
  const filterOpen = useSelector(selectFilterOpen);
  const graphOpen = useSelector(selectGraphOpen);
  const isOpen = useSelector(selectIsOpen);

  if (isFiltering) {
    return (
      <Box
        width="100%"
        maxWidth="100%"
        height="100%"
        maxHeight="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={3}>
          <Spinner size="lg" color="teal.500" />
          <Text color="gray.500">
            Loading Earthquakes...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      maxWidth="100%"
      height="100%"
      maxHeight="100%"
      overflow="hidden"
    >
      <MapTableSection
        isOpen={isOpen}
        listOpen={listOpen}
        graphOpen={graphOpen}
        filterOpen={filterOpen}
      />
    </Box>
  )
}

export default MapTable;