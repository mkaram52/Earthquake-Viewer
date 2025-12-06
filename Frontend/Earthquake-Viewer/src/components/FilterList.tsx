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
import {
  selectInViewEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  selectSelectedEarthquake,
  selectIsFiltering,
  selectCountryOptions,
  selectCountryFilter,
  setCountry,
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

  const countryOptions = countryList.map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <VStack align="stretch" width="100%">
      <>
        <Select
          name="country"
          options={countryOptions}
          placeholder="Select Country"
          isClearable={true}
          useBasicStyles
          value={selectedCountry ? {value: selectedCountry, label: selectedCountry} : null}
          onChange={(value) => dispatch(setCountry(value?.value))}
          chakraStyles={{
            control: (provided) => ({
              ...provided,
              cursor: "pointer",
              fontSize: "sm",
              fontWeight: "500",
            }),
            option: (provided, state) => ({
              ...provided,
              fontSize: "sm",
              fontWeight: "500",
              backgroundColor: state.isSelected 
                ? "gray.700" 
                : state.isFocused 
                  ? "gray.600" 
                  : "gray.800",
              color: "white",
              _hover: {
                backgroundColor: "gray.600",
              },
            }),
            menu: (provided) => ({
              ...provided,
              fontSize: "sm",
              fontWeight: "500",
              backgroundColor: "gray.800",
            }),
            menuList: (provided) => ({
              ...provided,
              backgroundColor: "gray.800",
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: "sm",
              fontWeight: "500",
              color: "white",
            }),
            placeholder: (provided) => ({
              ...provided,
              fontSize: "sm",
              fontWeight: "500",
              color: "gray.400",
            }),
          }}
        />
      </>
    </VStack>
  )
};

export default FilterList;