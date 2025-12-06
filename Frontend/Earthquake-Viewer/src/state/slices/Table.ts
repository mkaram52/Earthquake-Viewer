import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from "../Store";

export interface TableState {
  listOpen: boolean;
  graphOpen: boolean;
  filterOpen: boolean;
}

const initialState: TableState = {
  listOpen: true,
  graphOpen: false,
  filterOpen: false,
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    openList: (state) => {
      state.graphOpen = false;
      state.filterOpen = false;
      state.listOpen = true;
    },
    closeList: (state) => {
      state.listOpen = false;
    },
    openGraph: (state) => {
      state.filterOpen = false;
      state.listOpen = false;
      state.graphOpen = true;
    },
    closeGraph: (state) => {
      state.graphOpen = false;
    },
    openFilter: (state) => {
      state.graphOpen = false;
      state.listOpen = false;
      state.filterOpen = true;
    },
    closeFilter: (state) => {
      state.filterOpen = false;
    },
    closeAll: (state) => {
      state.graphOpen = false;
      state.listOpen = false;
      state.filterOpen = false;
    }
  },
});

export const {
  openList,
  closeList,
  openGraph,
  closeGraph,
  openFilter,
  closeFilter,
  closeAll,
} = tableSlice.actions;

export const selectListOpen = (state: RootState) => state.table.listOpen;
export const selectGraphOpen = (state: RootState) => state.table.graphOpen;
export const selectFilterOpen = (state: RootState) => state.table.filterOpen;
export const selectIsOpen = (state: RootState) => (
  state.table.listOpen || state.table.graphOpen || state.table.filterOpen
);

export default tableSlice.reducer;