import React from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomSelectPicker from "../../components/SelectPicker";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

export const styles = {
  dividerStyle: { backgroundColor: Colors.headerColor, padding: 0.05 },
  tabLink: { textDecorationLine: "none", cursor: "pointer" },
  iconColor: { color: Colors.headerColor, fontSize: 18 },
};

const UserTransactions = () => {
  const tableHeader = [
    {
      id: 1,
      title: "Txn ID",
    },
    {
      id: 2,
      title: "Date",
    },
    {
      id: 3,
      title: "Transaction Details",
    },
    {
      id: 4,
      title: "Partner",
    },
    {
      id: 5,
      title: "Type",
    },
    {
      id: 6,
      title: "Status",
    },
    {
      id: 7,
      title: "Amount",
    },
    {
      id: 8,
      title: "Actions",
    },
  ];

  const tableData = [
    {
      id: "402536",
      orderedOn: "22 Aug 2022 09:20",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      partner: "Trimurthulu",
      role: "farmer",
      type: "Purchased",
      status: "Successful",
      amount: "Rs. 40,000",
      action: "",
    },
    {
      id: "402537",
      orderedOn: "22 Aug 2022 09:20",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      partner: "Trimurthulu",
      role: "farmer",
      type: "Purchased",
      status: "Successful",
      amount: "Rs. 40,000",
      action: "",
    },
    {
      id: "402538",
      orderedOn: "22 Aug 2022 09:20",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      partner: "Trimurthulu",
      role: "farmer",
      type: "Purchased",
      status: "Successful",
      amount: "Rs. 40,000",
      action: "",
    },
    {
      id: "402539",
      orderedOn: "22 Aug 2022 09:20",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      partner: "Trimurthulu",
      role: "farmer",
      type: "Purchased",
      status: "Successful",
      amount: "Rs. 40,000",
      action: "",
    },
    {
      id: "40253610",
      orderedOn: "22 Aug 2022 09:20",
      orderDetails: "Cow | Gir | Milking Animal",
      orderDetails1: "46 Months | 250 Kg | 02 | 25 Ltr",
      partner: "Trimurthulu",
      role: "farmer",
      type: "Purchased",
      status: "Successful",
      amount: "Rs. 40,000",
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
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline" }}
          >
            {row.partner}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.role}
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
            {row.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.amount}
          </Typography>
        </TableCell>

        <TableCell>
          <Grid container alignItems={"center"} gap={2}>
            <Grid item>
              <RemoveRedEyeOutlinedIcon sx={styles.iconColor} />
            </Grid>
            <Grid item>
              <LocalPrintshopOutlinedIcon sx={styles.iconColor} />
            </Grid>
            <Grid item>
              <FileDownloadOutlinedIcon sx={styles.iconColor} />
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
    ));
  };
  return (
    <Box m={3}>
      <Box mt={2}>
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
                  placeholder={"Select Transaction Type"}
                  width={250}
                />
              </Grid>
              <Grid item>
                <CustomSelectPicker placeholder={"Status"} width={180} />
              </Grid>
            </Grid>
            <CustomTable headerData={tableHeader} tableData={tableData}>
              <TableDataUi />
            </CustomTable>
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
                    No Transactions Found
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserTransactions;
