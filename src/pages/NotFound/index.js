import React from "react";
import { Box, Typography, Grid } from "@mui/material";

import Card from "../../components/Card";
import { Colors } from "../../constants/Colors";

const NotFound = () => {
  return (
    <Box>
      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            height={"80vh"}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={30}
              >
                Page not Found!
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default NotFound;
