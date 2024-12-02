import React from "react";
import Card from "../../components/Card";
import { Box, Grid, Typography } from "@mui/material";
import CustomInput from "../../components/Input";
import { Colors } from "../../constants/Colors";

const VillageEntrepreneur = (props) => {
  const { userDetails } = props;
  return (
    <>
      <Card>
        <Box margin={2}>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={13}
            color={Colors.textColor}
          >
            Village Entrepreneur Details
          </Typography>
          <Box mt={2}>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item width={"30%"}>
                <CustomInput
                  placeholder={""}
                  label={"Village Entrepreneur Name"}
                  disabled={true}
                  value={userDetails?.ace_details?.name}
                />
              </Grid>
              <Grid item width={"30%"}>
                <CustomInput
                  placeholder={""}
                  label={"Mobile Number"}
                  disabled={true}
                  value={userDetails?.ace_details?.mobile}
                />
              </Grid>
              <Grid item width={"30%"}>
                <CustomInput
                  placeholder={""}
                  label={"Assigned Villages"}
                  value={`${userDetails?.ace_details?.state_name}, ${userDetails?.ace_details?.district_name}, ${userDetails?.ace_details?.mandal_name}, ${userDetails?.ace_details?.village_name}`}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default VillageEntrepreneur;
