import React, { useEffect, useState } from "react";
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
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { apiRequest } from "../../services/api-request";

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
    title: "Product Name",
  },
  {
    id: 4,
    title: "Price Per Unit",
  },
  {
    id: 5,
    title: "Active",
  },
  {
    id: 6,
    title: "Actions",
  },
];

const FeedNutrition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedNutritionList, setFeedNutritionList] = useState([]);

  useEffect(() => {
    getFeedNutrition();
  }, []);

  const getFeedNutrition = () => {
    const payload = {};
    apiRequest({
      url: `master/feed/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((feed) => ({
          id: feed?.id,
          image: <img src={`${feed?.image}`} width={50} height={50} />,
          productName: feed?.display_name,
          price: feed?.price,
          active: feed?.active,
          // actions: <ActionButtons />,
        }));
        setFeedNutritionList(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleActiveInactiveSwitch = (e, hsId) => {
    const hsIndex = feedNutritionList?.findIndex((hs) => hs?.id === hsId);
    const cloneHsData = JSON.parse(JSON.stringify(feedNutritionList));
    if (hsIndex > -1) {
      cloneHsData[hsIndex].active = e?.target?.checked;
      setFeedNutritionList([...cloneHsData]);
      updateHSStatus(e?.target?.checked, hsId);
    }
  };

  const updateHSStatus = (checked, hsId) => {
    const payload = {
      active: checked,
    };
    apiRequest({
      url: `master/update-hs/${hsId}`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        getFeedNutrition();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const ActionButtons = () => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        {/* <Grid item>
          <CustomButton
            title={"Delete"}
            backgroundColor={Colors.screenBg}
            textColor={Colors.textColor}
            width={52}
            height={22}
          />
        </Grid> */}
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

  const TableDataUi = () => {
    return feedNutritionList.map((row) => (
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
        <TableCell>{row.image}</TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.productName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.price}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch {...label} defaultChecked color={"secondary"} />
        </TableCell>
        <TableCell>{ActionButtons()}</TableCell>
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
          <Grid item width={300}>
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
            Feed & Nutrition
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Inventory > Feed & Nutrition`}
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"+ Add Feed & Nutrition"}
            handleButtonClick={onAddButtonPress}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={180}
            height={34}
            textFontSize={14}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"space-between"}
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
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={feedNutritionList}
            >
              <TableDataUi />
            </CustomTable>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FeedNutrition;
