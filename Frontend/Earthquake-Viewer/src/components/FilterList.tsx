import React, { useCallback, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Center,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import StyledSelect from "./common/StyledSelect.tsx";
import {
  selectInViewEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectCountryOptions,
  selectCountryFilter,
  selectMagnitudeFilter,
  setCountry,
  setMagnitude,
} from "../state/slices/Earthquakes.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/Store.ts";
import moment from 'moment';
import { type Earthquake } from "../api/earthquakes.ts";
import { getMagnitudeColorToken } from "../utils/magnitudeColors.ts";

const FilterList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const countryList = useSelector(selectCountryOptions);
  const selectedCountry = useSelector(selectCountryFilter);
  const selectedMagnitude = useSelector(selectMagnitudeFilter);

  const countryOptions = countryList.map((country) => ({
    value: country,
    label: country,
  }));

  const magnitudeOptions = [
    {value: 3, label: "3+"},
    {value: 4, label: "4+"},
    {value: 5, label: "5+"},
    {value: 6, label: "6+"},
  ]

  const selectedOption = magnitudeOptions.find((option) => option.value === selectedMagnitude);

  return (
    <VStack align="stretch" width="100%" spacing={2}>
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
        value={selectedMagnitude ? selectedOption : null}
        onChange={(value) => dispatch(setMagnitude(value?.value))}
      />
    </VStack>
  )
};

export default FilterList;