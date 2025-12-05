import { configureStore } from "@reduxjs/toolkit";
import earthquakesReducer from './slices/Earthquakes.ts'

const store = configureStore({
  reducer: {
    earthquakes: earthquakesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;