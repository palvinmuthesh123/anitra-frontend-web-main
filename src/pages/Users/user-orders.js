import React from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomSelectPicker from "../../components/SelectPicker";

const UserOrders = () => {
  const tableHeader = [
    {
      id: 1,
      title: "Order ID",
    },
    {
      id: 2,
      title: "Ordered On",
    },
    {
      id: 3,
      title: "Type",
    },
    {
      id: 4,
      title: "Order Details",
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

  const tableData = [
    {
      id: "402563",
      orderedOn: "22 Aug 2022 09:20",
      type: "Buy",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      status: "Under Process",
      action: "",
    },
    {
      id: "402564",
      orderedOn: "22 Aug 2022 09:20",
      type: "Buy",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      status: "Under Process",
      action: "",
    },
    {
      id: "402565",
      orderedOn: "22 Aug 2022 09:20",
      type: "Buy",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      status: "Under Process",
      action: "",
    },
    {
      id: "402566",
      orderedOn: "22 Aug 2022 09:20",
      type: "Buy",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      status: "Under Process",
      action: "",
    },
    {
      id: "402567",
      orderedOn: "22 Aug 2022 09:20",
      type: "Buy",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      status: "Under Process",
      action: "",
    },
  ];

  const TableDataUi = () => {
    return tableData.map((row) => (
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
            {row.orderedOn}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.type}
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
            {row.status}
          </Typography>
        </TableCell>
        <TableCell>
          <CustomButton
            title={`View`}
            handleButtonClick={() => {
              console.log("hiii");
            }}
            backgroundColor={Colors.white}
            textColor={Colors.headerColor}
            width={110}
            height={32}
            borderColor={Colors.headerColor}
            textFontSize={14}
          />
        </TableCell>
      </TableRow>
    ));
  };
  return (
    <Box m={3}>
      {false ? (
        <>
          <Grid container alignItems={"center"} gap={2}>
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
            <Grid item>
              <CustomSelectPicker
                placeholder={"Select Request Type"}
                width={200}
              />
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Status"} width={180} />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={tableHeader} tableData={tableData}>
              <TableDataUi />
            </CustomTable>
          </Box>
        </>
      ) : (
        <>
          <Box mt={2}>
            <Grid
              container
              justifyContent={"center"}
              alignItems={"center"}
              // height={"80vh"}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  // color={Colors.headerColor}
                  fontSize={16}
                >
                  No Orders Found
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserOrders;
