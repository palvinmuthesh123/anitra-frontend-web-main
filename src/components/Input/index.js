import React from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { inputLabelClasses } from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

const CustomInput = React.forwardRef((props, ref) => {
  const {
    placeholder,
    label,
    backgroundColor,
    rightIcon,
    leftIcon,
    rightIconElement,
    multiline,
    type,
    name,
    helperText,
    inputLabel,
    onChange,
    value,
    blackDisabled,
    ...field
  } = props;

  const { height, padding, transform, border } = props;
  return (
    <>
      <TextField
        {...field}
        disabled={props.disabled}
        defaultValue={props.defaultValue}
        size={"medium"}
        label={inputLabel}
        InputProps={
          leftIcon
            ? {
                startAdornment: (
                  <InputAdornment position="start">{leftIcon}</InputAdornment>
                ),
              }
            : null
        }
        InputLabelProps={{
          sx: {
            color: "#000000",
            fontSize: "12px",
            top: "-6px",
            [`&.${inputLabelClasses.shrink}`]: {
              color: "#000000",
              fontSize: "15px",
              top: "0px",
            },
          },
        }}
        type={type}
        sx={{
          "& .MuiInputBase-root.MuiOutlinedInput-root": {
            color: "#000000",
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : null,
          },
          "& .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: padding ? padding : multiline ? "0px" : "12px",
            height: height ? height : "12px",
            fontSize: "12px",
            fontFamily: "Poppins-Regular !important",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: border ? border : "0.5px solid #000000",
          },
          ".css-1jy569b-MuiFormLabel-root-MuiInputLabel-root": {
            transform: transform ? transform : "translate(14px, -2px) scale(1)",
          },
          " & label.Mui-focuse": {
            color: "#000000",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#000000",
            },
          },
          "& input::placeholder": {
            color: "#000000",
            fontSize: 12,
            opacity: 0.8,
          },

          ...(props.blackDisabled && props.disabled && {
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'black', // Fallback for text color
              WebkitTextFillColor: 'black', // Ensures black text in Chrome/Firefox
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black !important', // Custom black border color when disabled
            },
          }),

        }}
        name={name}
        autoComplete="off"
        placeholder={placeholder}
        fullWidth={true}
        endAdornment={rightIcon ? rightIconElement : undefined}
        multiline={multiline ? multiline : false}
        onChange={onChange}
        minRows={props.minRows}
        value={value}
      />
      {props.helperText && (
        <Typography mt={"6px"} fontSize={"12px"} color={"red"}>
          {helperText}
        </Typography>
      )}
    </>
  );
});

export default CustomInput;
