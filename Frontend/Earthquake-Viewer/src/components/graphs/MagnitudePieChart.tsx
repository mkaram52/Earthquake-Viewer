import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";
import {
  setMagnitudeHover,
  clearMagnitudeHover,
} from "../../state/slices/Earthquakes.ts";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { getMagnitudeColorHex } from "../../utils/magnitudeColors.ts";
import { type Earthquake } from "../../api/earthquakes.ts";
import type { AppDispatch } from "../../state/Store.ts";

interface MagnitudePieChartProps {
  width: number;
  earthquakes: Earthquake[];
}

const MagnitudePieChart: React.FC<MagnitudePieChartProps> = ({ width, earthquakes }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chartRef = useRef<HTMLDivElement>(null);

  // Categorize earthquakes by magnitude range in to category object: Ex. { category: "3-4", count: 5 }
  const magnitudeData = useMemo(() => {
    if (!earthquakes || earthquakes.length === 0) {
      return [];
    }

    const categories: { [key: string]: number } = {};

    earthquakes.forEach((eq: Earthquake) => {
      const magFloor = Math.floor(eq.magnitude);
      // Group ones 6+ into a single category, because there will be few
      const category = magFloor >= 6 ? '6+' : `${magFloor}-${magFloor + 1}`;
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => {
        if (a.category === '6+') return 1;
        if (b.category === '6+') return -1;
        return parseFloat(a.category) - parseFloat(b.category);
      });
  }, [earthquakes]);

  useEffect(() => {
    if (!chartRef.current || magnitudeData.length === 0 || width === 0) {
      return;
    }

    // Clear previous chart for reloading
    d3.select(chartRef.current).selectAll("*").remove();

    // Set inner donut hole at 1/3 of radius
    const radius = width / 2 - 40;
    const innerRadius = radius / 3;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", width)
      .append("g") // Creates a group to translate the whole graph
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const pie = d3 // Computes the pie layout
      .pie<{ category: string; count: number }>()
      .value((d) => d.count) // Sets count as the property that determines slice size
      .sort(null); // Sorting is done in object creation

    const arc = d3 // Draws the d3.pie() data
      .arc<d3.PieArcDatum<{ category: string; count: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .padAngle(0.02)
    const pieData = pie(magnitudeData);


    const getMagnitudeFromCategory = (category: string): number => {
      if (category === '6+') return 6;
      return parseFloat(category);
    };

    svg
      .selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => getMagnitudeColorHex(getMagnitudeFromCategory(d.data.category)))
      .style("cursor", "pointer")
      .on("mouseover", function(_event, d) {
        dispatch(setMagnitudeHover({ magnitude: getMagnitudeFromCategory(d.data.category), count: d.data.count }));
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function(_event) {
        dispatch(clearMagnitudeHover());
        d3.select(this).attr("opacity", 1);
      });
  }, [magnitudeData, width]);

  if (magnitudeData.length === 0) {
    return (
      <Box p={4}>
        <Text
          color="gray.600"
          textAlign="center"
        >
          No data to display
        </Text>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100%">
      <VStack>
        <Card.Root bg="gray.600" w="80%" mt={5}>
          <Card.Body p={2}>
            <Text
              fontSize="16px"
              fontWeight="bold"
              color={"white"}
              textAlign="center"
            >
              Magnitude
            </Text>
          </Card.Body>
        </Card.Root>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        ></div>
      </VStack>
    </Box>
  );
};

export default MagnitudePieChart