import { Routes, Route, createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
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
import Login from "../pages/authentication/Login";
import Layout from "../components/Layout";
import { RequireAuth } from "../auth/RequireAuth";
import { RequireRole } from "../auth/RequireRole";
import Admin from "../pages/admin/Admin";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Unauthenticated Routes */}
      <Route element= {<Layout />}>
        <Route path="login" element={<Login />}/>
        <Route path="/" element={<Home/>}/>
        {/* Authenticated Routes */}
        <Route element={<RequireAuth/>}>
          <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
            <Route path="admin" element={<Admin/>}/>
          </Route>
          <Route path="consumers" element ={<Consumers />} />
          <Route path="consumers/create" element={<ConsumerCreation />} />
          <Route path="consumers/:id" element={<Consumer />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/create" element={<SessionCreation />} />
          <Route path="sessions/:id" element={<Session />} />
          <Route path="tests" element={<Tests />} />
          <Route path="tests/create" element={<TestCreation />} />
          <Route path="tests/:id" element={<Test />} />
          <Route path="tests/:id/fizz" element={<FizzResults />} />
        </Route>
      </Route>
    </Routes>
  )
}

// const AppRoutes = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />
//   },
//   {
//     path: "/consumers",
//     element: <Consumers />
//   },
//   {
//     path: "/consumers/create",
//     element: <ConsumerCreation />
//   },
//   {
//     path: "/consumers/:id",
//     element: <Consumer />
//   },
//   {
//     path: "/tests",
//     element: <Tests />
//   },
//   {
//     path: "/tests/create",
//     element: <TestCreation />
//   },
//   {
//     path: "/tests/:id",
//     element: <Test />
//   },
//   {
//     path: "/tests/:id/fizz",
//     element: <FizzResults />
//   },
//   {
//     path: "/sessions",
//     element: <Sessions />
//   },
//   {
//     path: "/sessions/create",
//     element: <SessionCreation />
//   },
//   {
//     path: "/sessions/:id",
//     element: <Session />
//   },
//   {
//     path: "/login",
//     element: <Login />
//   }
// ]);
// export default AppRoutes;
