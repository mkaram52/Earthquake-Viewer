import React, { useRef, useEffect, useMemo } from "react"
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
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import { getMagnitudeColorHex } from "../utils/magnitudeColors.ts";

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
  const isSelected = selectedEarthquake && earthquake.earthquake_id === selectedEarthquake.earthquake_id;

  const handleSelectEarthquake = (earthquake: Earthquake) => {
    if (earthquake.earthquake_id === selectedEarthquake?.earthquake_id) {
      dispatch(clearSelectedEarthquake());
    } else {
      dispatch(selectEarthquake(earthquake));
    }
  }

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
  }, [])
// AIzaSyA11gialtmUtD5XoYmhU-X775B3CU-LVvM
  return (
    <>
      {createPortal(
        <div
          onClick={() => handleSelectEarthquake(earthquake)}
          className="rounded-full flex items-center justify-center cursor-pointer w-10 h-10"
          style={{
            // TO-DO : Add Hover Coloring
            backgroundColor: markerColor,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
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

export default Marker;