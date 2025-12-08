import React from 'react'
import {
  Box,
  VStack,
  Text,
  Center,
  Spinner,
  HStack,
  Stack,
  StackSeparator,
  Card,
} from "@chakra-ui/react";
import {
  selectInViewEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectSelectedFirstEarthquakes,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import { type Earthquake } from "../api/earthquakes.ts";
import { getMagnitudeColorToken } from "../utils/magnitudeColors.ts";

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
      {filteredEarthquakes.map((eq: Earthquake, index: number) => {
        const selected = selectedEarthquake && eq.earthquake_id === selectedEarthquake.earthquake_id;
        const magColor = getMagnitudeColorToken(eq.magnitude)
        const bgColor = index % 2 === 0 ? "white" : "gray.50";

        const date = new Date(eq.time);
        // TO-DO : Format Date Better
        const formattedDate = date.toLocaleString(
          'en-US',
          { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/New_York' }
        );
        const time = date.toLocaleTimeString(
          'en-US',
          { timeStyle: 'short', timeZone: 'America/New_York' }
        );

        return (
          <Card.Root
            variant="outline"
            bg={"gray.800"}
            borderColor={"gray.700"}
            borderRadius="lg"
            overflow="hidden"
            _hover={{ borderColor: magColor, transform: "translateY(-1px)", shadow: "md" }}
            onClick={() => handleSelectEarthquake(eq)}
            transition="all 0.15s ease-out"
            w="100%"
          >
            <HStack align="stretch">
              <Box
                w="6px"
                bg={magColor}
                flexShrink={0}
              />
              <Card.Body p={3}>
                <VStack separator={<StackSeparator />} align="flex-start">
                  <VStack align="flex-start">
                    <Text
                      fontSize="16px"
                      fontWeight="medium"
                      textAlign="left"
                      lineHeight="1.2"
                      mb={1}
                      color="white"
                    >
                      {eq.place}
                    </Text>
                    <Text
                      fontSize="13px"
                      color="gray.400"
                      textAlign="left"
                      lineHeight="1.2"
                    >
                      {formattedDate} • {time}
                    </Text>
                  </VStack>
                  {selected && (
                    <VStack align="flex-start">
                      <HStack>
                        <Text
                          fontSize="13px"
                          textAlign="left"
                          lineHeight="1.2"
                          mb={1}
                          color="white"
                        >
                          Magnitude: {eq.magnitude.toFixed(2)}
                        </Text>
                        <Text
                          fontSize="13px"
                          textAlign="left"
                          lineHeight="1.2"
                          mb={1}
                          color="white"
                        >
                          Depth: {eq.depth.toFixed(2)} km
                        </Text>
                      </HStack>
                      <HStack>
                        <Text
                          fontSize="13px"
                          textAlign="left"
                          lineHeight="1.2"
                          mb={1}
                          color="white"
                        >
                          {eq.latitude.toFixed(2)}°, {eq.longitude.toFixed(2)}°
                        </Text>
                        {eq.country && (
                          <HStack>
                            <Text
                              fontSize="13px"
                              textAlign="left"
                              lineHeight="1.2"
                              mb={1}
                              color="white"
                            >
                              •
                            </Text>
                            <Text
                              fontSize="13px"
                              textAlign="left"
                              lineHeight="1.2"
                              mb={1}
                              color="white"
                            >
                              {eq.country}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                      <Text fontSize="11px" color="blue.500">
                        <a 
                          href={`https://earthquake.usgs.gov/earthquakes/eventpage/${eq.earthquake_id}/executive`} 
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Learn More
                        </a>
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </Card.Body>
            </HStack>
          </Card.Root>
        )
      })}
    </VStack>
  )
};

export default EarthquakeList;