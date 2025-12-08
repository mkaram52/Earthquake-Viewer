import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
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
  hours: number | null;

  // Sort By
  sort: string | null;

  // Data States
  isFiltering: boolean;
  isLoading: boolean;
  error: string | null;

  // Hover States
  magnitudeHover: number | null;
}

const initialState: EarthquakesState = {
  earthquakes: [],
  filteredEarthquakes: [],
  inViewEarthquakes: [],
  selectedEarthquake: null,

  // Filters
  country: null,
  magnitude: null,
  hours: null,

  // Sort By
  sort: "time",

  // Data States
  isFiltering: false,
  isLoading: false,
  error: null,

  // Hover States
  magnitudeHover: null,
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

      let filteredEq = state.earthquakes;
      if (state.magnitude) {
        filteredEq = filteredEq.filter(
          eq => eq.magnitude >= (state.magnitude || 0)
        );
      }
      if (state.hours) {
        const now = new Date();
        const pastTime = new Date(now.getTime() - (state.hours * 60 * 60 * 1000));
        filteredEq = filteredEq.filter(
          eq => new Date(eq.time) >= pastTime
        )
      }

      if (action.payload) {
        filteredEq = filteredEq.filter(
          eq => eq.country === action.payload
        )
      }

      state.filteredEarthquakes = filteredEq;
    },
    clearCountry: (state) => {
      state.filteredEarthquakes = state.earthquakes;
      state.country = null;
    },
    setMagnitudeRange: (state, action: PayloadAction<number | null>) => {
      if (action.payload) {
        state.magnitude = action.payload;
      } else {
        state.magnitude = initialState.magnitude;
      }

      let filteredEq = state.earthquakes;
      if (state.country) {
        filteredEq = filteredEq.filter(
          eq => eq.country === state.country
        );
      }
      if (state.hours) {
        const now = new Date();
        const pastTime = new Date(now.getTime() - (state.hours * 60 * 60 * 1000));
        filteredEq = filteredEq.filter(
          eq => new Date(eq.time) >= pastTime
        )
      }

      if (action.payload) {
        filteredEq = filteredEq.filter(
          eq => eq.magnitude >= (action.payload || 0)
        );
      }

      state.filteredEarthquakes = filteredEq;
    },
    setHours: (state, action: PayloadAction<number | null>) => {
      if (action.payload) {
        state.hours = action.payload;
      } else {
        state.hours = initialState.hours;
      }

      let filteredEq = state.earthquakes;
      if (state.country) {
        filteredEq = filteredEq.filter(
          eq => eq.country === state.country
        );
      }
      if (state.magnitude) {
        filteredEq = filteredEq.filter(
          eq => eq.magnitude >= (state.magnitude || 0)
        );
      }

      if (action.payload) {
        const now = new Date();
        const pastTime = new Date(now.getTime() - (action.payload * 60 * 60 * 1000));
        filteredEq = filteredEq.filter(
          eq => new Date(eq.time) >= pastTime
        )
      }

      state.filteredEarthquakes = filteredEq;
    },
    sortByMagnitude: (state) => {
      state.sort = "magnitude";
      const sortedEarthquakes = state.earthquakes.sort((a, b) => b.magnitude - a.magnitude);
      const sortedFilteredEarthquakes = state.filteredEarthquakes.sort((a, b) => b.magnitude - a.magnitude);

      state.earthquakes = sortedEarthquakes;
      state.filteredEarthquakes = sortedFilteredEarthquakes;
    },
    sortByTime: (state) => {
      state.sort = "time";
      const sortedEarthquakes = state.earthquakes.sort((a, b) => new Date(a.time) > new Date(b.time) ? -1 : 1);
      const sortedFilteredEarthquakes = state.filteredEarthquakes.sort((a, b) => new Date(a.time) > new Date(b.time) ? -1 : 1);

      state.earthquakes = sortedEarthquakes;
      state.filteredEarthquakes = sortedFilteredEarthquakes;
    },
    sortByCountry: (state) => {
      state.sort = "country";
      const sortedEarthquakes = state.earthquakes.sort(
        (a, b) => {
          if (!a.country) return 1;
          else if (!b.country) return -1;
          else {
            return a.country.localeCompare(b.country);
          }
        }
      );
      const sortedFilteredEarthquakes = state.filteredEarthquakes.sort(
        (a, b) => {
          if (!a.country) return 1;
          else if (!b.country) return -1;
          else {
            return a.country.localeCompare(b.country);
          }
        }
      );

      state.earthquakes = sortedEarthquakes;
      state.filteredEarthquakes = sortedFilteredEarthquakes;
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
    },
    setMagnitudeHover: (state, action: PayloadAction<number | null>) => {
      state.magnitudeHover = action.payload;
    },
    clearMagnitudeHover: (state) => {
      state.magnitudeHover = initialState.magnitudeHover;
    },
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
  setMagnitudeRange,
  setHours,

  sortByMagnitude,
  sortByTime,
  sortByCountry,

  // Hover State
  setMagnitudeHover,
  clearMagnitudeHover
} = earthquakesSlice.actions;

export const selectInViewEarthquakes = (state: RootState) => state.earthquakes.inViewEarthquakes;
export const selectSelectedEarthquake = (state: RootState) => state.earthquakes.selectedEarthquake;
export const selectEarthquakes = (state: RootState) => state.earthquakes.filteredEarthquakes;
export const selectIsFiltering = (state: RootState) => state.earthquakes.isFiltering;
export const selectCountryFilter = (state: RootState) => state.earthquakes.country;
export const selectMagnitudeRangeFilter = (state: RootState) => state.earthquakes.magnitude;
export const selectHourFilter = (state: RootState) => state.earthquakes.hours;

export const selectSortOption = (state: RootState) => state.earthquakes.sort;

export const selectCountryOptions = (state: RootState) => [...new Set(state.earthquakes.earthquakes.map(earthquake => earthquake.country))].filter(Boolean);

export const selectMagnitudeHover = (state: RootState) => state.earthquakes.magnitudeHover;

export const selectSelectedFirstEarthquakes = createSelector(
  [selectInViewEarthquakes, selectSelectedEarthquake],
  (inViewEarthquakes, selectedEarthquake) => {
    if (!selectedEarthquake) {
      return inViewEarthquakes;
    }

    const earthquakes = [...inViewEarthquakes];
    earthquakes.sort((a, b) => {
      if (a.earthquake_id === selectedEarthquake.earthquake_id) return -1;
      if (b.earthquake_id === selectedEarthquake.earthquake_id) return 1;
      return 0;
    });
    return earthquakes;
  }
);

export default earthquakesSlice.reducer;