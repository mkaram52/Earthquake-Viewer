import { configureStore } from "@reduxjs/toolkit";
import earthquakesReducer from './slices/Earthquakes.ts'
import tableReducer from './slices/Table.ts'

const store = configureStore({
  reducer: {
    earthquakes: earthquakesReducer,
    table: tableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;