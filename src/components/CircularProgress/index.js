import { Box, CircularProgress } from "@mui/material";
import React from "react";

const CustomCircularProgress = (props) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: props.height,
        }}
      >
        <CircularProgress color="error" size={props.size}/>
      </Box>
    </>
  );
};

export default CustomCircularProgress;
