import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import { useParams } from "react-router-dom";
import UserAnimals from "../Users/user-animals";
import UserRequests from "../Users/user-requests";
import UserOrders from "../Users/user-orders";
import UserTransactions from "../Users/user-transactions";
import { apiRequest } from "../../services/api-request";
import { CustomTab } from "../../components/CustomTabs";
import BasicInfo from "./basic-info";
import { useAppContext } from "../../context/AppContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "moment-timezone";
import CustomCircularProgress from "../../components/CircularProgress";
import VillageEntrepreneur from "./village-entrepreneur";

export const styles = {
  dividerStyle: { backgroundColor: Colors.headerColor, padding: 0.05 },
  tabLink: { textDecorationLine: "none", cursor: "pointer" },
  iconColor: { color: Colors.headerColor, fontSize: 18 },
};

export const AvatarView = (props) => {
  return (
    <Grid container gap={3} alignItems={"center"}>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box
          width={50}
          height={50}
          borderRadius={25}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          border={2}
          borderColor={Colors.headerColor}
        >
          {props.designation === "Farmer" && (
            <img
              src={
                props.designation === "Farmer"
                  ? require("../../../src/assets/farmer.png")
                  : null
              }
              width={"30px"}
              height={"30px"}
              alt=""
            />
          )}
        </Box>
      </Box>
      <Grid item>
        <Typography
          fontWeight={600}
          fontFamily={"Poppins-Medium"}
          color={props.nameColor}
          fontSize={16}
        >
          {props.name}
        </Typography>
        <Typography
          fontFamily={"Poppins-Medium"}
          color={Colors.darkTextColor}
          fontSize={13}
        >
          {props.designation}
        </Typography>
      </Grid>
    </Grid>
  );
};

const UserView = () => {
  const { userType, userId, currentTab } = useParams();
  const { user = {} } = useAppContext();
  const currentRole = user?.role?.code || null;

  const roleSingular =
    userType === "farmers" ? "Farmer" : userType === "traders" ? "Trader" : "";

  const tabs = [
    {
      id: "basic",
      title: "Basic Info",
    },
    {
      id: "animals",
      title: `${roleSingular} Animals`,
    },
    {
      id: "requests",
      title: `${roleSingular} Requests`,
    },
    {
      id: "orders",
      title: `${roleSingular} Orders`,
    },
    {
      id: "transactions",
      title: `${roleSingular} Transactions`,
    },
  ];

  const mithunFarmerTabs = [
    {
      id: "basic",
      title: "Basic Info",
    },
    {
      id: "animals",
      title: `Farmer Mithun's`,
    },
    {
      id: "requests",
      title: `Farmer Requests`,
    },
    {
      id: "transactions",
      title: `Farmer Transactions`,
    },
  ];

  const [tab, setTab] = useState(tabs[0]);

  const [userDetails, setUserDetails] = useState({
    details: {},
    loader: false,
  });

  useEffect(() => {
    if (userId) {
      if (userDetails.details?.id !== "") {
        getUserDetails(userId);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (currentTab) {
      const filteredTab = tabs?.find((tab) => tab?.id === currentTab);
      setTab(filteredTab);
    }
  }, [currentTab]);

  const schema = yup
    .object({
      farmerName: yup.string().required("Farmer Name is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    })
    .required();

  const getUserDetails = (userId) => {
    setUserDetails({ details: {}, loader: true });

    apiRequest({
      url:
        currentRole === "admin"
          ? `user/details/${userId}`
          : `madmin/farmer/details/${userId}`,
      data: {},
      method: "GET",
    })
      .then((res) => {
        setUserDetails({ details: res?.data, loader: false });
      })
      .catch((err) => {
        alert(err);
        setUserDetails({ details: {}, loader: false });
      });
  };

  const getDefaultValues = (userDetails) => {
    if (userDetails?.user_id) {
      return {
        farmerID: userDetails?.user_id?.split("-")[1],
        farmerName: userDetails?.name,
        idNumber: userDetails?.id_number,
        mobileNumber: userDetails?.mobile,
      };
    } else {
      return { farmerName: "", idNumber: "", farmerID: "", mobileNumber: "" }; // Set default values when userDetails is falsy
    }
  };

  const {} = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(userDetails),
  });

  return (
    <Box>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {user?.role?.code === "admin"
              ? `${roleSingular} View`
              : "Farmer View"}
          </Typography>
          {user?.role?.code === "admin" && (
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={13}
              color={Colors.textColor}
            >
              Partners {roleSingular} View
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"flex-start"}
            gap={"60px"}
            alignItems={"center"}
          >
            <Grid item>
              <AvatarView
                name={userDetails.details?.name}
                designation={currentRole === "admin" ? roleSingular : "Farmer"}
                nameColor={Colors.textColor}
              />
            </Grid>
            {currentRole === "admin" ? (
              <>
                <Grid item>
                  <AvatarView
                    name={userDetails.details?.name}
                    designation={"Anitra Cluster Entreprenuer"}
                    nameColor={Colors.headerColor}
                  />
                </Grid>
                {/* <Grid item>
                  <AvatarView
                    name={"NA"}
                    designation={"Supervisor"}
                    nameColor={Colors.headerColor}
                  />
                </Grid> */}
              </>
            ) : (
              <>
                {/* <Grid item>
              <AvatarView
                name={"Satyam Ramulu"}
                designation={"Anitra District Co-Ordinator"}
                nameColor={Colors.headerColor}
              />
            </Grid> */}
              </>
            )}
          </Grid>
        </Card>
      </Box>

      <Box mt={2}>
        <Card>
          <CustomTab
            data={currentRole === "mithunAdmin" ? mithunFarmerTabs : tabs}
            tab={tab}
            userType={userType}
            userId={userId}
            prefixUrl={"user"}
            isCustomUrl={true}
          />
          {userDetails.loader ? (
            <CustomCircularProgress />
          ) : (
            <>
              {tab.id === "basic" && (
                <BasicInfo userDetails={userDetails.details} />
              )}
            </>
          )}
          {tab.id === "animals" && (
            <UserAnimals userId={userId} userType={userType} />
          )}
          {tab.id === "requests" && <UserRequests userId={userId} />}
          {tab.id === "orders" && <UserOrders userId={userId} />}
          {tab.id === "transactions" && <UserTransactions userId={userId} />}
        </Card>
        {tab.id === "basic" &&
          currentRole === "admin" &&
          userDetails.details?.ace_details && (
            <VillageEntrepreneur userDetails={userDetails.details} />
          )}
      </Box>
    </Box>
  );
};

export default UserView;
