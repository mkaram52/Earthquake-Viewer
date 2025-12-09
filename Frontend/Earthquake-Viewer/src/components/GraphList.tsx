import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  VStack,
  Text,
} from "@chakra-ui/react";
import DateBarChart from "./graphs/DateBarChart.tsx";
import MagnitudePieChart from "./graphs/MagnitudePieChart.tsx";
import CountryPieChart from "./graphs/CountryPieChart.tsx";
import { useSelector } from "react-redux";
import {
  selectMagnitudeHover,
  selectFilteredEarthquakes,
  selectDateHover,
  selectCountryHover,
  selectHoverCount,
  selectInViewEarthquakes,
  selectGlobal,
} from "../state/slices/Earthquakes.ts";
import { getMagnitudeColorHex } from "../utils/magnitudeColors.ts";

const GraphList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewEarthquakes = useSelector(selectInViewEarthquakes);
  const filteredEarthquakes = useSelector(selectFilteredEarthquakes);
  const [width, setWidth] = useState(0);
  const magnitude = useSelector(selectMagnitudeHover);
  const date = useSelector(selectDateHover);
  const count = useSelector(selectHoverCount);
  const country = useSelector(selectCountryHover);
  const global = useSelector(selectGlobal);

  // TO-DO : Clean Up Hover Text styling
  const hoverText = useMemo(() => {
    if (magnitude) {
      // return `Magnitude ${magnitude} - ${(magnitude || 0) + 1} : ${count} Earthquakes`;
      if (magnitude === 6) {
        return `${count} Earthquakes of ${magnitude}+ Magnitude`;
      }
      return `${count} Earthquakes between ${magnitude} and ${(magnitude || 0) + 1} Magnitude`
    } else if (date) {
      return `${count} Earthquakes on ${new Date(date).toLocaleString(
        'en-US',
        { month: 'short', day: 'numeric' }
      )}`
    } else if (country) {
      return `${count} Earthquakes in ${country === "International" ? "International Waters" : country}`;
    } else {
      return `${global ? filteredEarthquakes.length : inViewEarthquakes.length} Total Earthquakes`;
    }
  }, [magnitude, count, inViewEarthquakes, filteredEarthquakes, global]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width;
      setWidth(width);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box ref={containerRef} p={4} w="100%">
      <VStack>
        <Box
          position="sticky"
          mt={-4}
          top={0}
          zIndex={5}
          width="100%"
          flexShrink={0}
          marginBottom={4}
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Card.Root bg="gray.600">
            <Card.Body p={4}>
              <Text
                fontSize="20px"
                fontWeight="bold"
                textAlign="center"
                color={magnitude ? getMagnitudeColorHex(magnitude) : "white"}
              >
                {hoverText}
              </Text>
            </Card.Body>
          </Card.Root>
        </Box>
        <VStack>
          <Card.Root
            variant="outline"
            bg={"gray.800"}
            borderColor={"gray.700"}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.15s ease-out"
            w="100%"
          >
            <Card.Body p={0}>
              <Box minWidth={width} minHeight={width}>
                <DateBarChart
                  width={width}
                  height={width}
                  earthquakes={global ? filteredEarthquakes : inViewEarthquakes}
                />
              </Box>
            </Card.Body>
          </Card.Root>
          <Card.Root
            variant="outline"
            bg={"gray.800"}
            borderColor={"gray.700"}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.15s ease-out"
            w="100%"
          >
            <Card.Body p={0}>
              <Box minWidth={width} minHeight={width}>
                <MagnitudePieChart
                  width={width}
                  earthquakes={global ? filteredEarthquakes : inViewEarthquakes}
                />
              </Box>
            </Card.Body>
          </Card.Root>
          <Card.Root
            variant="outline"
            bg={"gray.800"}
            borderColor={"gray.700"}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.15s ease-out"
            w="100%"
          >
            <Card.Body p={0}>
              <Box minWidth={width} minHeight={width}>
                <CountryPieChart
                  width={width}
                  earthquakes={global ? filteredEarthquakes : inViewEarthquakes}
                />
              </Box>
            </Card.Body>
          </Card.Root>
        </VStack>
      </VStack>
    </Box>
  );
};

export default GraphList