import React from 'react'
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
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake, selectIsFiltering,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import { type Earthquake } from "../api/earthquakes.ts";
import { getMagnitudeColorToken } from "../utils/magnitudeColors.ts";

const EarthquakeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredEarthquakes = useSelector(selectInViewEarthquakes);
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
      {filteredEarthquakes.map((eq: Earthquake, index: number) => {
        const selected = selectedEarthquake && eq.earthquake_id === selectedEarthquake.earthquake_id;
        const selectedColor = getMagnitudeColorToken(eq.magnitude)
        const bgColor = index % 2 === 0 ? "white" : "gray.50";

        const date = new Date(eq.time);
        // TO-DO : Format Date Better
        const formattedDate = date.toLocaleString('en-US', { timeZone: 'America/New_York' })
        return (
          <Box key={eq.earthquake_id} bg={bgColor} width="100%">
            <Box
              // TO-DO : Make a way of showing what's selected in the table
              w="100%"
              borderLeft="10px solid"
              borderColor={selectedColor}
              bg={bgColor}
              p={3}
              cursor="pointer"
              // TO-DO : Add Hover Coloring to Marker
              _hover={{ bg: "gray.200" }}
              transition="background-color 0.2s"
              onClick={() => handleSelectEarthquake(eq)}
              position="relative"
            >
              <HStack spacing={2} justifyContent="space-between">
                <VStack align="stretch">
                  <Text fontSize="sm" fontWeight={600} color="blue.500">
                    <a href={`https://earthquake.usgs.gov/earthquakes/eventpage/${eq.earthquake_id}/executive`} target="_blank">
                      {eq.place}
                    </a>
                  </Text>
                  <Text fontSize="xs" fontWeight={500} color="blue.500">
                    {formattedDate}
                  </Text>
                  <Text fontSize="xs" fontWeight={500} color="gray.500">
                    {eq.magnitude.toFixed(2)} magnitude
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        )
      })}
    </VStack>
  )
};

export default EarthquakeList;