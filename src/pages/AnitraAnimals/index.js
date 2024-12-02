import React, { useState } from "react";

import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomModal from "../../components/Modal";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CustomSelectPicker from "../../components/SelectPicker";
import { Checkbox } from "@mui/material";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 0,
    title: (
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
    ),
  },
  {
    id: 1,
    title: "ID",
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
    title: "Animal Location",
  },
  {
    id: 5,
    title: "Partner",
  },
  {
    id: 6,
    title: "VE",
  },
  {
    id: 7,
    title: "Status",
  },
  {
    id: 8,
    title: "Certificate",
  },
  {
    id: 9,
    title: "Market Place",
  },
];

const AnitraAnimals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData = [
    {
      id: "402561",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402562",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402563",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402564",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402565",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402566",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402567",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402568",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "402569",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
    },
    {
      id: "4025610",
      tagId: "40253 61324 12",
      animalInfo: "Cow | Gir | Milking Animal",
      animalInfo1: "46 Months | 250 Kg | 02 | 25 Ltr",
      location1: "Alimpur",
      location2: "Mandal, Jungoun, Telangana",
      partner: "Sujith S",
      role: "Trader",
      ve: "Ramesh",
      status: "Created",
      certificate: "Generate",
      marketPlace: "Active",
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
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
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
            {row.animalInfo}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.animalInfo1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.location1}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.location2}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.partner}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {" "}
            {row.role}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {" "}
            {row.ve}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {" "}
            {row.certificate}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {" "}
            {row.marketPlace}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  const Add = () => {
    return (
      <>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          mt={4}
          gap={3}
        >
          <Grid item width={300}>
            <CustomInput placeholder={"Enter product name"} />
          </Grid>
          <Grid item width={300}>
            <CustomInput placeholder={"Enter company name"} />
          </Grid>
        </Grid>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          mt={4}
          gap={3}
        >
          <Grid item width={300} sx={{ cursor: "pointer" }}>
            <CustomButton
              title={`Add Feed & Nutrition`}
              handleButtonClick={onAddButtonPress}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={300}
              height={34}
              borderColor={Colors.headerColor}
              leftIcon={true}
              leftIconElement={
                <CloudUploadOutlinedIcon
                  sx={{ color: Colors.headerColor, fontSize: 23 }}
                />
              }
              textFontSize={14}
            />
          </Grid>
          <Grid item width={300}>
            <CustomInput placeholder={"Price per unit"} />
          </Grid>
        </Grid>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={4}
          gap={3}
        >
          <Grid item sx={{ cursor: "pointer" }}>
            <CustomButton
              title={`Cancel`}
              handleButtonClick={onClickModalClose}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={130}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
            />
          </Grid>
          <Grid item sx={{ cursor: "pointer" }}>
            <CustomButton
              title={`Submit`}
              handleButtonClick={onClickModalClose}
              backgroundColor={Colors.headerColor}
              textColor={Colors.white}
              width={130}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const onClickModalClose = () => {
    setIsModalOpen(false);
  };

  const onAddButtonPress = () => {
    setIsModalOpen(true);
  };

  return (
    <Box>
      <CustomModal
        openModal={isModalOpen}
        handleModalClose={onClickModalClose}
        title={"Add Feed & Nutrition"}
      >
        <Add />
      </CustomModal>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Anitra Animals
          </Typography>
          {/* <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Inventory > Anitra Animals
          </Typography> */}
        </Grid>
        {/* <Grid item>
          <CustomButton
            title={"Export List"}
            handleButtonClick={onAddButtonPress}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={180}
            height={34}
            textFontSize={14}
          />
        </Grid> */}
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid container justifyContent={"space-between"}>
            <Grid item>
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
                  <CustomSelectPicker placeholder={"Animal Category"} />
                </Grid>
                <Grid item>
                  <CustomSelectPicker placeholder={"Animal Breed"} />
                </Grid>
                <Grid item>
                  <CustomSelectPicker placeholder={"Market Place Status"} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container gap={2}>
                <Grid item>
                  <CustomSelectPicker placeholder={"Market Place Status"} />
                </Grid>
                <Grid item>
                  <CustomButton
                    title={"Accept"}
                    handleButtonClick={onAddButtonPress}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={75}
                    height={34}
                    textFontSize={14}
                  />
                </Grid>
              </Grid>
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

export default AnitraAnimals;
