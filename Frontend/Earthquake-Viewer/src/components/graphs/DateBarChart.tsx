import React, { useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Text,
  Card,
  VStack,
} from "@chakra-ui/react";
import {
  setDateHover,
  clearDateHover,
} from "../../state/slices/Earthquakes.ts";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { getMagnitudeColorHex } from "../../utils/magnitudeColors.ts";
import type { AppDispatch } from "../../state/Store.ts";
import type { Earthquake } from "../../api/earthquakes.ts";

interface DateBarChartProps {
  width: number;
  height: number;
  earthquakes: Earthquake[];
}

const DateBarChart: React.FC<DateBarChartProps> = ({
  width,
  height,
  earthquakes,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);

  const magnitudeData = useMemo(() => {
    if (!earthquakes || earthquakes.length === 0) {
      return [];
    }

    const categories: { [key: string]: { count: number, magCategories: { [key: string]: number }}} = {};

    earthquakes.forEach((eq) => {
      const magFloor = Math.floor(eq.magnitude);
      const category = eq.time.split('T')[0];
      const subCategory = magFloor >= 9 ? '9+' : `${magFloor}-${magFloor + 1}`;

      if (!categories[category]) {
        categories[category] = { count: 0, magCategories: {} };
      }
      
      categories[category]["count"] = (categories[category]["count"] || 0) + 1;
      categories[category]["magCategories"][subCategory] = (categories[category]["magCategories"][subCategory] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([category, value]) => {
        const subCategories = Object.entries(value.magCategories)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => {
            // Sort by magnitude value (handle 9+ specially)
            if (a.category === '9+') return 1;
            if (b.category === '9+') return -1;
            return parseFloat(a.category) - parseFloat(b.category);
          });
        return ({ category, count: value.count, subCategories });
      })
      .sort((a, b) => {
        return new Date(a.category) > new Date(b.category) ? 1 : -1;
      });
  }, [earthquakes]);

  useEffect(() => {
    if (!ref.current || magnitudeData.length === 0) {
      return;
    }

    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 70, left: 30 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const allMagCategories = new Set<string>();
    magnitudeData.forEach((d) => {
      d.subCategories.forEach((sub) => {
        allMagCategories.add(sub.category);
      });
    });

    const sortedMagCategories = Array.from(allMagCategories).sort((a, b) => {
      if (a === '9+') return 1;
      if (b === '9+') return -1;
      return parseFloat(a) - parseFloat(b);
    });

    interface StackedDataPoint {
      date: string;
      [key: string]: string | number;
    }
    
    const stackedData: StackedDataPoint[] = magnitudeData.map((d) => {
      const dateData: StackedDataPoint = { date: d.category };
      sortedMagCategories.forEach((magCat) => {
        const subCat = d.subCategories.find((sc) => sc.category === magCat);
        dateData[magCat] = subCat ? subCat.count : 0;
      });
      return dateData;
    });

    const stack = d3
      .stack<StackedDataPoint, string>()
      .keys(sortedMagCategories)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedSeries = stack(stackedData);

    const x = d3
      .scaleBand()
      .range([0, graphWidth])
      .domain(magnitudeData.map((d) => d.category))
      .padding(0.2);

    const dateFormatter = d3.timeFormat("%b %-d");
    
    svg
      .append("g")
      .attr("transform", `translate(0, ${graphHeight})`)
      .style("color", "white")
      .call(
        d3.axisBottom(x).tickFormat((d) => {
          const date = new Date(d as string);
          return dateFormatter(date);
        })
      )
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("color", "#757575")
      .style("text-anchor", "end");

    const maxCount = d3.max(magnitudeData, (d) => d.count) || 0;
    const y = d3
      .scaleLinear()
      .domain([0, maxCount * 1.1]) // Add 10% padding at top
      .range([graphHeight, 0]);

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .style("color", "white")
      .selectAll(".tick").remove()
      .selectAll("text")
      .style("color", "#757575");

    const getMagnitudeFromCategory = (category: string): number => {
      if (category === '9+') return 9;
      return parseFloat(category);
    };

    stackedSeries.forEach((series) => {
      const className = `mag_${series.key.replace(/[^a-zA-Z0-9]/g, '_')}`;
      svg
        .selectAll(`rect.${className}`)
        .data(series)
        .join("rect")
        .attr("class", className)
        .attr("x", (d) => {
          const datum = d as d3.SeriesPoint<StackedDataPoint>;
          return x(datum.data.date) || 0;
        })
        .attr("y", (d) => {
          const datum = d as d3.SeriesPoint<StackedDataPoint>;
          return y(datum[1]);
        })
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
          const datum = d as d3.SeriesPoint<StackedDataPoint>;
          return y(datum[0]) - y(datum[1]);
        })
        .attr("fill", () => getMagnitudeColorHex(getMagnitudeFromCategory(series.key)));
    });

    // Create invisible overlay rectangles for each column to handle hover events
    svg
      .selectAll("rect.column-overlay")
      .data(stackedData)
      .join("rect")
      .attr("class", "column-overlay")
      .attr("x", (d) => x(d.date) || 0)
      .attr("y", 0)
      .attr("width", x.bandwidth())
      .attr("height", graphHeight)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseover", function (_event, d) {
        const total = Object.values(d).reduce((acc: number, rect) => {
          if (typeof rect === "number") {
            acc += rect;
          }
          return acc;
        }, 0)
        dispatch(setDateHover({ date: d.date, count: total }));
        // Highlight all rectangles in this column (excluding overlay rectangles)
        svg.selectAll("rect:not(.column-overlay)").filter(function() {
          const rectX = d3.select(this).attr("x");
          const overlayX = x(d.date) || 0;
          return parseFloat(rectX) === overlayX;
        }).attr("opacity", 0.8);
      })
      .on("mouseout", function (_event, d) {
        dispatch(clearDateHover());
        // Reset opacity for all rectangles in this column (excluding overlay rectangles)
        svg.selectAll("rect:not(.column-overlay)").filter(function() {
          const rectX = d3.select(this).attr("x");
          const overlayX = x(d.date) || 0;
          return parseFloat(rectX) === overlayX;
        }).attr("opacity", 1);
      });
  }, [magnitudeData, width, height]);

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
              Date
            </Text>
          </Card.Body>
        </Card.Root>
        <div ref={ref}></div>
      </VStack>

    </Box>
  );
};

export default DateBarChart