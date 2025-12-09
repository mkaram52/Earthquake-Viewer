import axios from 'axios'

export interface Earthquake {
  earthquake_id: string | number;
  place: string;
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  country?: string;
}

interface EarthquakeResponse {
  success: boolean;
  earthquakes: Earthquake[];
  error?: any;
}

export const fetchEarthquakes = async (): Promise<EarthquakeResponse> => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8000/api/v1",
    timeout: 30000,
    withCredentials: true,
  });
  try {
    const response = await client.get('/earthquakes/earthquakes/');
    return {
      success: true,
      earthquakes: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching earthquakes: ", error);
    return {
      success: false,
      earthquakes: [],
      error: error,
    }
  }
}