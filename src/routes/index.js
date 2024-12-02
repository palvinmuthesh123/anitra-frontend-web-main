import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import FeedNutrition from "../pages/FeedNutritions";
import AnitraAnimals from "../pages/AnitraAnimals";
import AnimalCategories from "../pages/AnimalCategories";
import States from "../pages/States";
import Districts from "../pages/Districts";
import Mandals from "../pages/Mandal";
import Villages from "../pages/Villages";
import Hamlets from "../pages/Hamlets";
import StockPoints from "../pages/StockPoints";
import HealthServices from "../pages/HealthServices";
import LogisticVehicles from "../pages/LogisticVehicles";
import AnimalPrices from "../pages/AnimalPrices";
import Users from "../pages/Users";
import AnitraUsers from "../pages/Users/anitra-user";
import UserView from "../pages/UserView";
import AceDetails from "../pages/AceDetails";
import Animals from "../pages/Animals";
import VeterianView from "../pages/VeterianView";
import NotFound from "../pages/NotFound";
import OrderDetails from "../pages/OrderDetails";
import OrderSummary from "../pages/OrderSummary";
import Transactions from "../pages/Transactions";
import Ace from "../pages/Ace";
import Login from "../pages/Login";
import AnimalDetails from "../pages/AnimalDetails";
import AnimalBreeds from "../pages/AnimalBreeds";
import AnimalTypes from "../pages/AnimalTypes";
import Requests from "../pages/Requests";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/anitra-animals" element={<AnitraAnimals />} />
      <Route path="/master/animal-categories" element={<AnimalCategories />} />
      <Route path="/master/animal-breeds" element={<AnimalBreeds />} />
      <Route path="/master/animal-types" element={<AnimalTypes />} />
      <Route path="/master/states" element={<States />} />
      <Route path="/master/districts" element={<Districts />} />
      <Route path="/master/mandals" element={<Mandals />} />
      <Route path="/master/villages" element={<Villages />} />
      <Route path="/master/hamlets" element={<Hamlets />} />
      <Route path="/master/stock-points" element={<StockPoints />} />
      <Route path="/master/health-services" element={<HealthServices />} />
      <Route path="master/feed-nutrition" element={<FeedNutrition />} />
      <Route path="/master/logisticsVehicles" element={<LogisticVehicles />} />
      <Route path="/master/animal-prices" element={<AnimalPrices />} />
      <Route path="/user/:userType" element={<Users />} />
      <Route path="/anitra-users" element={<AnitraUsers />} />
      <Route
        path="/:userType/:userId/details/:currentTab"
        element={<UserView />}
      />
      {/* <Route path="/aceDetails" element={<AceDetails />} /> */}
      <Route path="/ace/:userId/details/:currentTab" element={<AceDetails />} />
      <Route path="/animals" element={<Animals />} />
      <Route
        path="/animals/:animalId/details/:currentTab"
        element={<AnimalDetails />}
      />
      <Route path="/veterianView" element={<VeterianView />} />
      <Route path="/request/:requestType" element={<Requests />} />
      <Route
        path="/request/:requestType/:requestId/details"
        element={<OrderDetails />}
      />
      <Route
        path="/request/:requestType/:requestId/summary"
        element={<OrderSummary />}
      />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/ace/:type" element={<Ace />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default router;
