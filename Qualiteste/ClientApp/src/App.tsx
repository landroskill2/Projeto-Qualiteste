import {
  BrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import AppRoutes from "./common/AppRoutes"
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider>
          <AppRoutes />
      </ChakraProvider>
    </BrowserRouter>
  );
}
export default App;
