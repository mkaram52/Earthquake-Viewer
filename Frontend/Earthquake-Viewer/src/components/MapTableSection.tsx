import React from 'react'
import {
  Box,
  Text,
  Center,
} from "@chakra-ui/react";
import EarthquakeList from "./EarthquakeList.tsx";
import FilterList from "./FilterList.tsx";
import GraphList from "./GraphList.tsx";

interface MapTableSectionProps {
  isOpen: boolean;
  listOpen: boolean;
  graphOpen: boolean;
  filterOpen: boolean;
}

const MapTableSection = React.memo<MapTableSectionProps>(
  ({ isOpen, listOpen, graphOpen, filterOpen }) => {
  if (isOpen) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
      >
        {filterOpen && (
          <Box
            position="sticky"
            top={0}
            zIndex={10}
            width="100%"
            flexShrink={0}
            marginBottom={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <FilterList/>
          </Box>
        )}
        <Box
          flex="1"
          overflowY="auto"
          width="100%"
          paddingTop={listOpen ? 1 : 0}
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {listOpen ? (
            <EarthquakeList/>
          ) : (
            graphOpen && (
              <GraphList/>
            )
          )}
        </Box>
      </Box>
    )
  } else if (graphOpen) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
      >
        <GraphList />
      </Box>
    );

  } else {
    return (
      <Center py={8}>
        <Text color="gray.500">
          No Page Found
        </Text>
      </Center>
    )
  }
});

export default MapTableSection;