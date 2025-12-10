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
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Initialize map with center at Pittsburgh
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

    // Remove map on unmount to clean up ref
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

    // When zoomed out, the map tends to determine its bounds from one edge to the other
    // instead of from the center to the edges, so one point will be accurate
    // while the other needs to be corrected.

    // When degrees go past 180, they need to be measured in the other direction to remain consistent
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

    const isPointInBounds = (lng: number, lat: number): boolean => {
      const normalizedLng = normalizeLng(lng);

      // Latitudes were consistent in this map style, so check if eq latitude is out of bounds first
      if (lat < swLat || lat > neLat) {
        return false;
      }

      // If eastern latitude is greater than western, the longitudes are correct and will be checked normally
      if (swLng <= neLng) {
        return normalizedLng >= swLng && normalizedLng <= neLng;
      } else {
      // If not then the eastern side has wrapped around and now represents the western side
        return normalizedLng >= swLng || normalizedLng <= neLng;
      }
    };

    const visibleEarthquakes = filteredEarthquakes.filter((eq) => {
      return isPointInBounds(eq.longitude, eq.latitude);
    })
    
    dispatch(setInViewEarthquakes(visibleEarthquakes || []));
    dispatch(stopFiltering());
  }, [filteredEarthquakes, dispatch]);

  // Add on move end listener to trigger re-check of visible earthquakes
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

  // When a earthquake is selected, fly to it and zoom in. When unselected, fly back but keep center
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

  // When the table is opened or closed, resize the map
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    const timeoutId = setTimeout(() => {
      mapRef.current?.resize();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [isTableOpen, mapLoaded])

  // When a country filter is selected, fly and zoom so the entirety of the country is in view
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
        <MapButtonMenu /> {/* We reverse the list to put the first of whatever sort is current on top */}
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
