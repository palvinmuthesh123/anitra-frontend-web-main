import React from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Typography } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const CustomDatePicker = (props) => {
  const {
    label,
    onChange,
    value,
    feild,
    error,
    ref,
    placeholder,
    maxDate,
    minDate,
    width,
    helperText,
    borderRadius,
    ...field
  } = props;

  const labelStyle = {
    fontFamily: "MetropolisSemiBold",
    fontSize: 13,
    color: "black",
  };

  return (
    <>
      <p style={labelStyle}>{props.labelText}</p>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          {...field}
          format="DD-MM-YYYY"
          minDate={props.minDate}
          maxDate={props.maxDate}
          value={value || new Date()}
          disableFuture={props.disableFuture}
          name={props.name}
          onChange={onChange}
          label={label}
          disablePast={props.disablePast}
          sx={{
            width: "100%",
            borderColor: "red",
            "& .MuiOutlinedInput-root": {
              borderRadius: props.borderRadius ? props.borderRadius : "",
              width: "100%",
              "& fieldset": {
                borderColor: "#000000",
              },

              "&:hover fieldset": {
                borderColor: "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000000",
              },

              "& .MuiPickersDay-daySelected": {
                border: "2px solid red",
              },

              ".MuiOutlinedInput-input": {
                padding: "7px",

                fontSize: "14px !important",
              },

              ".MuiInputBase-root-MuiOutlinedInput-root": {
                fontSize: "12px",
                borderColor: "#000000",
              },
            },
            ".MuiInputLabel-root": {
              fontSize: "12px",
              top: "-5px",
              color: "#000000",
              opacity: 0.8,
            },
            ".MuiInputBase-input-MuiOutlinedInput-input": {
              fontSize: "14px !important",
            },
          }}
          renderInput={(params) => (
            <TextField
              sx={{
                width: "100%",
              }}
              {...field}
              {...params}
              size={"small"}
              error={error}
            />
          )}
        />
      </LocalizationProvider>

      {props.helperText && (
        <Typography mt={"6px"} fontSize={"12px"} color={"red"}>
          {helperText}
        </Typography>
      )}
    </>
  );
};

export default CustomDatePicker;
