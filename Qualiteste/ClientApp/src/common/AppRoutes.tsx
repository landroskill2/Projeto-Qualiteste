import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import Consumers from "../pages/ConsumersList";
import Consumer from "../pages/Consumer";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/consumers",
    element: <Consumers />
  },
  {
    path: "/consumers/:id",
    element: <Consumer />
  }
]);
export default AppRoutes;
