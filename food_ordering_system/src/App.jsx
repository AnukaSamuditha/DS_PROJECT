import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Layout from "./Layout";
import Home from "./Home";
import SignUp from "./Auth/SignUp";
import SignIn from "./Auth/SignIn";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
