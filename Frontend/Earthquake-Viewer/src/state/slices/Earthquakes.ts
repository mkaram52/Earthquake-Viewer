import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Earthquake } from "../../api/earthquakes.ts";
import type { RootState } from "../Store";

export interface EarthquakesState {
  // Stores all earthquakes fetched
  earthquakes: Earthquake[];

  // Stores subset of all earthquakes after filters applied
  filteredEarthquakes: Earthquake[];

  // Shows subset of filtered earthquakes in view on the map
  inViewEarthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;

  // Filters
  country: string | null;

  // Data States
  isFiltering: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: EarthquakesState = {
  earthquakes: [],
  filteredEarthquakes: [],
  inViewEarthquakes: [],
  selectedEarthquake: null,

  // Filters
  country: null,

  // Data States
  isFiltering: false,
  isLoading: false,
  error: null,
}

const earthquakesSlice = createSlice({
  name: "earthquakes",
  initialState,
  reducers: {
    setEarthquakes: (state, action: PayloadAction<Earthquake[]>) => {
      state.earthquakes = action.payload;
      let filtered = action.payload;
      if (state.country) {
        filtered = filtered.filter(eq => eq.country === state.country);
      }
      state.filteredEarthquakes = filtered;
    },
    setInViewEarthquakes: (state, action: PayloadAction<Earthquake[]>) => {
      state.inViewEarthquakes = action.payload;
    },
    clearInViewEarthquakes: (state) => {
      state.inViewEarthquakes = initialState.inViewEarthquakes;
    },
    setCountry: (state, action: PayloadAction<string | null>) => {
      state.isFiltering = true;

      if (action.payload) {
        state.country = action.payload;
      } else {
        state.country = initialState.country;
      }

      if (action.payload) {
        state.filteredEarthquakes = [...state.earthquakes].filter(
          eq => eq.country === action.payload
        );
      } else {
        state.filteredEarthquakes = state.earthquakes;
      }
      state.isFiltering = false;
    },
    clearCountry: (state) => {
      state.isFiltering = true;
      state.filteredEarthquakes = state.earthquakes;
      state.country = null;
      state.isFiltering = false;
    },
    selectEarthquake: (state, action: PayloadAction<Earthquake>) => {
      state.selectedEarthquake = action.payload;
    },
    clearSelectedEarthquake: (state) => {
      state.selectedEarthquake = initialState.selectedEarthquake;
    },
    startFiltering: (state) => {
      state.isFiltering = true;
    },
    stopFiltering: (state) => {
      state.isFiltering = false;
    }
  },
});

export const {
  setEarthquakes,
  setInViewEarthquakes,
  clearInViewEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  startFiltering,
  stopFiltering,
  setCountry,
  clearCountry,
} = earthquakesSlice.actions;

export const selectInViewEarthquakes = (state: RootState) => state.earthquakes.inViewEarthquakes;
export const selectSelectedEarthquake = (state: RootState) => state.earthquakes.selectedEarthquake;
export const selectEarthquakes = (state: RootState) => state.earthquakes.filteredEarthquakes;
export const selectIsFiltering = (state: RootState) => state.earthquakes.isFiltering;
export const selectCountryFilter = (state: RootState) => state.earthquakes.country;

export const selectCountryOptions = (state: RootState) => [...new Set(state.earthquakes.earthquakes.map(earthquake => earthquake.country))].filter(Boolean);

export default earthquakesSlice.reducer;