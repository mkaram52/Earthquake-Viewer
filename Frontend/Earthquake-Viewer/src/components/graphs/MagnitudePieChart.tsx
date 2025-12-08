import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
} from "@chakra-ui/react";
import {
  selectInViewEarthquakes,
  setMagnitudeHover,
  clearMagnitudeHover,
} from "../../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { getMagnitudeColorHex } from "../../utils/magnitudeColors.ts";
import { type Earthquake } from "../../api/earthquakes.ts";
import type { AppDispatch } from "../../state/Store.ts";

interface MagnitudePieChartProps {
  width: number;
}

const MagnitudePieChart: React.FC<MagnitudePieChartProps> = ({ width }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chartRef = useRef<HTMLDivElement>(null);
  const filteredEarthquakes = useSelector(selectInViewEarthquakes);

  // Group earthquakes by magnitude category and count them
  const magnitudeData = useMemo(() => {
    if (!filteredEarthquakes || filteredEarthquakes.length === 0) {
      return [];
    }

    // Create magnitude categories (0-1, 1-2, 2-3, 3-4, 4-5, 5-6, 6-7, 7-8, 8-9, 9+)
    const categories: { [key: string]: number } = {};

    filteredEarthquakes.forEach((eq: Earthquake) => {
      const magFloor = Math.floor(eq.magnitude);
      const category = magFloor >= 9 ? '9+' : `${magFloor}-${magFloor + 1}`;
      categories[category] = (categories[category] || 0) + 1;
    });

    // Convert to array format for D3
    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => {
        // Sort by magnitude value (handle 9+ specially)
        if (a.category === '9+') return 1;
        if (b.category === '9+') return -1;
        return parseFloat(a.category) - parseFloat(b.category);
      });
  }, [filteredEarthquakes]);

  useEffect(() => {
    if (!chartRef.current || magnitudeData.length === 0 || width === 0) {
      return;
    }

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const radius = width / 2 - 40;

    // Append the svg object to the container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", width)
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    // Create pie layout
    const pie = d3
      .pie<{ category: string; count: number }>()
      .value((d) => d.count)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; count: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Generate pie data
    const pieData = pie(magnitudeData);

    // Helper function to get magnitude value from category string
    const getMagnitudeFromCategory = (category: string): number => {
      if (category === '9+') return 9;
      return parseFloat(category);
    };

    // Draw pie slices
    svg
      .selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => getMagnitudeColorHex(getMagnitudeFromCategory(d.data.category)))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(_event, d) {
        dispatch(setMagnitudeHover(getMagnitudeFromCategory(d.data.category)));
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function(_event, d) {
        dispatch(clearMagnitudeHover());
        d3.select(this).attr("opacity", 1);
      });
  }, [magnitudeData, width]);

  if (magnitudeData.length === 0) {
    return (
      <Box p={4}>
        <Text color="gray.500">No data to display</Text>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100%">
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '100%',
        }}
      ></div>
    </Box>
  );
};

export default MagnitudePieChart