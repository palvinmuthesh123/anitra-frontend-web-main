import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Colors } from "../../constants/Colors";

import { useAppContext } from "../../context/AppContext";
import Notifications from "./notification-list";

const Header = () => {
  const { user = {} } = useAppContext();

  return (
    <Grid
      container
      alignItems={"center"}
      justifyContent={"space-between"}
      backgroundColor={Colors.headerColor}
      p={"15px"}
      boxShadow={2}
    >
      <Grid item>
        <Typography
          fontFamily={"Poppins-Regular"}
          color={Colors.white}
          fontSize={20}
        >
          {`${
            user?.role?.code === "admin"
              ? "Welcome to Anitra Tech Pvt. Ltd."
              : "Welcome to Mithun Anitra"
          }`}
        </Typography>
      </Grid>
      <Box>
        <Grid item>
          <Grid container alignItems={"center"} gap={1}>
            <Grid item>
              <Notifications />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Header;

const styles = {
  avtarImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
};
