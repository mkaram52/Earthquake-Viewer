import React, { useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  HStack,
  StackSeparator,
  Card,
} from "@chakra-ui/react";
import { type Earthquake } from "../api/earthquakes.ts";
import { getMagnitudeColorToken } from "../utils/magnitudeColors.ts";

interface EarthquakeListItemProps {
  eq: Earthquake;
  selected: boolean;
  onSelect: (eq: Earthquake) => void;
}

const EarthquakeListItem = React.memo<EarthquakeListItemProps>(
  ({ eq, selected, onSelect }) => {
  const magColor = getMagnitudeColorToken(eq.magnitude);

  const { formattedDate, time } = useMemo(() => {
    const date = new Date(eq.time);
    const formatted = date.toLocaleString(
      'en-US',
      { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/New_York' }
    );
    const timeStr = date.toLocaleTimeString(
      'en-US',
      { timeStyle: 'short', timeZone: 'America/New_York' }
    );
    return { formattedDate: formatted, time: timeStr };
  }, [eq.time]);

  return (
    <Card.Root
      variant="outline"
      bg={"gray.800"}
      borderColor={"gray.700"}
      borderRadius="lg"
      overflow="hidden"
      _hover={{ borderColor: magColor, transform: "translateY(-1px)", shadow: "md" }}
      onClick={() => onSelect(eq)}
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
  );
});

export default EarthquakeListItem;