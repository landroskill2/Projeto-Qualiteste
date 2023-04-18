import {
  RouterProvider,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import AppRoutes from "./common/AppRoutes"
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
      <ChakraProvider>
          <Layout>
            <RouterProvider router={AppRoutes} />
          </Layout>
      </ChakraProvider>
  );
}
export default App;
