import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const MithunPhotosDetails = (props) => {
  const { userDetails } = props;
  return (
    <>
      <Box display={"flex"} gap={"20px"}>
        <Box width={"200px"} mt={2}>
          <img
            src={userDetails?.images?.front_image}
            alt=""
            style={{ width: "200px", height: "200px", borderRadius: "20px" }}
          />
          <Typography
            color={"#B1040E"}
            textAlign={"center"}
            fontSize={"14px"}
            fontFamily={"poppins"}>
            Front Image
          </Typography>
        </Box>
        <Box width={"200px"} mt={2}>
          <img
            src={userDetails?.images?.right_image}
            alt=""
            style={{ width: "200px", height: "200px", borderRadius: "20px" }}
          />
          <Typography
            color={"#B1040E"}
            textAlign={"center"}
            fontSize={"14px"}
            fontFamily={"poppins"}>
            Back Image
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default MithunPhotosDetails;
