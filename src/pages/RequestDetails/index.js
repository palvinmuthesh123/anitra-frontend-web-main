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

const RequestDetails = () => {
  const { requestType, requestId } = useParams();
  const location = useLocation();
  // const [data, setData] = useState(location.state);
  const navigate = useNavigate();

  const [buyRequestList, setBuyRequestList] = useState(location.state);
  const [requestDetails, setRequestDetails] = useState(location.state);
  const [showRequestConfirmation, setShowRequestConfirmation] = useState(false);
  const [vet, setVet] = useState({});
  const [dist, setDist] = useState({});
  const [mand, setMand] = useState({});

  useEffect(() => {
    console.log(requestDetails, "requestDetails")
    Vete();
    // Dists();
    // Mands();
  }, []);

  // useEffect(() => {
  //   if (requestId) {
  //     getBuyRequestById(requestId);
  //   }
  // }, [requestId]);

  // const getBuyRequests = () => {
  //   const payload = {
  //     type: "SELL",
  //   };
  //   apiRequest({
  //     url: `order/list`,
  //     data: payload,
  //     method: "POST",
  //   })
  //     .then((res) => {
  //       const modifiedData = res?.data?.map((sellRequest) => ({
  //         id: sellRequest?.id,
  //         reqOn: sellRequest?.created_on,
  //         reqByName: sellRequest?.seller_details?.name,
  //         reqByUserId: sellRequest?.seller_details?.user_id,
  //         reqByRole: sellRequest?.seller_details?.type,
  //         reqName: sellRequest?.details?.display_name,
  //         orderDetails: `${sellRequest?.details?.category?.display_name} | ${sellRequest?.details?.breed?.display_name} | ${sellRequest?.details?.type?.display_name}`,
  //         orderDetails1: `${sellRequest?.details?.details?.age_in_months} Months | ${sellRequest?.details?.details?.weight} Kg | ${sellRequest?.details?.details?.no_of_calvings} | ${sellRequest?.details?.details?.milking_quantity} Ltr`,
  //         sellingPrice: sellRequest?.seller_price,
  //         noOfSellRequests: 0,
  //         status: sellRequest?.status,
  //       }));
  //       setBuyRequestList({
  //         data: modifiedData,
  //         totalCount: 0,
  //       });
  //     })
  //     .catch((err) => {
  //       alert(err);
  //     });
  // };

  // const getBuyRequestById = (requestId) => {
  //   // const payload = {};
  //   // apiRequest({
  //   //   url: `request/details/${requestId}`,
  //   //   data: payload,
  //   //   method: "GET",
  //   // })
  //   //   .then((res) => {
  //   //     console.log(res, "LLLLLLLLLLLLLLLLLLLLL")
  //   //     setRequestDetails(res?.data);
  //   //   })
  //   //   .catch((err) => {
  //   //     alert(err);
  //   //   });
  //   // console.log(state, requestId, "OOOOOOOOOOOOOOOOO")
  //   setRequestDetails(requestId);
  // };

  const TableDataUi = () => {
    return buyRequestList?.data?.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={13}
          >
            {row.reqOn}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() => {
              requestType === "buy"
                ? navigate("/UserView/traders")
                : navigate("/UserView/farmers");
            }}
          >
            {row?.reqByName}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={13}
          >
            {row?.reqByRole}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.buyingPrice}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.noOfSellRequests}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.status}
          </Typography>
        </TableCell>
        <TableCell>
          <CustomButton
            title={`Confirm`}
            handleButtonClick={() => {
              setShowRequestConfirmation(true);
            }}
            backgroundColor={Colors.white}
            textColor={Colors.headerColor}
            width={110}
            height={30}
            borderColor={Colors.headerColor}
            textFontSize={14}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const handleInputChange = (event) => {
    // getVillagesList(
    //   userDetails?.district_id,
    //   userDetails?.controlling_villages,
    //   selectedMandal,
    //   event?.target?.value
    // );
  };

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

  const ages = (val) => {
    const lifeS = val - 0;
    const yearss = Math.floor(lifeS / 12);

    const remainingMonthss = lifeS % 12;
    const yearsLabels = yearss === 1 ? "year" : "years";
    const monthsLabels = remainingMonthss === 1 ? "month" : "months";
    return yearsLabels + ' & ' + monthsLabels
  }

  function capitalize(str){
    str = str.toLowerCase();
    return str.replace(/([^ -])([^ -]*)/gi,function(v,v1,v2){ return v1.toUpperCase()+v2; });
  }

  function Vete() {
    if(requestDetails && requestDetails.vet_id) {
      const url ="user/get-veteran";
      const payload = {
        searchText: requestDetails.vet_id,
        search_fields: ["user_id"]
      };
      apiRequest({
        url: url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res, "RRRRRRRRRRRRRRRRRRRR")
          setVet(res.data[0]);
          Dists(res.data[0].district)
          Mands(res.data[0].mandal, res.data[0].district);
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  function Dists(id) {
    // console.log(id, "DDDDDDISSSSSSS")
    if(id) {
      const url ="master/districts";
      const payload = {
        district_id: Number(id)
      };
      apiRequest({
        url: url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          // console.log(res, "MMMMMMMMMMMMMMMMMMMMM")
          setDist(res.data[0])
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  function Mands(id, id1) {
    console.log(id, id1, "MMMMMMMMIIIIIIIIDDDDDDD")
    if(id) {
      const url ="master/mandals";
      const payload = {
        mandal_id: Number(id),
      };
      apiRequest({
        url: url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res)
          if(res && res.data && res.data[0])
          {
            console.log(res.data, "MMMMMMMMMMMMMMMMMMMMM")
            setMand(res.data[0]);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
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
                ACE ID : {requestDetails && requestDetails.ace_id ? requestDetails.ace_id : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Buyer Price : {requestDetails && requestDetails.buyer_price ? requestDetails.buyer_price : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Weight : {requestDetails && requestDetails.weight ? requestDetails.weight : ""} KGS
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Type : {requestDetails && requestDetails.type ? requestDetails.type : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Quantity : {requestDetails && requestDetails.quantity ? requestDetails.quantity : ""}
              </Typography>
              {(requestType == 'buy' || requestType == 'sell') ? <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal ID : {requestDetails && requestDetails.animal_id ? requestDetails.animal_id : ""}
              </Typography> : <Typography
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
              </Typography>}
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Date : {requestDetails && requestDetails.created_on ? EpochFormatDate(requestDetails.created_on) : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Age : {requestDetails && requestDetails.age ? (requestDetails.age + " Months") : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Status : {requestDetails && requestDetails.status ? requestDetails.status : ""}
              </Typography>
              {(requestType == 'buy' || requestType == 'sell') ? <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Category : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.category_details && 
                requestDetails.details.category_details.display_name ?
                requestDetails.details.category_details.display_name : ""}
              </Typography> :  <Typography
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
            {(requestType == 'buy' || requestType == 'sell') ? <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Breed : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.breeds && 
                requestDetails.details.breeds[0] &&
                requestDetails.details.breeds[0].display_name ?
                requestDetails.details.breeds[0].display_name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Animal Type : {
                requestDetails && 
                requestDetails.details && 
                requestDetails.details.types && 
                requestDetails.details.types[0] &&
                requestDetails.details.types[0].display_name ?
                requestDetails.details.types[0].display_name : ""}
              </Typography>
            </Grid> : null}
          </Grid>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Request Id : {requestDetails && requestDetails?.id ? requestDetails?.id : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Type: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.type ?
                requestDetails?.partner_details?.type : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner State: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.state_name ?
                requestDetails?.partner_details?.state_name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Hamlet: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.hamlet_name ?
                requestDetails?.partner_details?.hamlet_name : ""}
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Name: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.name ?
                requestDetails?.partner_details?.name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                {/* Request Details : Cow | Gir | Milking Animal */}
                Partner ID: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.user_id ?
                requestDetails?.partner_details?.user_id : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Distict: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.district_name ?
                requestDetails?.partner_details?.district_name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Village: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.village_name ?
                requestDetails?.partner_details?.village_name : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Mobile: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.mobile ?
                requestDetails?.partner_details?.mobile : ""}
                {/* Date & Time : 22 Aug 2022 | 09:23 */}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner State: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.state_name ?
                requestDetails?.partner_details?.state_name : ""}
                {/* Additional Info : 46 Months | 250 Kg | 02 */}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Partner Mandal: {
                requestDetails &&
                requestDetails?.partner_details && 
                requestDetails?.partner_details?.mandal_name ?
                requestDetails?.partner_details?.mandal_name : ""}
                {/* Additional Info : 46 Months | 250 Kg | 02 */}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Veteinarian Status : {
                requestDetails && 
                requestDetails.vet_id && 
                vet && requestDetails.status ? requestDetails.status : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Veteran : {
                requestDetails && 
                requestDetails.vet_id && 
                vet && 
                vet.name ?
                vet.name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Veteran Ph no: {
                requestDetails && 
                requestDetails.vet_id && 
                vet && 
                vet.mobile ?
                vet.mobile : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Veteran District: {
                requestDetails && 
                requestDetails.vet_id && 
                dist && 
                dist.name ?
                dist.name : ""}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Veteran Mandal: {
                requestDetails && 
                requestDetails.vet_id && 
                mand && 
                mand.name ?
                mand.name : ""}
              </Typography>
            </Grid>
        </Card>
      </Box>
      {showRequestConfirmation && (
        <ConfirmationDialog
          open={showRequestConfirmation}
          handleClose={handleRequestConfirmationClose}
          title={"Request Confirmation"}
          subtitle={"Are you sure you want to confirmation?"}
          actions={{}}
          onCancel={handleRequestConfirmationClose}
          onYes={handleYes}
        />
      )}
    </Box>
  );
};

export default RequestDetails;
