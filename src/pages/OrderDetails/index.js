import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TableCell,
  TableRow,
  Checkbox,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import { AvatarView } from "../../pages/UserView";
import CustomSelectPicker from "../../components/SelectPicker";
import { useNavigate, useParams } from "react-router-dom";
import { CustomTab } from "../../components/CustomTabs";

const label = { inputProps: { "aria-label": "switch" } };

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderType } = useParams();
  const tabs = [
    {
      id: 1,
      title: "Animals",
    },
    {
      id: 2,
      title: `Selected Animals`,
    },
  ];
  const sellTabs = [
    {
      id: 1,
      title: "Partners",
    },
    {
      id: 2,
      title: `Selected Partners`,
    },
  ];
  const subTabs = [
    {
      id: 1,
      title: "Animals",
    },
    {
      id: 2,
      title: `Anitra Animals`,
    },
  ];
  const [tab, setTab] = useState(tabs[0]);
  const [subTab, setSubTab] = useState(subTabs[0]);

  const SelectedOrders = () => {
    const tableHeader = [
      {
        id: 8,
        title: "",
      },
      {
        id: 1,
        title: "Animal ID",
      },
      {
        id: 2,
        title: "Tag ID",
      },
      {
        id: 3,
        title: "Animal Basic Info",
      },
      {
        id: 4,
        title: "Partner",
      },
      {
        id: 5,
        title: "Partner Location",
      },
      {
        id: 6,
        title: "Status",
      },
      {
        id: 7,
        title: "Action",
      },
    ];

    const tableData = [
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        status: "Selected",
        action: "",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        status: "Selected",
        action: "",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        status: "Selected",
        action: "",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        status: "Selected",
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
            <Checkbox
              {...label}
              size={"small"}
              sx={{
                color: Colors.textColor,
                "&.Mui-checked": {
                  color: Colors.headerColor,
                },
              }}
            />
          </TableCell>
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
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.tagId}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info2}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerName}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerType}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location2}
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
                navigate(`/orderSummary/${orderType}`);
              }}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={90}
              height={28}
              borderColor={Colors.headerColor}
              textFontSize={14}
            />
          </TableCell>
        </TableRow>
      ));
    };
    return (
      <Box m={1}>
        <Grid container gap={2} alignItems={"center"}>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Village"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Mandal"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select District"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select State"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Category"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Breed"} width={170} />
          </Grid>
        </Grid>
        <Box mt={2}>
          <CustomTable headerData={tableHeader} tableData={tableData}>
            <TableDataUi />
          </CustomTable>
        </Box>
      </Box>
    );
  };

  const nextStep = () => {
    setTab(tabs[1]);
  };

  const Orders = () => {
    const tableHeader = [
      {
        id: 8,
        title: "",
      },
      {
        id: 1,
        title: "Animal ID",
      },
      {
        id: 2,
        title: "Tag ID",
      },
      {
        id: 3,
        title: "Animal Basic Info",
      },
      {
        id: 4,
        title: "Partner",
      },
      {
        id: 5,
        title: "Partner Location",
      },
      {
        id: 6,
        title: "Updated On",
      },
      {
        id: 7,
        title: "Verified On",
      },
    ];

    const tableData = [
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
      {
        id: "402563",
        tagId: "12344 51234 41",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        createdDate: "22 Aug 2022  09:20",
        updatedAt: "22 Aug 2022  09:50",
        verifiedAt: "22 Aug 2022  09:50",
      },
    ];

    const TableDataUi = () => {
      return tableData.map((row) => (
        <TableRow
          key={row.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Checkbox
              {...label}
              size={"small"}
              sx={{
                color: Colors.textColor,
                "&.Mui-checked": {
                  color: Colors.headerColor,
                },
              }}
            />
          </TableCell>
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
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.tagId}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info2}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerName}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerType}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location2}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.updatedAt}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.verifiedAt}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    };
    return (
      <Box m={1}>
        <Grid container gap={2} alignItems={"center"}>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Village"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Mandal"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select District"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select State"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Category"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Breed"} width={170} />
          </Grid>
        </Grid>
        <Box mt={2}>
          <CustomTable headerData={tableHeader} tableData={tableData}>
            <TableDataUi />
          </CustomTable>
        </Box>
      </Box>
    );
  };

  const Partners = () => {
    const tableHeader = [
      {
        id: 8,
        title: "",
      },
      {
        id: 1,
        title: "ID",
      },
      {
        id: 2,
        title: "Partner",
      },
      {
        id: 3,
        title: "Mobile No",
      },
      {
        id: 4,
        title: "Order Details",
      },
      {
        id: 5,
        title: "Partner Location",
      },
    ];

    const tableData = [
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
      {
        id: "402563",
        info1: "Cow | Gir | Milking Animal",
        info2: "46 Months | 250 Kg | 02 | 25 Ltr",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
      },
    ];

    const TableDataUi = () => {
      return tableData.map((row) => (
        <TableRow
          key={row.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Checkbox
              {...label}
              size={"small"}
              sx={{
                color: Colors.textColor,
                "&.Mui-checked": {
                  color: Colors.headerColor,
                },
              }}
            />
          </TableCell>
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
              fontSize={12}
            >
              {row.partnerName}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerType}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.mobile}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.info2}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location2}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    };
    return (
      <Box m={1}>
        <Grid container gap={2} alignItems={"center"}>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Village"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Mandal"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select District"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select State"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Category"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Breed"} width={170} />
          </Grid>
        </Grid>
        <Box mt={2}>
          <CustomTable headerData={tableHeader} tableData={tableData}>
            <TableDataUi />
          </CustomTable>
        </Box>
      </Box>
    );
  };

  const SelectedPartners = () => {
    const tableHeader = [
      {
        id: 1,
        title: "ID",
      },
      {
        id: 2,
        title: "Partner",
      },
      {
        id: 3,
        title: "Mobile No",
      },

      {
        id: 5,
        title: "Partner Location",
      },
      {
        id: 4,
        title: "VE Name",
      },
      {
        id: 6,
        title: "Status",
      },
      {
        id: 7,
        title: "Action",
      },
    ];

    const tableData = [
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
      },
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
      },
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
      },
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
      },
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
      },
      {
        id: "402563",
        partnerName: "Trimurthulu",
        partnerType: "Farmer",
        location1: "Alimpur",
        location2: "Mandal, Jungoun, Telangana",
        mobile: "9999999999",
        veName: "Vijay Reddy",
        status: "selected",
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
              fontSize={12}
            >
              {row.partnerName}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.partnerType}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.mobile}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location1}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.location2}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.veName}
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
          <TableCell>
            <CustomButton
              title={`Confirm`}
              handleButtonClick={() => {
                navigate(`/orderDetails/${orderType}`);
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
    return (
      <Box m={1}>
        <Grid container gap={2} alignItems={"center"}>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Village"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select Mandal"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select District"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select State"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Category"} width={170} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Animal Breed"} width={170} />
          </Grid>
        </Grid>
        <Box mt={2}>
          <CustomTable headerData={tableHeader} tableData={tableData}>
            <TableDataUi />
          </CustomTable>
        </Box>
      </Box>
    );
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
            {orderType === "buy" ? "Buy" : "Sell"} Process
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Orders {orderType === "buy" ? "Buy" : "Sell"} View
          </Typography>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <AvatarView
                name={"Mundrathi Vivek"}
                designation={"Farmer"}
                nameColor={Colors.textColor}
              />
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Order Id : 402536
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Order Details : Cow | Gir | Milking Animal
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Date & Time : 22 Aug 2022 | 09:23
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Additional Info : 46 Months | 250 Kg | 02
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
          <CustomTab
            data={orderType === "buy" ? tabs : sellTabs}
            tab={tab}
            setTab={setTab}
          />
          <Box m={2}>
            {tab.id === 1 && orderType === "buy" && (
              <CustomTab data={subTabs} tab={subTab} setTab={setSubTab} />
            )}
            {tab.id === 1 &&
              (subTab.id === 1 || subTab.id === 2) &&
              orderType === "buy" && <Orders />}
            {tab.id === 2 && orderType === "buy" && <SelectedOrders />}
            {tab.id === 1 && orderType === "sell" && <Partners />}
            {tab.id === 2 && orderType === "sell" && <SelectedPartners />}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default OrderDetails;
