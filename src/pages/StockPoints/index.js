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
    title: "Address",
  },
  {
    id: 3,
    title: "Village",
  },
  {
    id: 4,
    title: "Mandal",
  },
  {
    id: 5,
    title: "District",
  },
  {
    id: 6,
    title: "State",
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

const StockPoints = () => {
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
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402564",
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402565",
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402566",
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402567",
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
      active: "",
      actions: <ActionButtons />,
    },
    {
      id: "402568",
      state: "india",
      district : "District 1",
      mandal : 'Mandal1',
      village : 'Village1',
      address : 'Near Bank, Near Municipal Grd',
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
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.address}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.village}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.mandal}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.district}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.state}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch {...label} defaultChecked color={"error"} />
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
            <CustomInput placeholder={"Enter Display name"} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Select state"}  width={300}/>
          </Grid>
        </Grid>
        <Grid
          container
          mt={4}
          gap={2}
        > 
          <Grid item >
            <CustomSelectPicker placeholder={"Select District"}  width={300}/>
          </Grid>
          <Grid item >
            <CustomSelectPicker placeholder={"Select Mandal"}  width={300}/>
          </Grid>
        </Grid>
        <Grid
          container
          mt={4}
          gap={2}
        > 
          <Grid item >
            <CustomSelectPicker placeholder={"Select village"}  width={300}/>
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
        title={"Add Stock Point"}
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
            Stock Points
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters > Stock Points
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"+ Add Stock Point"}
            handleButtonClick={onAddButtonPress}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={140}
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
            <Grid item>
              <CustomSelectPicker placeholder={"Select state"}  width={200}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Select District"}  width={200}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Select Mandal"}  width={200}/>
            </Grid>
            <Grid item>
              <CustomSelectPicker placeholder={"Select Village"}  width={200}/>
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

export default StockPoints;
