import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Grid,
  GridItem,
  Box,
  Text,
  Center,
  VStack,
  Spinner,
} from '@chakra-ui/react'
import mapboxgl from 'mapbox-gl'
import {type Earthquake, fetchEarthquakes} from "../api/earthquakes.ts";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import Marker from "./Marker.tsx";
import MapTable from "./MapTable.tsx";
import {
  setFilteredEarthquakes,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectEarthquakes,
  startFiltering,
  stopFiltering,
} from "../state/slices/Earthquakes.ts";

import 'mapbox-gl/dist/mapbox-gl.css'

const Map = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const selectedEarthquake = useSelector(selectSelectedEarthquake);
  const earthquakes = useSelector(selectEarthquakes);

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoibWthcmFtNTM4IiwiYSI6ImNtaXFtdDBndzBvN3QzZW92a245ZGdlNmEifQ.r-vPjAr8m5NhvU31mBQl1A'

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-80, 40], // Pittsburgh
        zoom: 4,
      });
    }

    mapRef.current?.on('load', () => {
      setMapLoaded(true);
    })

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    }
  }, [])

  const checkVisibleMarkers = useCallback(() => {
    dispatch(startFiltering());
    if (!mapRef.current || !earthquakes || earthquakes.length === 0) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const visibleEarthquakes = earthquakes.filter((eq) => {
      const eqLngLat: [number, number] = [eq.longitude, eq.latitude];
      if (bounds.contains(eqLngLat)) return true;
    })
    dispatch(setFilteredEarthquakes(visibleEarthquakes || []));
    dispatch(stopFiltering());
  }, [earthquakes, dispatch]);

  // Set up event listener for map movement when map is loaded and data is available
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !earthquakes) return;

    const handleMoveEnd = () => {
      checkVisibleMarkers();
    };

    mapRef.current.on('moveend', handleMoveEnd);
    
    // Initial check when data is loaded
    checkVisibleMarkers();

    return () => {
      mapRef.current?.off('moveend', handleMoveEnd);
    }
  }, [mapLoaded, earthquakes, checkVisibleMarkers])

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (!selectedEarthquake) {
      dispatch(startFiltering());
      const currentCenter = mapRef.current.getCenter();
      mapRef.current!.flyTo({center: currentCenter, zoom: 5, duration: 1000});
    } else {
      dispatch(startFiltering());
      mapRef.current!.flyTo({center: [selectedEarthquake.longitude, selectedEarthquake.latitude], zoom: 13, duration: 1000});
    }
  },[selectedEarthquake])

  return (
    <Box h="100%" w="100%">
      <Grid templateColumns="1fr 3fr" h="100%" w="100%">
        <GridItem p={4} overflowY="auto" h="100%">
          <MapTable />
        </GridItem>
        <GridItem h="100%" w="100%">
          <div style={{ width: '100%', height: '100%' }} ref={mapContainerRef} />
          {mapLoaded && mapRef.current && earthquakes.map((eq) => (
            <Marker
              key={eq.earthquake_id}
              earthquake={eq}
              map={mapRef.current!}
            />
          ))}
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Map;
