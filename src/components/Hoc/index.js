import React from "react";
import { Box, Grid } from "@mui/material";
import Header from "../../components/Header";
import { Colors } from "../../constants/Colors";

export const HocLayout =
  (Component) =>
  ({ ...props }) => {
    return (
      <Box backgroundColor={Colors.screenBg}>
        <Grid container>
          <Grid item md={10}>
            <Header />
            <Box margin={3}>
              <Component />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };
