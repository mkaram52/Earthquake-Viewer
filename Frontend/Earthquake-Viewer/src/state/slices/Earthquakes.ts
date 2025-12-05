import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Earthquake } from "../../api/earthquakes.ts";
import type { RootState } from "../Store";
import { fetchEarthquakes } from "../../api/earthquakes.ts";

export interface EarthquakesState {
  earthquakes: Earthquake[];
  filteredEarthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  country: string | null;

  isFiltering: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: EarthquakesState = {
  earthquakes: [],
  filteredEarthquakes: [],
  selectedEarthquake: null,
  country: null,

  isFiltering: false,
  isLoading: false,
  error: null,
}

export const fetchEarthquakesAsync = createAsyncThunk(
  "earthquakes/fetchEarthquakes",
  async () => {
    const response = await fetchEarthquakes();
    if (response.success && response.earthquakes) {
      return response.earthquakes;
    }
    throw new Error(response.error || "Failed to fetch bookmarked auctions");
  }
);

const earthquakesSlice = createSlice({
  name: "earthquakes",
  initialState,
  reducers: {
    setEarthquakes: (state, action: PayloadAction<Earthquake[]>) => {
      state.earthquakes = action.payload;
    },
    setFilteredEarthquakes: (state, action: PayloadAction<Earthquake[]>) => {
      state.filteredEarthquakes = action.payload;
    },
    clearFilteredEarthquakes: (state) => {
      state.filteredEarthquakes = initialState.filteredEarthquakes;
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
  extraReducers: (builder) => {
    // Handle fetching earthquakes
    builder
      .addCase(fetchEarthquakesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.earthquakes = action.payload;
        state.error = null;
      })
      .addCase(fetchEarthquakesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch bookmarked jobs";
      });
  },
});

export const {
  setEarthquakes,
  setFilteredEarthquakes,
  clearFilteredEarthquakes,
  selectEarthquake,
  clearSelectedEarthquake,
  startFiltering,
  stopFiltering,
} = earthquakesSlice.actions;

// Selectors
export const selectFilteredEarthquakes = (state: RootState) => state.earthquakes.filteredEarthquakes;
export const selectSelectedEarthquake = (state: RootState) => state.earthquakes.selectedEarthquake;
export const selectEarthquakes = (state: RootState) => state.earthquakes.earthquakes;
export const selectIsFiltering = (state: RootState) => state.earthquakes.isFiltering;

export default earthquakesSlice.reducer;