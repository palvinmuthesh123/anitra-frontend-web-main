import React from "react";
import { Box } from "@mui/material";
import { Colors } from "../../constants/Colors";

const AppFilter = (props) => {
  return (
    <Box
      backgroundColor={Colors.white}
      boxShadow={1}
      borderRadius={4}
      padding={2}
      margin={1}
      width={props.width ? props.width : undefined}
    >
      {props.children}
    </Box>
  );
};

export default AppFilter;
