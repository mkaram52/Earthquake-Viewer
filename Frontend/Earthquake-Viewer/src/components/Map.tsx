import { useState, useRef, useEffect, useCallback } from 'react'
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
  selectFilteredEarthquakes,
  selectInViewEarthquakes,
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
  const filteredEarthquakes = useSelector(selectFilteredEarthquakes);
  const inViewEarthquakes = useSelector(selectInViewEarthquakes);
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
    if (!mapRef.current) return;
    if (!filteredEarthquakes || filteredEarthquakes.length === 0) {
      dispatch(setInViewEarthquakes([]));
      dispatch(stopFiltering());
      return;
    }

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    // Normalize longitudes to -180 to 180 range
    const normalizeLng = (lng: number): number => {
      while (lng < -180) lng += 360;
      while (lng > 180) lng -= 360;
      return lng;
    };

    const swLngRaw = sw.lng;
    const swLat = sw.lat;
    const neLngRaw = ne.lng;
    const neLat = ne.lat;

    // If the map is expanded so far that the longitude range is over 360,
    // then everything is in view
    if (swLngRaw <= -360 || neLngRaw >= 360 || neLngRaw - swLngRaw > 360) {
      dispatch(setInViewEarthquakes(filteredEarthquakes));
      dispatch(stopFiltering());
      return;
    }

    const swLng = normalizeLng(swLngRaw);
    const neLng = normalizeLng(neLngRaw);

    // Ran into an issue where mapbox inaccurately defines its bounds when zoomed out
    const isPointInBounds = (lng: number, lat: number): boolean => {
      const normalizedLng = normalizeLng(lng);

      if (lat < swLat || lat > neLat) {
        return false;
      }

      if (swLng <= neLng) {
        return normalizedLng >= swLng && normalizedLng <= neLng;
      } else {
        return normalizedLng >= swLng || normalizedLng <= neLng;
      }
    };

    const visibleEarthquakes = filteredEarthquakes.filter((eq) => {
      return isPointInBounds(eq.longitude, eq.latitude);
    })
    
    dispatch(setInViewEarthquakes(visibleEarthquakes || []));
    dispatch(stopFiltering());
  }, [filteredEarthquakes, dispatch]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !filteredEarthquakes) return;

    const handleMoveEnd = () => {
      dispatch(startFiltering());
      checkVisibleMarkers();
    };

    mapRef.current.on('moveend', handleMoveEnd);
    
    checkVisibleMarkers();

    return () => {
      mapRef.current?.off('moveend', handleMoveEnd);
    }
  }, [mapLoaded, filteredEarthquakes, checkVisibleMarkers])

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (!selectedEarthquake) {
      dispatch(startFiltering());
      const currentCenter = mapRef.current.getCenter();
      mapRef.current!.flyTo({center: currentCenter, zoom: 4, duration: 1000});
    } else {
      dispatch(startFiltering());
      mapRef.current!.flyTo({center: [selectedEarthquake.longitude, selectedEarthquake.latitude], zoom: 13, duration: 1000});
    }
  },[selectedEarthquake])

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
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
      
      <Box
        flex="1"
        h="100%"
        w="100%"
        position="relative"
        transition="all 0.3s ease-in-out"
      >
        <div style={{ width: '100%', height: '100%' }} ref={mapContainerRef} />
        <MapButtonMenu />
        {mapLoaded && mapRef.current && [...inViewEarthquakes].reverse().map((eq) => (
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
