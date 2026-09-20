import { useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";

// Routes that use DashboardLayout (have their own sidebar/header)
// — do NOT render the public Navbar on these
const DASHBOARD_PREFIXES = [
  "/beekeeper/",
  "/customer/",
];

function App() {
  const location = useLocation();
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <>
      {!isDashboard && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;