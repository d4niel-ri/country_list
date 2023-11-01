import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Detail from './pages/Detail/Detail.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/detail/:country_name",
    element: <Detail />
  },
  {
    path: "/favorites",
    element: <Favorites />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);