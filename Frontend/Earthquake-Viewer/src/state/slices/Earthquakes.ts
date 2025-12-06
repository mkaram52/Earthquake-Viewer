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
  magnitude: number | null;

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
  magnitude: null,

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

      if (state.magnitude) {
        filtered = filtered.filter(eq => eq.magnitude >= state.magnitude);
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
      if (action.payload) {
        state.country = action.payload;
      } else {
        state.country = initialState.country;
      }

      if (action.payload) {
        state.filteredEarthquakes = [...state.filteredEarthquakes].filter(
          eq => eq.country === action.payload
        );
      } else {
        if (state.magnitude) {
          state.filteredEarthquakes = [...state.earthquakes].filter(
            eq => eq.magnitude >= (state.magnitude || 0)
          );
        } else {
          state.filteredEarthquakes = state.earthquakes;
        }
      }
    },
    clearCountry: (state) => {
      state.filteredEarthquakes = state.earthquakes;
      state.country = null;
    },
    setMagnitude: (state, action: PayloadAction<number | null>) => {
      if (action.payload) {
        state.magnitude = action.payload;
      } else {
        state.magnitude = initialState.magnitude;
      }

      if (action.payload) {
        state.filteredEarthquakes = [...state.filteredEarthquakes].filter(
          eq => eq.magnitude >= (action.payload || 0)
        );
      } else {
        if (state.country) {
          state.filteredEarthquakes = [...state.earthquakes].filter(
            eq => eq.country === state.country
          );
        }
        state.filteredEarthquakes = state.earthquakes;
      }
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
  setMagnitude,
} = earthquakesSlice.actions;

export const selectInViewEarthquakes = (state: RootState) => state.earthquakes.inViewEarthquakes;
export const selectSelectedEarthquake = (state: RootState) => state.earthquakes.selectedEarthquake;
export const selectEarthquakes = (state: RootState) => state.earthquakes.filteredEarthquakes;
export const selectIsFiltering = (state: RootState) => state.earthquakes.isFiltering;
export const selectCountryFilter = (state: RootState) => state.earthquakes.country;
export const selectMagnitudeFilter = (state: RootState) => state.earthquakes.magnitude;

export const selectCountryOptions = (state: RootState) => [...new Set(state.earthquakes.earthquakes.map(earthquake => earthquake.country))].filter(Boolean);

export default earthquakesSlice.reducer;