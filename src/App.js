import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import AppLayout from "./components/AppLayout/app-layout";
import Dashboard from "./pages/Dashboard";
import AnitraAnimals from "./pages/AnitraAnimals";
import Login from "./pages/Login";
import AnimalCategories from "./pages/AnimalCategories";
import AnimalBreeds from "./pages/AnimalBreeds";
import States from "./pages/States";
import Districts from "./pages/Districts";
import Mandal from "./pages/Mandal";
import Villages from "./pages/Villages";
import Hamlets from "./pages/Hamlets";
import StockPoints from "./pages/StockPoints";
import HealthServices from "./pages/HealthServices";
import FeedNutritions from "./pages/FeedNutritions";
import LogisticVehicles from "./pages/LogisticVehicles";
import Users from "./pages/Users";
import AnitraUsers from "./pages/Users/anitra-user";
import Veteran from "./pages/Users/veteran";
import UserView from "./pages/UserView";
import AceDetails from "./pages/AceDetails";
import Animals from "./pages/Animals";
import MuzzleUsers from "./pages/Muzzle";
import MuzzleFarmer from "./pages/MuzzleFarmer";
import MuzzleCompany from "./pages/MuzzleCompany";
import Ads from "./pages/Ads";
import Banner from "./pages/Banner";
import Muzzle from "./pages/Muzzle1"
import AnimalDetails from "./pages/AnimalDetails";
import VeterianView from "./pages/VeterianView";
import Requests from "./pages/Requests";
import OrderSummary from "./pages/OrderSummary";
import Transactions from "./pages/Transactions";
import Ace from "./pages/Ace";
import AnimalPrices from "./pages/AnimalPrices";
import AnimalTypes from "./pages/AnimalTypes";
import RequestDetails from "./pages/RequestDetails";
import Details from "./pages/Details";
import MithunTribes from "./pages/Mithun/Tribes";
import MithunCommunityTribe from "./pages/Mithun/Mithun-Community";
import { useAppContext } from "./context/AppContext";
import AddAnimal from "./pages/Animals/add-animal";
import AdminNotificationsList from "./pages/Notifications/notifications-list";

const App = () => {
  function RequireAuth() {
    const { isLoggedIn, user, handleLogoutSuccess } = useAppContext();
    let allowed = true;
    let location = useLocation();

    if (isLoggedIn && user?.role?.code) {
      if (
        location?.pathname?.startsWith("/admin") &&
        user?.role?.code === "mithunAdmin"
      ) {
        allowed = false;
      }
      if (
        user?.role?.code === "admin" &&
        !location?.pathname?.startsWith("/admin") &&
        location?.pathname?.startsWith("/")
      ) {
        allowed = false;
      }
      if (
        user?.role?.code === "admin" &&
        !location?.pathname?.startsWith("/admin")
      ) {
        allowed = false;
      }
      // console.log("user", user);
      // if (!allowed) {
      //   localStorage.removeItem("user");
      //   localStorage.removeItem("loginStatus", "false");
      //   localStorage.removeItem("selectedLocality");
      //   handleLogoutSuccess();
      //   return <Navigate to="/login" state={{ from: location }} />;
      // }
    } else {
      // if (location?.pathname?.startsWith("/admin")) {
      localStorage.removeItem("user");
      localStorage.removeItem("loginStatus", "false");
      handleLogoutSuccess();
      return <Navigate to="/login" state={{ from: location }} />;
      // }
    }

    return <Outlet />;
  }

  function NotFound() {
    return <h3>NotFound</h3>;
  }

  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/anitra-animals" element={<AnitraAnimals />} />

            <Route
              path="/master/animal-categories"
              element={<AnimalCategories />}
            />
            <Route path="/master/animal-breeds" element={<AnimalBreeds />} />
            <Route path="/master/animal-types" element={<AnimalTypes />} />
            <Route path="/master/states" element={<States />} />
            <Route path="/master/districts" element={<Districts />} />
            <Route path="/master/mandals" element={<Mandal />} />
            <Route path="/master/villages" element={<Villages />} />
            <Route path="/master/hamlets" element={<Hamlets />} />
            <Route path="/master/stock-points" element={<StockPoints />} />
            <Route
              path="/master/health-services"
              element={<HealthServices />}
            />
            <Route path="master/feed-nutrition" element={<FeedNutritions />} />
            <Route
              path="/master/logisticsVehicles"
              element={<LogisticVehicles />}
            />
            <Route path="/master/animal-prices" element={<AnimalPrices />} />
            <Route path="/user/:userType" element={<Users />} />
            <Route path="/anitra-users" element={<AnitraUsers />} />
            <Route path="/veterinarian" element={<Veteran />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/banner" element={<Banner />} />
            <Route
              path="/user/:userType/:userId/details/:currentTab"
              element={<UserView />}
            />
            <Route
              path="/ace/:userId/details/:currentTab"
              element={<AceDetails />}
            />
            <Route path="/animals" element={<Animals />} />
            <Route path="/muzzleanimal" element={<Muzzle />} />
            <Route path="/muzzleuser" element={<MuzzleUsers />} />
            <Route path="/muzzlefarmer" element={<MuzzleFarmer />} />
            <Route path="/muzzlecompany" element={<MuzzleCompany />} />
            
            <Route
              path="/animals/:animalId/details/:currentTab"
              element={<AnimalDetails />}
            />
            <Route path="/veterianView" element={<VeterianView />} />
            <Route path="/request/:requestType" element={<Requests />} />
            <Route
              path="/request/:requestType/:requestId/details"
              element={<RequestDetails />}
            />
            <Route
              path="/:requestType/:requestId/details"
              element={<Details />}
            />
            <Route
              path="/request/:requestType/:requestId/summary"
              element={<OrderSummary />}
            />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/user/ace" element={<Ace />} />
            <Route path="/notifications" element={<AdminNotificationsList />} />

            {/* Mithun Routes starts here */}

            <Route path="/mithun/animals" element={<Animals />} />
            <Route path="/mithun/animals/:formType" element={<AddAnimal />} />
            <Route
              path="/mithun-animals/:animalId/details/:currentTab"
              element={<AnimalDetails />}
            />

            <Route path="/master/tribes" element={<MithunTribes />} />
            <Route
              path="/master/mithun-society"
              element={<MithunCommunityTribe />}
            />

            {/* Mithun Routes ends here */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </React.StrictMode>
  );
};

export default App;
