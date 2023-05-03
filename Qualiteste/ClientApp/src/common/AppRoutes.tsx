import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import Consumers from "../pages/ConsumersList";
import Consumer from "../pages/Consumer";
import Tests from "../pages/TestsList";
import Sessions from "../pages/SessionsList";

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
  },
  {
    path: "/tests",
    element: <Tests/>
  },
  {
    path: "sessions",
    element: <Sessions/>
  }
]);
export default AppRoutes;
