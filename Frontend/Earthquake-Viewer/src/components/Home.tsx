import { useEffect } from 'react';
import {
  Box,
} from "@chakra-ui/react";
import Map from "../components/Map";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import { fetchEarthquakes } from "../api/earthquakes.ts";
import {
  setEarthquakes
} from "../state/slices/Earthquakes.ts";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetches all earthquakes in descending order by magnitude
  const { data, isLoading } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchEarthquakes,
  });


  // Once the earthquakes are fetched, store them in the redux store for reducers to filter
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