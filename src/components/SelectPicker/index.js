import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { inputLabelClasses } from "@mui/material/InputLabel";

import { Typography, FormControl, InputLabel } from "@mui/material";

const SelectPicker = React.forwardRef((props, ref) => {
  const {
    labelText,
    helperText,
    label,
    placeholder,
    options,
    selectValue,
    placeholderText,
    isFormField = true,
    ...field
  } = props;

  const labelStyle = {
    fontFamily: "MetropolisSemiBold",
    fontSize: 13,
    color: "black",
  };

  return (
    <>
      {Boolean(labelText?.length) && <p style={labelStyle}>{labelText}</p>}
      {isFormField && field && (
        <>
          <FormControl size="small" fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: "#000000",
                fontSize: "12px",

                [`&.${inputLabelClasses.shrink}`]: {
                  color: "#000000",
                  fontSize: "15px",
                  top: "0px",
                },
              }}
            >
              {placeholder}
            </InputLabel>
            <Select
              {...field}
              label={placeholder}
              InputLabel
              onChange={props.onChange}
              name={props.name}
              multiline={props.multiline}
              fullWidth
              displayEmpty
              sx={{
                // borderRadius: props.borderRadius ? props.borderRadius : 25,
                borderColor: `#9DA2AB`,
                borderWidth: 1,
                width: "100%",
                color: "#9DA2AB",
                fontSize: "12px",
                "& .MuiSelect-outlined.MuiInputBase-input": {
                  color: "black",
                },
                "& label.Mui-focused": {
                  color: "#000000",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#000000",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000",
                },
                "& label.Mui-focused.MuiInputLabel-root": {
                  bgcolor: "black",
                },
                ".MuiSelect-select": {
                  padding: props.padding ? props.padding : "9px !important",
                },

                "& input::placeholder": {
                  color: "#000000",
                  fontSize: 12,
                  opacity: 0.8,
                },
              }}
            >
              {options?.map((option, index) => (
                <MenuItem key={index} value={option?.value}>
                  {option?.name}
                </MenuItem>
              ))}
              {props.defaultOption && (
                <MenuItem disabled sx={{ fontSize: "14px" }}>
                  {props.defaultOption}
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {Boolean(helperText?.length) && (
            <Typography mt={"6px"} fontSize={"12px"} color={"red"}>
              {helperText}
            </Typography>
          )}
        </>
      )}
    </>
  );
});

export default SelectPicker;
