import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";
import {
  setCountryHover,
  clearCountryHover,
} from "../../state/slices/Earthquakes.ts";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { type Earthquake } from "../../api/earthquakes.ts";
import type { AppDispatch } from "../../state/Store.ts";

interface CountryPieChartProps {
  width: number;
  earthquakes: Earthquake[];
}

const CountryPieChart: React.FC<CountryPieChartProps> = ({ width, earthquakes }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chartRef = useRef<HTMLDivElement>(null);

  // Categorize earthquakes by country in to category object: Ex. { category: "United States", count: 5 }
  const countryData = useMemo(() => {
    if (!earthquakes || earthquakes.length === 0) {
      return [];
    }

    const categories: { [key: string]: number } = {};

    earthquakes.forEach((eq: Earthquake) => {
      const category = eq.country ? eq.country : "International";
      categories[category] = (categories[category] || 0) + 1;
    })

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [earthquakes]);

  useEffect(() => {
    if (!chartRef.current || countryData.length === 0 || width === 0) {
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

    const pie = d3
      .pie<{ category: string; count: number }>()
      .value((d) => d.count) // Sets count as the property that determines slice size
      .sort(null); // Sorting is done in object creation

    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; count: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .padAngle(0.02)
    const pieData = pie(countryData);

    const startColor = "#ADD8E6";
    const endColor = "#00008B";

    // Create a map from category to index for efficient lookup
    const categoryToIndex = new Map<string, number>();
    countryData.forEach((item, index) => {
      if (index >= 5) categoryToIndex.set(item.category, 5);
      else categoryToIndex.set(item.category, index);
    });

    // Create a linear color scale based on index
    // Divide the color range into (countryData.length - 1 || 5) evenly distribute colors
    // Maxing out at 5 to account for many smaller countries
    const colorScale = d3.scaleLinear<string>()
      .domain([0, Math.min(countryData.length - 1, 5)])
      .range([endColor, startColor]);

    svg
      .selectAll("path")
      .data(pieData) // Binds the pie data
      .join("path")
      .attr("d", arc) // Draws the arcs using the arc generator
      .attr("fill", (d) => {
        const index = categoryToIndex.get(d.data.category) ?? 0;
        return colorScale(index);
      })
      .style("cursor", "pointer")
      .on("mouseover", function(_event, d) {
        dispatch(setCountryHover({ country: d.data.category, count: d.data.count }));
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function(_event) {
        dispatch(clearCountryHover());
        d3.select(this).attr("opacity", 1);
      });
  }, [countryData, width])

  if (countryData.length === 0) {
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
              Country
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

export default CountryPieChart;