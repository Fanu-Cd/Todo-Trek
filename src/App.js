import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/Layout";
import Home from "./components/Home";
import WelcomPage from "./components/WelcomePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:"home",
        element:<Home />
      },
      {
        path:"/",
        element:<WelcomPage  />
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
