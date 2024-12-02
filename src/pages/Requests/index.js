import React, {  } from "react";
import {
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import BuyRequests from "./buy-requests";
import SellRequests from "./sell-requests";
import HealthServiceRequests from "./health-service-requests";
import FeedNutritionRequests from "./feed-nutrition-requests";



const Requests = () => {
  const { requestType } = useParams();

  const renderRequestsByType = (requestType) => {
    switch (requestType) {
      case "buy":
        return <BuyRequests />;
      case "sell":
        return <SellRequests />;
      case "health-services":
        return <HealthServiceRequests />;
      case "feed-nutrition":
        return <FeedNutritionRequests />;
      default:
        break;
    }
  };

  return (
    <Box>
      <Box mt={2}>{renderRequestsByType(requestType)}</Box>
    </Box>
  );
};

export default Requests;
