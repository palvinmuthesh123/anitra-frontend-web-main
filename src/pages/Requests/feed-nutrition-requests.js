import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { apiRequest } from "../../services/api-request";
import { Colors } from "../../constants/Colors";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import CustomTable from "../../components/Table";
import Card from "../../components/Card";
import {
  EpochFormatDate,
  UTCformatOnlyDate,
} from "../../utilities/date-utility";
import Pagination from "../../components/Pagination";
import { downloadFile } from "../../utilities/exportToCsv";
import { useNavigate, useParams } from "react-router-dom";

const dashboardHeader = [
  {
    id: 1,
    title: "SN.o",
  },
  {
    id: 1,
    title: "Req. ID",
  },
  {
    id: 2,
    title: "Req. On",
  },
  {
    id: 3,
    title: "Req. By",
  },
  {
    id: 7,
    title: "Product Name",
  },
  {
    id: 10,
    title: "Location",
  },
  {
    id: 11,
    title: "Status",
  },
];

const FeedNutritionRequests = () => {
  const [feedAndNutritionRequests, setFeedAndNutritionRequests] = useState({});
  const [data, setData] = useState([])
  const [feedAndNutritionRequestsCSV, setFeedAndNutritionRequestsCSV] =
    useState([]);

  const navigate = useNavigate();

  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getFeedAndNutritionList();
  }, [skip]);

  const getFeedAndNutritionList = () => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "FEED",
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setData(res?.data);
        const modifiedData = res?.data?.map((hs) => {
          const farmerAddress = `${hs?.partner_details?.state_name}, ${hs?.partner_details?.district_name}, ${hs?.partner_details?.mandal_name}, ${hs?.partner_details?.mandal_name}, ${hs?.partner_details?.village_name}, ${hs?.partner_details?.address}`;
          const data = {
            id: hs?.id,
            reqOn: hs?.created_on,
            reqByName: hs?.partner_details?.name,
            reqByUserId: hs?.partner_id,
            reqByRole: "Farmer",
            reqName: hs?.details?.display_name,
            location: farmerAddress,
            status: hs?.status,
          };
          return data;
        });
        setFeedAndNutritionRequests({
          data: modifiedData,
          totalCount: 0,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return feedAndNutritionRequests?.data?.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {skip + index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={12}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/request/feed-nutrition/${row?.id}/details`, {state: data[index]})
            }
          >
            {row.id}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {EpochFormatDate(row.reqOn)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/user/traders/${row.reqByUserId}/details/basic`)
            }
          >
            {row.reqByName}
          </Typography>
          {/* <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={13}
          >
            {row.reqByRole}
          </Typography> */}
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.reqName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.location}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.status}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  useEffect(() => {
    let headers = [
      "Request Id,Requested Date,Requested By,Product Name,Location,Status",
    ];
    let orderCsv;
    if (
      Array.isArray(feedAndNutritionRequestsCSV) &&
      feedAndNutritionRequestsCSV.length > 0
    ) {
      orderCsv = feedAndNutritionRequestsCSV?.reduce(
        (acc, healthRequest, index) => {
          const { id, created_on, partner_details, status, details } =
            healthRequest;
          const requestID = id;
          const date = UTCformatOnlyDate(created_on);
          const formatedDate = date.replace(/\W/g, " ");
          const requestedName = partner_details?.name;
          const farmerAddress = `${partner_details?.state_name}-${
            partner_details?.district_name
          }-${partner_details?.mandal_name}-${
            partner_details?.village_name
          }-${partner_details?.address.replace(/[\r\n]+/g, " ")}`;
          const requestStatus = status;
          const productName = details?.display_name;
          acc.push(
            [
              requestID,
              formatedDate,
              requestedName,
              productName,
              farmerAddress,
              requestStatus,
            ].join(",")
          );
          return acc;
        },
        []
      );

      downloadFile({
        data: [...headers, ...orderCsv].join("\n"),
        fileName: "Feed And Nutrition Request.csv",
        fileType: "text/csv",
      });
    }
  }, [feedAndNutritionRequestsCSV]);

  const exportCSV = () => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "FEED",
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setFeedAndNutritionRequestsCSV(res?.data);
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <Box>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Feed and Nutrition
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Requests {">"} Feed and Nutrition
          </Typography>
        </Grid>

        <Grid item>
          <CustomButton
            title={"Export List"}
            handleButtonClick={exportCSV}
            padding={"4px 20px"}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            textFontSize={14}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid container alignItems={"center"} gap={2}>
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>s
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={feedAndNutritionRequests?.data}
            >
              <TableDataUi />
            </CustomTable>
          </Box>
          {feedAndNutritionRequests?.totalCount > 2 && (
            <Pagination
              totalCount={Number(feedAndNutritionRequests?.totalCount)}
              skip={skip}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default FeedNutritionRequests;
