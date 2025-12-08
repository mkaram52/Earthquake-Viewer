import React from 'react'
import {
  Box,
  VStack,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import {
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectSelectedFirstEarthquakes,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import { type Earthquake } from "../api/earthquakes.ts";
import EarthquakeListItem from "./EarthquakeListItem.tsx";

const EarthquakeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredEarthquakes = useSelector(selectSelectedFirstEarthquakes);
  const selectedEarthquake = useSelector(selectSelectedEarthquake);
  const isFiltering = useSelector(selectIsFiltering);

  const handleSelectEarthquake = (earthquake: Earthquake) => {
    if (earthquake.earthquake_id === selectedEarthquake?.earthquake_id) {
      dispatch(clearSelectedEarthquake());
    } else {
      dispatch(selectEarthquake(earthquake));
    }
  }

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

  return (
    <VStack align="stretch" width="100%">
      {filteredEarthquakes.map((eq: Earthquake) => {
        const selected = !!(selectedEarthquake && eq.earthquake_id === selectedEarthquake.earthquake_id);
        return (
          <EarthquakeListItem
            key={eq.earthquake_id}
            eq={eq}
            selected={selected}
            onSelect={handleSelectEarthquake}
          />
        );
      })}
    </VStack>
  )
};

export default React.memo(EarthquakeList);