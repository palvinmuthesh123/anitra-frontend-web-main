import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiRequest } from "../../services/api-request";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomInput from "../../components/Input";
import ConfirmationDialog from "../../components/ConfirmationModal";
import {
  EpochFormatDate,
  UTCformatOnlyDate,
} from "../../utilities/date-utility";

const dashboardHeader = [
  {
    id: 1,
    title: "Request ID",
  },
  {
    id: 2,
    title: "Date",
  },
  {
    id: 3,
    title: "Partner",
  },
  {
    id: 4,
    title: "Buy Request Details",
  },
  {
    id: 4,
    title: "Buying Price",
  },
  {
    id: 4,
    title: "No of Sell Requests",
  },
  {
    id: 5,
    title: "Status",
  },
  {
    id: 6,
    title: "Action",
  },
];

const Details = () => {
  const { requestType, requestId } = useParams();
  const location = useLocation();
  // const [data, setData] = useState(location.state);
  const navigate = useNavigate();

  const [buyRequestList, setBuyRequestList] = useState(location.state);
  const [requestDetails, setRequestDetails] = useState(location.state);
  const [showRequestConfirmation, setShowRequestConfirmation] = useState(false);

  useEffect(() => {
    console.log(requestDetails, "requestDetails")
  }, []);

  const confirmRequest = () => {
    const payload = {
      order_id: requestId,
      partner_id: requestDetails?.seller_id,
      price: requestDetails?.seller_price,
    };

    apiRequest({
      url: `order/${requestType}/confirm`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        // setRequestDetails(res?.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleRequestConfirmationClose = () => {
    setShowRequestConfirmation(false);
  };

  const handleYes = () => {
    confirmRequest();
  };

  function capitalize(str){
    str = str.toLowerCase();
    return str.replace(/([^ -])([^ -]*)/gi,function(v,v1,v2){ return v1.toUpperCase()+v2; });
  }

  return (
    <Box>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {
            // requestType === "buy" ? "Buy" : "Sell"
            capitalize(requestType)
            } Process
          </Typography>
          {/* <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Requests > ${requestType === "buy" ? "Buy" : "Sell"} > View`}
          </Typography> */}
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={4}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                ID : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.id ? 
                requestDetails.details.id : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Name : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.display_name ?
                requestDetails.details.display_name: ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Local Name : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.local_name ? 
                requestDetails.details.local_name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Type : {requestType ? capitalize(requestType) : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Status : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.active ? 'OPEN' : "CLOSED"}
              </Typography>
              {<Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Price : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.price ?
                requestDetails.details.price: ""}
              </Typography>}
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default Details;
