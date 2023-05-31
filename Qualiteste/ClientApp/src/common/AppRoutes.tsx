import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import Consumers from "../pages/consumers/ConsumersList";
import Consumer from "../pages/consumers/Consumer";
import Tests from "../pages/tests/TestsList";
import Sessions from "../pages/sessions/SessionsList";
import Session from "../pages/sessions/Session";
import Test from "../pages/tests/Test";
import FizzResults from "../pages/tests/FizzTable";
import TestCreation from "../pages/tests/TestCreation";
import ConsumerCreation from "../pages/consumers/ConsumerCreation";
import SessionCreation from "../pages/sessions/SessionCreation";

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
    path: "/consumers/create",
    element: <ConsumerCreation />
  },
  {
    path: "/consumers/:id",
    element: <Consumer />
  },
  {
    path: "/tests",
    element: <Tests />
  },
  {
    path: "/tests/create",
    element: <TestCreation />
  },
  {
    path: "/tests/:id",
    element: <Test />
  },
  {
    path: "/tests/:id/fizz",
    element: <FizzResults />
  },
  {
    path: "/sessions",
    element: <Sessions />
  },
  {
    path: "/sessions/create",
    element: <SessionCreation />
  },
  {
    path: "/sessions/:id",
    element: <Session />
  }
]);
export default AppRoutes;
