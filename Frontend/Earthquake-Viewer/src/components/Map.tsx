import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box,
} from '@chakra-ui/react'
import mapboxgl from 'mapbox-gl'
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import Marker from "./Marker.tsx";
import MapTable from "./MapTable.tsx";
import MapButtonMenu from "./MapButtonMenu.tsx";
import { boundingBorders } from "../utils/countries.ts";
import {
  setInViewEarthquakes,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectEarthquakes,
  startFiltering,
  stopFiltering,
  selectCountryFilter,
} from "../state/slices/Earthquakes.ts";
import {
  selectIsOpen,
} from "../state/slices/Table.ts"

import 'mapbox-gl/dist/mapbox-gl.css'

const Map = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const selectedEarthquake = useSelector(selectSelectedEarthquake);
  const earthquakes = useSelector(selectEarthquakes);
  const isTableOpen = useSelector(selectIsOpen);
  const selectedCountry = useSelector(selectCountryFilter);

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoibWthcmFtNTM4IiwiYSI6ImNtaXFtdDBndzBvN3QzZW92a245ZGdlNmEifQ.r-vPjAr8m5NhvU31mBQl1A'

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/navigation-night-v1',
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
    dispatch(setInViewEarthquakes(visibleEarthquakes || []));
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

    if (selectedEarthquake) {
    //   dispatch(startFiltering());
    //   const currentCenter = mapRef.current.getCenter();
    //   mapRef.current!.flyTo({center: currentCenter, zoom: 5, duration: 1000});
    // } else {
      dispatch(startFiltering());
      mapRef.current!.flyTo({center: [selectedEarthquake.longitude, selectedEarthquake.latitude], zoom: 13, duration: 1000});
    }
  },[selectedEarthquake])

  // Resize map when table opens/closes - wait for animation to complete
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    // Wait for animation to complete (300ms) plus a small buffer
    const timeoutId = setTimeout(() => {
      mapRef.current?.resize();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [isTableOpen, mapLoaded])

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (selectedCountry) {
      if (boundingBorders.has(selectedCountry)) {
        const borders = boundingBorders.get(selectedCountry);
        if (borders) {
          mapRef.current.fitBounds(
            [
              [borders[0], borders[1]], // Southwest coordinates
              [borders[2], borders[3]]  // Northeast coordinates
            ],
            {
              padding: 20,
              duration: 2000,
            }
          );
        }
      }
    }
  }, [selectedCountry])

  return (
    <Box h="100%" w="100%" position="relative" display="flex">
      {/* Table sidebar with animation */}
      <Box
        w={isTableOpen ? "25%" : "0%"}
        maxW={isTableOpen ? "25%" : "0%"}
        h="100%"
        overflow="hidden"
        opacity={isTableOpen ? 1 : 0}
        transition="all 0.3s ease-in-out"
        flexShrink={0}
      >
        <Box p={4} overflowY="auto" h="100%" w="100%">
          <MapTable />
        </Box>
      </Box>
      
      {/* Map container */}
      <Box
        flex="1"
        h="100%"
        w="100%"
        position="relative"
        transition="all 0.3s ease-in-out"
      >
        <div style={{ width: '100%', height: '100%' }} ref={mapContainerRef} />
        <MapButtonMenu />
        {mapLoaded && mapRef.current && earthquakes.map((eq) => (
          <Marker
            key={eq.earthquake_id}
            earthquake={eq}
            map={mapRef.current!}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Map;
