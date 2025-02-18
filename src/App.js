/**
=========================================================
* WebFresquilac - App Component
=========================================================
*/

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Firebase Authentication
import { useAuth } from "hooks/useAuth"; 




import { auth, db } from "./firebase/firebase";
// MUI Components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Custom Components
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";

// Themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Routes
import routes from "routes";

// Context
import { useMaterialUIController, setMiniSidenav } from "context";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, sidenavColor, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const [user] = useAuth(auth);

  // Sidenav hover behavior
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Reset scroll on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Protected Routes Handler
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.type === "hidden") {
        return <Route key={route.key} path={route.route} element={route.component} />;
      }

      if (route.route) {
        return (
          <Route
            key={route.key}
            path={route.route}
            element={
              user && route.roles.includes(user?.role)
                ? route.component
                : <Navigate to="/authentication/sign-in" />
            }
          />
        );
      }
      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      
      {/* Main Layout */}
      {user && (
        <Sidenav
          color={sidenavColor}
          brand="WebFresquilac"
          routes={routes.filter(route => route.type !== "hidden")}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}

      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/authentication/sign-in"} />} />
      </Routes>
    </ThemeProvider>
  );
}