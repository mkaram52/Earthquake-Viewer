import { useRef, useState, useEffect } from "react";
import {
  Box,
  Card,
  VStack,
  StackSeparator,
} from "@chakra-ui/react";
import DateBarChart from "./graphs/DateBarChart.tsx";
import MagnitudePieChart from "./graphs/MagnitudePieChart.tsx";

const GraphList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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
      <VStack separator={<StackSeparator />}>
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
            <DateBarChart
              width={width}
              height={width}
            />
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
            <Box width="100%" minHeight="400px">
              <MagnitudePieChart
                width={width}
              />
            </Box>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
};

export default GraphList