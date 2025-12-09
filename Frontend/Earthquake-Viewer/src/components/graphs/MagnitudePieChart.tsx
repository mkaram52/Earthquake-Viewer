import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";
import {
  selectInViewEarthquakes,
  selectMagnitudeHover,
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
  const magnitudeHover = useSelector(selectMagnitudeHover);

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

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => {
        if (a.category === '9+') return 1;
        if (b.category === '9+') return -1;
        return parseFloat(a.category) - parseFloat(b.category);
      });
  }, [filteredEarthquakes]);

  const hoverText = useMemo(() => {
    if (!magnitudeHover || !magnitudeData) return null;
    const category = magnitudeData.find((d) => d.category[0] === magnitudeHover.toString());

    return `Magnitude ${category?.category}: ${category?.count} earthquakes`;
  }, [magnitudeHover, magnitudeData]);

  useEffect(() => {
    if (!chartRef.current || magnitudeData.length === 0 || width === 0) {
      return;
    }

    d3.select(chartRef.current).selectAll("*").remove();

    const radius = width / 2 - 40;
    const innerRadius = radius / 3;
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", width)
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const pie = d3
      .pie<{ category: string; count: number }>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; count: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .padAngle(0.02)
    const pieData = pie(magnitudeData);

    const getMagnitudeFromCategory = (category: string): number => {
      if (category === '9+') return 9;
      return parseFloat(category);
    };

    svg
      .selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => getMagnitudeColorHex(getMagnitudeFromCategory(d.data.category)))
     // .attr("stroke", "white")
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
        <Text color="gray.600">No data to display</Text>
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
        {magnitudeHover && (
          <Card.Root bg="gray.600">
            <Card.Body p={4}>
              <Text
                fontSize="16px"
                fontWeight="bold"
                color={getMagnitudeColorHex(magnitudeHover)}
              >
                {hoverText}
              </Text>
            </Card.Body>
          </Card.Root>
        )}
      </VStack>
    </Box>
  );
};

export default MagnitudePieChart