import { useCallback } from 'react'
import {
  VStack,
  IconButton,
  Box,
} from "@chakra-ui/react";
import {
  selectListOpen,
  selectGraphOpen,
  selectFilterOpen,
  openList,
  closeList,
  openFilter,
  closeFilter,
  openGraph,
  closeGraph,
} from "../state/slices/Table.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import formatListBulleted from "@iconify/icons-mdi/format-list-bulleted"
import filter from "@iconify/icons-mdi/filter"
import graphPie from "@iconify/icons-mdi/graph-pie"
import { Icon, addIcon } from "@iconify/react/dist/offline";

addIcon("format-list-bulleted", formatListBulleted);
addIcon("filter", filter);
addIcon("graph-pie", graphPie);

const MapButtonMenu = () => {
  const dispatch = useDispatch<AppDispatch>();
  const listOpen = useSelector(selectListOpen);
  const filterOpen = useSelector(selectFilterOpen);
  const graphOpen = useSelector(selectGraphOpen);

  const handleSelectList = useCallback(() => {
    if (listOpen) {
      dispatch(closeList());
    } else {
      dispatch(openList());
    }
  }, [ dispatch, listOpen ]);

  const handleSelectFilter = useCallback(() => {
    if (filterOpen) {
      dispatch(closeFilter());
    } else {
      dispatch(openFilter());
    }
  }, [ dispatch, filterOpen ]);

  const handleSelectGraph = useCallback(() => {
    if (graphOpen) {
      dispatch(closeGraph());
    } else {
      dispatch(openGraph());
    }
  }, [ dispatch, graphOpen ]);

  return (
    <Box
      position="absolute"
      left={0}
      top="50%"
      bg="transparent"
      transform="translateY(-50%)"
      zIndex={1000}
      ml={2}
    >
      <VStack
        p={2}
        borderRadius="md"
        boxShadow="lg"
      >
        <IconButton
          aria-label="Open List Table"
          onClick={() => handleSelectList()}
          size="md"
          variant="ghost"
        >
          <Icon
            icon="format-list-bulleted"
            width="27px"
            height="27px"
            color={listOpen ? "yellow" : "white"}
          />
        </IconButton>
        <IconButton
          aria-label="Open Filter Table"
          onClick={() => handleSelectFilter()}
          size="md"
          variant="ghost"
        >
          <Icon
            icon="filter"
            width="27px"
            height="27px"
            color={filterOpen ? "yellow": "white"}
          />
        </IconButton>
        <IconButton
          aria-label="Open Graph Table"
          onClick={() => handleSelectGraph()}
          size="md"
          variant="ghost"
        >
          <Icon
            icon="graph-pie"
            width="27px"
            height="27px"
            color={graphOpen ? "yellow": "white"}
          />
        </IconButton>
      </VStack>
    </Box>
  );
};

export default MapButtonMenu;

