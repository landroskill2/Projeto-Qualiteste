import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import Consumers from "../pages/consumers/ConsumersList";
import Consumer from "../pages/consumers/Consumer";
import Tests from "../pages/TestsList";
import Sessions from "../pages/sessions/SessionsList";
import Session from "../pages/sessions/Session";
import Test from "../pages/tests/Test";

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
    path: "/tests/:id",
    element: <Test/>
  },
  {
    path: "/sessions",
    element: <Sessions/>
  },
  {
    path: "/sessions/:id",
    element: <Session/>
  }
]);
export default AppRoutes;
