import React from 'react'
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

  const handleSelectList = () => {
    if (listOpen) {
      dispatch(closeList());
    } else {
      dispatch(openList());
    }
  }

  const handleSelectFilter = () => {
    if (filterOpen) {
      dispatch(closeFilter());
    } else {
      dispatch(openFilter());
    }
  }

  const handleSelectGraph = () => {
    if (graphOpen) {
      dispatch(closeGraph());
    } else {
      dispatch(openGraph());
    }
  }

  return (
    <Box
      position="absolute"
      left={0}
      top="10%"
      transform="translateY(-50%)"
      zIndex={1000}
      ml={2}
    >
      <VStack
        spacing={2}
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="lg"
      >
        <IconButton
          aria-label="Menu option 1"
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
          aria-label="Filter Table"
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
          aria-label="Graph Table"
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

