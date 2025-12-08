import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
} from "@chakra-ui/react";
import {
  selectInViewEarthquakes,
} from "../../state/slices/Earthquakes.ts";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { getMagnitudeColorHex } from "../../utils/magnitudeColors.ts";

interface MagnitudeBarChartProps {
  width: number;
  height: number;
}

const MagnitudeBarChart: React.FC<MagnitudeBarChartProps> = ({ width, height }) => {
  const ref = useRef<HTMLDivElement>(null);
  const filteredEarthquakes = useSelector(selectInViewEarthquakes);

  // Group earthquakes by magnitude category and count them
  const magnitudeData = useMemo(() => {
    if (!filteredEarthquakes || filteredEarthquakes.length === 0) {
      return [];
    }

    // Create magnitude categories (0-1, 1-2, 2-3, 3-4, 4-5, 5-6, 6-7, 7-8, 8-9, 9+)
    const categories: { [key: string]: number } = {};

    filteredEarthquakes.forEach((eq) => {
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
    if (!ref.current || magnitudeData.length === 0) {
      return;
    }

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 30 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    // Append the svg object to the container
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis - magnitude categories
    const x = d3
      .scaleBand()
      .range([0, graphWidth])
      .domain(magnitudeData.map((d) => d.category))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis - count of earthquakes
    const maxCount = d3.max(magnitudeData, (d: { category: string; count: number }) => d.count) || 0;
    const y = d3
      .scaleLinear()
      .domain([0, maxCount * 1.1]) // Add 10% padding at top
      .range([graphHeight, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(magnitudeData)
      .join("rect")
      .attr("x", (d: { category: string; count: number }) => x(d.category) || 0)
      .attr("y", (d: { category: string; count: number }) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d: { category: string; count: number }) => graphHeight - y(d.count))
      .attr("fill", (d: { category: string; count: number }) => getMagnitudeColorHex(Number(d.category[0])));
  }, [magnitudeData, width, height]);

  if (magnitudeData.length === 0) {
    return (
      <Box p={4}>
        <Text color="gray.500">No data to display</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <div ref={ref}></div>
    </Box>
  );
};

export default MagnitudeBarChart