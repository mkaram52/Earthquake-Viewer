import React, { useCallback, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import StyledSelect from "./common/StyledSelect.tsx";
import {
  selectInViewEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectCountryOptions,
  selectCountryFilter,
  selectMagnitudeRangeFilter,
  selectHourFilter,
  selectSortOption,
  startFiltering,
  stopFiltering,
  sortByMagnitude,
  sortByTime,
  sortByCountry,
  setCountry,
  setMagnitudeRange,
  setHours,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";

const magnitudeOptions = [
  {value: 3, label: "3+"},
  {value: 4, label: "4+"},
  {value: 5, label: "5+"},
  {value: 6, label: "6+"},
] as const;

const timeOptions = [
  {value: 1, label: "last hour"},
  {value: 12, label: "last 12 hours"},
  {value: 24, label: "last day"},
  {value: 48, label: "last 2 days"},
  {value: 72, label: "last 3 days"},
] as const;

const sortOptions = [
  {value: "magnitude", label: "Magnitude"},
  {value: "time", label: "Time"},
  {value: "country", label: "Country"},
] as const;

const FilterList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const countryList = useSelector(selectCountryOptions);
  const selectedCountry = useSelector(selectCountryFilter);
  const selectedMagnitude = useSelector(selectMagnitudeRangeFilter);
  const selectedHour = useSelector(selectHourFilter);
  const selectedSort = useSelector(selectSortOption);

  const countryOptions = useMemo(() => {
    return countryList.map((country) => ({
      value: country,
      label: country,
    }));
  }, [countryList]);

  const handleSort = (type: string) => {
    if (type === "magnitude") {
      dispatch(sortByMagnitude());
    } else if (type === "time") {
      dispatch(sortByTime());
    } else if (type === "country") {
      dispatch(sortByCountry());
    }
  }

  const selectedMagOption = magnitudeOptions.find((option) => option.value === selectedMagnitude);
  const selectedTimeOption = timeOptions.find((option) => option.value === selectedHour);
  const selectedSortOption = sortOptions.find((option) => option.value === selectedSort);

  return (
    <VStack align="stretch" width="100%" spacing={2} paddingBottom={4}>
      <Box paddingBottom={4}>
        <VStack spacing={2}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.400">
              Filter Options
            </Text>
          </Box>
          <StyledSelect
            name="country"
            options={countryOptions}
            placeholder="Select Country"
            value={selectedCountry ? {value: selectedCountry, label: selectedCountry} : null}
            onChange={(value) => dispatch(setCountry(value?.value))}
          />
          <StyledSelect
            name="magnitude"
            options={magnitudeOptions}
            placeholder="Select Magnitude Range"
            value={selectedMagnitude ? selectedMagOption : null}
            onChange={(value) => dispatch(setMagnitudeRange(value?.value))}
          />
          <StyledSelect
            name="hours"
            options={timeOptions}
            placeholder="Select Time Range"
            value={selectedHour ? selectedTimeOption : null}
            onChange={(value) => dispatch(setHours(value?.value))}
          />
        </VStack>
      </Box>
      <Box>
        <VStack spacing={2}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.400">
              Sort Options
            </Text>
          </Box>
          <StyledSelect
            name="sort"
            options={sortOptions}
            placeholder="Sort By"
            value={selectedSort ? selectedSortOption : null}
            onChange={(value) => handleSort((value?.value))}
          />
        </VStack>

      </Box>
    </VStack>
  )
};

export default React.memo(FilterList);