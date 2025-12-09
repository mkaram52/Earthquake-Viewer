import React, { useRef, useEffect, useMemo, useCallback, useState } from "react"
import type { Earthquake } from "../api/earthquakes.ts";
import { createPortal } from "react-dom";
import arrowDown from "@iconify/icons-mdi/arrow-down";
import star from "@iconify/icons-mdi/star";
import triangleWave from "@iconify/icons-mdi/triangle-wave";
import sawtoothWave from "@iconify/icons-mdi/sawtooth-wave";
import { Icon, addIcon } from "@iconify/react/dist/offline";
import mapboxgl from 'mapbox-gl'
import {
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectMagnitudeHover,
  selectDateHover,
  selectCountryHover,
} from "../state/slices/Earthquakes.ts";
import {
  openList
} from "../state/slices/Table.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import {
  getMagnitudeColorHex, getMagnitudeColorHoverHex
} from "../utils/magnitudeColors.ts";

addIcon("arrow-down", arrowDown);
addIcon("star", star);
addIcon("triangle-wave", triangleWave);
addIcon("sawtooth-wave", sawtoothWave);

interface MarkerProps {
  earthquake: Earthquake,
  map: mapboxgl.Map,
}

const Marker: React.FC<MarkerProps> = ({
  earthquake,
  map,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const contentRef = useRef(document.createElement("div"));
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const selectedEarthquake = useSelector(selectSelectedEarthquake);
  const magnitude = useSelector(selectMagnitudeHover);
  const date = useSelector(selectDateHover);
  const country = useSelector(selectCountryHover);
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedEarthquake && earthquake.earthquake_id === selectedEarthquake.earthquake_id;

  const handleSelectEarthquake = useCallback((earthquake: Earthquake) => {
    if (earthquake.earthquake_id === selectedEarthquake?.earthquake_id) {
      dispatch(clearSelectedEarthquake());
    } else {
      dispatch(selectEarthquake(earthquake));
      dispatch(openList());
    }
  }, [selectedEarthquake, dispatch]);

  const markerColor = useMemo(() => {
    return getMagnitudeColorHex(earthquake.magnitude);
  }, [earthquake.magnitude])

  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat([earthquake.longitude, earthquake.latitude])
      .addTo(map)

    return () => {
      markerRef.current?.remove()
    }
  }, [earthquake.longitude, earthquake.latitude, map]);

  const display = useMemo(() => {
    if (!magnitude && !date && !country) return 'flex';
    else if (magnitude) {
      if (magnitude === 6) {
        return earthquake.magnitude >= magnitude ? "flex" : "none";
      } else {
        return Math.floor(earthquake.magnitude) === magnitude ? 'flex' : 'none';
      }
    } else if (date) {
      const eqDate = earthquake.time.split("T")[0];
      if (eqDate === date) return 'flex';
      else return 'none';
    } else if (country) {
      if (country === "International") {
        return earthquake.country ? "none" : "flex";
      } else {
        return earthquake.country === country ? "flex" : "none";
      }
    } else {
      return 'none';
    }
  }, [magnitude, date, country, earthquake.magnitude, earthquake.time, earthquake.country]);

  return (
    <>
      {createPortal(
        <div
          onClick={() => handleSelectEarthquake(earthquake)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="rounded-full flex items-center justify-center cursor-pointer w-10 h-10"
          style={{
            backgroundColor: isHovered ? getMagnitudeColorHoverHex(earthquake.magnitude) : markerColor,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: display,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid black',
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out'
          }}
        >
          {isSelected ? (
            <Icon icon="star" width="27px" height="27px" color="black" />
          ) : (
            <Icon icon="sawtooth-wave" width="18px" height="18px" color="black" />
          )}
        </div>,
        contentRef.current
      )}
    </>
  )
}

export default React.memo(Marker, (prevProps, nextProps) => {
  return (
    prevProps.earthquake.earthquake_id === nextProps.earthquake.earthquake_id &&
    prevProps.earthquake.longitude === nextProps.earthquake.longitude &&
    prevProps.earthquake.latitude === nextProps.earthquake.latitude &&
    prevProps.earthquake.magnitude === nextProps.earthquake.magnitude &&
    prevProps.earthquake.time === nextProps.earthquake.time &&
    prevProps.earthquake.country === nextProps.earthquake.country &&
    prevProps.map === nextProps.map
  );
});