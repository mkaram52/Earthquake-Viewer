import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Home from './components/Home.tsx'
import { Provider } from 'react-redux';
import store from './state/Store.ts'

function App() {

  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <Home />
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
