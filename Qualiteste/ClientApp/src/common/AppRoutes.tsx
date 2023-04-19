import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import Consumers from "../pages/ConsumersList";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/consumers",
    element: <Consumers />
  }
]);
export default AppRoutes;
