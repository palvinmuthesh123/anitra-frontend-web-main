import React from "react";
import { Box } from "@mui/material";
import { Colors } from "../../constants/Colors";

const Card = (props) => {
  return (
    <Box
      backgroundColor={Colors.white}
      boxShadow={"0px 0px 48px #00183414"}
      borderRadius={4}
      padding={2}
      margin={1}
      width={props.width ? props.width : undefined}
    >
      {props.children}
    </Box>
  );
};

export default Card;
