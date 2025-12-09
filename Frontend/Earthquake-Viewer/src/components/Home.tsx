import { useEffect, useState } from 'react';
import {
  Box,
} from "@chakra-ui/react";
import Header from "../components/Header";
import Map from "../components/Map";
import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import {type Earthquake, fetchEarthquakes} from "../api/earthquakes.ts";
import {
  setEarthquakes
} from "../state/slices/Earthquakes.ts";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchEarthquakes,
  });

  useEffect(() => {
    if (isLoading) return;
    if (data) {
      dispatch(setEarthquakes(data?.earthquakes));
    }
  }, [dispatch, isLoading]);


  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      margin={0}
      padding={0}
    >
      <Box
        width="100%"
        flex="1"
        overflow="hidden"
      >
        <Map/>
      </Box>
    </Box>
  );
}

export default Home;