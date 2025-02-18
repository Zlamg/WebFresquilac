/**
=========================================================
* WebFresquilac - Rutas Protegidas por Roles
=========================================================
*/

// Layouts
import Dashboard from "layouts/dashboard";
import Inventory from "layouts/inventory";
import Suppliers from "layouts/suppliers";
import Sales from "layouts/sales";
import Finance from "layouts/finance";
import Distribution from "layouts/distribution";

// Componentes de Autenticación
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

const routes = [
  // Dashboard Principal
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <DashboardIcon fontSize="small" />,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["admin", "encargado", "vendedor", "repartidor"]
  },

  // Módulo de Inventario
  {
    type: "collapse",
    name: "Inventario",
    key: "inventory",
    icon: <InventoryIcon fontSize="small" />,
    route: "/inventario",
    component: <Inventory />,
    roles: ["admin", "encargado"]
  },

  // Módulo de Proveedores
  {
    type: "collapse",
    name: "Proveedores",
    key: "suppliers",
    icon: <LocalShippingIcon fontSize="small" />,
    route: "/proveedores",
    component: <Suppliers />,
    roles: ["admin"]
  },

  // Módulo de Ventas
  {
    type: "collapse",
    name: "Ventas",
    key: "sales",
    icon: <PointOfSaleIcon fontSize="small" />,
    route: "/ventas",
    component: <Sales />,
    roles: ["admin", "vendedor"]
  },

  // Módulo de Finanzas
  {
    type: "collapse",
    name: "Finanzas",
    key: "finance",
    icon: <AttachMoneyIcon fontSize="small" />,
    route: "/finanzas",
    component: <Finance />,
    roles: ["admin"]
  },

  // Módulo de Distribución
  {
    type: "collapse",
    name: "Distribución",
    key: "distribution",
    icon: <LocalShippingIcon fontSize="small" />,
    route: "/distribucion",
    component: <Distribution />,
    roles: ["admin", "repartidor"]
  },

  // Configuración (Opcional)
  {
    type: "collapse",
    name: "Configuración",
    key: "settings",
    icon: <SettingsIcon fontSize="small" />,
    route: "/configuracion",
    component: <div>Configuración</div>, // Reemplazar con componente real
    roles: ["admin"]
  },

  // Autenticación (No mostrar en sidebar)
  {
    type: "hidden",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />
  },
  {
    type: "hidden",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />
  }
];

export default routes;