import React, { useCallback, useMemo } from 'react'
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
  selectFilterOpen
} from "../state/slices/Table.ts";
import { useDispatch, useSelector } from "react-redux";
import EarthquakeList from "./EarthquakeList.tsx";
import FilterList from "./FilterList.tsx";

const MapTable = () => {
  const filteredEarthquakes = useSelector(selectInViewEarthquakes);
  const isFiltering = useSelector(selectIsFiltering);
  const listOpen = useSelector(selectListOpen);
  const filterOpen = useSelector(selectFilterOpen);
  const graphOpen = useSelector(selectGraphOpen);


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

  // Show empty state
  if (filteredEarthquakes?.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">
          No Earthquakes Found
        </Text>
      </Center>
    );
  }

  const Section = () => {
    if (listOpen) {
      return <EarthquakeList/>;
    } else if (filterOpen) {
      return <FilterList/>;
    } else {
      return (
        <Center py={8}>
          <Text color="gray.500">
            No Page Found
          </Text>
        </Center>
      )
    }
  }

  return (
    <Box
      overflowY="auto"
      width="100%"
      maxWidth="100%"
      height="100%"
      maxHeight="100%"
    >
      {Section()}
    </Box>
  )
}

export default MapTable;