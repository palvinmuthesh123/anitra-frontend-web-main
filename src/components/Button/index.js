import React from "react";
import { Button } from "@mui/material";

const CustomButton = (props) => {
  const { variant, type } = props;
  return (
    <>
      <Button
        onClick={props.handleButtonClick}
        variant={variant}
        type={type ? type : 'button'}
        sx={{
          width: props.width,
          height: props.height,
          border: props.border,
          backgroundColor: props.backgroundColor,
          color: props.textColor,
          borderColor: props.borderColor,
          fontSize: props.fontSize,
          borderRadius: props.borderRadius,
          padding: props.padding ? props.padding : "12px",
          ":hover": {
            bgcolor: props.backgroundColor,
            color: props.textColor,
          },
          textTransform: "none",
          fontFamily: "Poppins-Medium",
        }}
      >
        {props.title}
      </Button>
    </>
  );
};

export default CustomButton;
