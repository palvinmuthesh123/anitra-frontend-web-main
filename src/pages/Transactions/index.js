import React from "react";
import {
  Box,
  Typography,
  Grid,
  TableCell,
  TableRow,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CustomSelectPicker from '../../components/SelectPicker';


export const styles = {
    dividerStyle: { backgroundColor: Colors.headerColor, padding: 0.05 },
    tabLink: { textDecorationLine: "none", cursor: "pointer" },
    iconColor: { color: Colors.headerColor,fontSize:18 },
};


const Transactions = () => {
 
  const dashboardHeader = [
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
    }
];


const tableData = [
    {
        id: "402536",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "402537",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "402538",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "402539",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
    },
    {
        id: "40253610",
        orderedOn: '22 Aug 2022 09:20',
        orderDetails: 'Cow | Gir | Milking Animal',
        orderDetails1: '46 Months | 250 Kg | 02 | 25 Ltr',
        partner : 'Trimurthulu',
        role : 'farmer',
        type : 'Purchased',
        status: 'Successful',
        amount : 'Rs. 40,000',
        action: ''
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
                    sx={{textDecoration:'underline'}}
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
                <Grid container alignItems={'center'} gap={2}>
                    <Grid item>
                        <RemoveRedEyeOutlinedIcon sx={styles.iconColor}  />
                    </Grid>
                    <Grid item>
                        <LocalPrintshopOutlinedIcon  sx={styles.iconColor}  />
                    </Grid>
                    <Grid item>
                        <FileDownloadOutlinedIcon  sx={styles.iconColor}  />
                    </Grid>
                </Grid>
            </TableCell>

        </TableRow>
    ));
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
            Transactions
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Orders  Transactions
          </Typography>
        </Grid>
        <Grid item>
         
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid
            container
            gap={2}
            alignItems={"center"}
          >
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Animal Category"}  width={170}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Animal Breed"}  width={170}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Select Type"}  width={170}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Select status"}  width={170}/>
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={tableData}>
              <TableDataUi />
            </CustomTable>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Transactions;
