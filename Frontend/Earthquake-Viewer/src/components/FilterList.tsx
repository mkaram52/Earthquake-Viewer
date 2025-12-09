import React, { useCallback, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import StyledSelect from "./common/StyledSelect.tsx";
import {
  selectCountryOptions,
  selectCountryFilter,
  selectMagnitudeRangeFilter,
  selectHourFilter,
  selectSortOption,
  selectGlobal,
  sortByMagnitude,
  sortByTime,
  sortByCountry,
  setCountry,
  setMagnitudeRange,
  setHours,
  toggleGlobal,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";

const magnitudeOptions: Array<{value: number; label: string}> = [
  {value: 3, label: "3+"},
  {value: 4, label: "4+"},
  {value: 5, label: "5+"},
  {value: 6, label: "6+"},
];

const timeOptions: Array<{value: number; label: string}> = [
  {value: 1, label: "last hour"},
  {value: 12, label: "last 12 hours"},
  {value: 24, label: "last day"},
  {value: 48, label: "last 2 days"},
  {value: 72, label: "last 3 days"},
];

const sortOptions: Array<{value: string; label: string}> = [
  {value: "magnitude", label: "Magnitude"},
  {value: "time", label: "Time"},
  {value: "country", label: "Country"},
];

const FilterList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const countryList = useSelector(selectCountryOptions);
  const selectedCountry = useSelector(selectCountryFilter);
  const selectedMagnitude = useSelector(selectMagnitudeRangeFilter);
  const selectedHour = useSelector(selectHourFilter);
  const selectedSort = useSelector(selectSortOption);
  const global = useSelector(selectGlobal);

  const countryOptions = useMemo(() => {
    return countryList
      .filter((country): country is string => country != null)
      .map((country) => ({
        value: country,
        label: country,
      }));
  }, [countryList]);

  const handleSort = useCallback((type: string) => {
    if (type === "magnitude") {
      dispatch(sortByMagnitude());
    } else if (type === "time") {
      dispatch(sortByTime());
    } else if (type === "country") {
      dispatch(sortByCountry());
    }
  }, [dispatch]);

  const selectedMagOption = magnitudeOptions.find((option) => option.value === selectedMagnitude);
  const selectedTimeOption = timeOptions.find((option) => option.value === selectedHour);
  const selectedSortOption = sortOptions.find((option) => option.value === selectedSort);

  return (
    <VStack align="stretch" width="100%" gap={2} paddingBottom={4}>
      <Box paddingBottom={4}>
        <VStack gap={2}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.400">
              Filter Options
            </Text>
          </Box>
          <StyledSelect
            name="country"
            options={countryOptions}
            placeholder="Select Country"
            value={selectedCountry ? {value: selectedCountry, label: selectedCountry} : undefined}
            onChange={(value) => dispatch(setCountry(value?.value))}
          />
          <StyledSelect
            name="magnitude"
            options={magnitudeOptions}
            placeholder="Select Magnitude Range"
            value={selectedMagnitude ? selectedMagOption : undefined}
            onChange={(value) => dispatch(setMagnitudeRange(value?.value))}
          />
          <StyledSelect
            name="hours"
            options={timeOptions}
            placeholder="Select Time Range"
            value={selectedHour ? selectedTimeOption : undefined}
            onChange={(value) => dispatch(setHours(value?.value))}
          />
          <Checkbox.Root
            checked={global}
            onCheckedChange={() => dispatch(toggleGlobal())}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Expand graphs to include world-wide data</Checkbox.Label>
          </Checkbox.Root>
        </VStack>
      </Box>
      <Box>
        <VStack gap={2}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.400">
              Sort Options
            </Text>
          </Box>
          <StyledSelect
            name="sort"
            options={sortOptions}
            placeholder="Sort By"
            value={selectedSort ? selectedSortOption : undefined}
            onChange={(value) => handleSort((value?.value))}
          />
        </VStack>
      </Box>
    </VStack>
  )
};

export default React.memo(FilterList);