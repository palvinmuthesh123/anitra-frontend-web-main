import React, { useState } from "react";
import { HocLayout } from "../../components/Hoc";
import {
  Box,
  Typography,
  Grid,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomModal from "../../components/Modal";
import CustomSelectPicker from "../../components/SelectPicker";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Image",
  },
  {
    id: 3,
    title: "Vehicle Name",
  },
  {
    id: 4,
    title: "Weight Limit",
  },
  {
    id: 7,
    title: "Active",
  },
  {
    id: 8,
    title: "Actions",
  }
];

const LogisticVehicles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ActionButtons = () => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        <Grid item>
          <CustomButton
            title={"Delete"}
            backgroundColor={Colors.screenBg}
            textColor={Colors.textColor}
            width={52}
            height={22}
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Edit"}
            backgroundColor={Colors.screenBg}
            textColor={Colors.textColor}
            width={52}
            height={22}
          />
        </Grid>
      </Grid>
    );
  };

  const tableData = [
    {
      id: "402563",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402564",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402565",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402566",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402567",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402568",
      image : '',
      title: "Truck",
      weight : '110 Tons',
      active: "",
      actions: <ActionButtons />,
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
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
          <img src={require('../../assets/vehicle.png')} />
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.title}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.weight}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch {...label} defaultChecked color={"secondary"} />
        </TableCell>
        <TableCell>
          {row.actions}
        </TableCell>
      </TableRow>
    ));
  };

  const Add = () => {
    return (
      <>
        <Grid
          container
          mt={4}
          gap={2}
        > 
          <Grid item width={300}>
            <CustomInput placeholder={"Enter Health Service name"} />
          </Grid>
          <Grid item width={300}>
            <CustomInput placeholder={"Name in telugu"} />
          </Grid>
        </Grid>
        <Grid
          container
          mt={4}
          gap={2}
        > 
          <Grid item width={300}>
            <CustomInput placeholder={"Enter price"} />
          </Grid>
          
        </Grid>
      
        <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={4}
          gap={3}
        >
          <Grid item>
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
          <Grid item>
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
        title={"Add Vehicle"}
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
            Logistics Vehicle's
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters >  Logistics Vehicle's
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"+ Add Vehicle"}
            handleButtonClick={onAddButtonPress}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={185}
            height={34}
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

export default LogisticVehicles;
