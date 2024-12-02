import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { AvatarView } from "../../pages/UserView";
import { CustomTab } from "../../components/CustomTabs";
import { useNavigate, useParams } from "react-router-dom";
import AceFarmersAndTraders from "./ace-farmers-traders";
import AceAnimals from "./ace-animals";
import AceVillages from "./ace-villages";
import { apiRequest } from "../../services/api-request";
import AceBasicInfo from "./basic-info";
import CustomCircularProgress from "../../components/CircularProgress";

const tabs = [
  {
    id: "basic",
    title: "Basic Info",
  },
  {
    id: "farmers",
    title: `ACE Farmers`,
  },
  {
    id: "traders",
    title: `ACE Traders`,
  },
  {
    id: "animals",
    title: `ACE Animals`,
  },
  {
    id: "villages",
    title: `ACE Villages`,
  },
];

const AceDetails = (props) => {
  const navigate = useNavigate();

  const { userId, currentTab } = useParams();
  const [userDetails, setUserDetails] = useState({
    data: {},
    loader: false,
  });
  const [tab, setTab] = useState(tabs[0]);

  useEffect(() => {
    if (currentTab) {
      const filteredTab = tabs?.find((tab) => tab?.id === currentTab);
      setTab(filteredTab);
      if (currentTab) {
        getUserDetails(userId);
      }
    }
  }, [currentTab]);

  const getUserDetails = (userId) => {
    setUserDetails({ loader: true });
    apiRequest({
      url: `user/details/${userId}`,
      data: {},
      method: "GET",
    })
      .then((res) => {
        setUserDetails({ data: res.data, loader: false });
      })
      .catch((err) => {
        alert(err);
        setUserDetails({ loader: false });
      });
  };

  const VillageEntrepreneurDetails = () => {
    return (
      <Card>
        <Box margin={2}>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                fontSize={13}
                color={Colors.textColor}
              >
                ACE Villages
              </Typography>
            </Grid>
            <Grid item sx={{ cursor: "pointer" }}>
              <CustomButton
                title={"+ Add Village"}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                padding={"6px 18px"}
                borderRadius={"8px"}
                handleButtonClick={() =>
                  navigate(`/ace/${userId}/details/villages`)
                }
              />
            </Grid>
          </Grid>

          <Box m={2}>
            <Grid container flexDirection={"column"} gap={1}>
              {userDetails.data?.controlling_villages?.map((cv, index) => (
                <Grid item>
                  <Typography
                    fontFamily={"Poppins-Regular"}
                    color={Colors.textColor}
                    fontSize={13}
                  >
                    {`${index + 1}`}.{" "}
                    {`${cv?.display_name},${cv?.mandal_name}, ${
                      cv?.district_name
                    },${cv?.state_name ? `${cv?.state_name},` : ""} ${
                      cv?.pincode ? cv?.pincode : ""
                    }`}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Card>
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
            Anitra Cluster Entrepreneur's View
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Partners Village Entrepreneur Anitra Cluster Entrepreneur's View
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
                name={`${userDetails.data?.name}`}
                designation={"Anitra Cluster Entrepreneur"}
                nameColor={Colors.textColor}
              />
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box mt={2}>
        <Card>
          <CustomTab
            data={tabs}
            tab={tab}
            userType={"ace"}
            userId={userId}
            prefixUrl={null}
          />

          {userDetails.loader ? (
            <CustomCircularProgress height={"200px"} />
          ) : (
            <>
              {tab.id === "basic" && (
                <AceBasicInfo userDetails={userDetails.data} />
              )}
            </>
          )}

          {(tab.id === "farmers" || tab.id === "traders") && (
            <AceFarmersAndTraders
              userId={userId}
              currentTab={currentTab}
              userDetails={userDetails.data}
            />
          )}
          {tab.id === "animals" && (
            <AceAnimals userId={userId} userDetails={userDetails.data} />
          )}

          {tab.id === "villages" && (
            <AceVillages userId={userId} userDetails={userDetails.data} />
          )}
        </Card>
        {userDetails.loader ? (
          <CustomCircularProgress height={"200px"} />
        ) : (
          <>
            {tab.id === "basic" && (
              <VillageEntrepreneurDetails userId={userId} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AceDetails;
