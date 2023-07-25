import {
  BrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import AppRoutes from "./common/AppRoutes"
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Mukta', sans-serif`,
  },
  fontSizes: {
    xs: "1rem"
  }
})

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme} toastOptions={{ defaultOptions: {position: 'bottom'} }}>
          <AppRoutes />
      </ChakraProvider>
    </BrowserRouter>
  );
}
export default App;
