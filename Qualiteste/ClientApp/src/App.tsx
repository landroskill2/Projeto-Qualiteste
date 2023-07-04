import {
  BrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import AppRoutes from "./common/AppRoutes"
import { ChakraProvider } from "@chakra-ui/react";



function App() {
  return (
    <BrowserRouter>
      <ChakraProvider toastOptions={{ defaultOptions: {position: 'bottom'} }}>
          <AppRoutes />
      </ChakraProvider>
    </BrowserRouter>
  );
}
export default App;
