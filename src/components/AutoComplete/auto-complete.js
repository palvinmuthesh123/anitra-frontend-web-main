import React from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const CustomAutoComplete = (props) => {
  const filter = createFilterOptions();

  const {
    placeholder,
    disabled,
    multiline,
    placeholderColor,
    placeholderColorOpacity,
    placeholderSize,
    defaultValue,
    label,
    multiple,
    onChange,
    value,
    singleSelection,
    ref,
    error,
    addText,
    limitTags,
    ...field
  } = props;

  const styledAutoComplete = {
    "& .MuiFormLabel-root:not(.MuiInputLabel-shrink)": {
      fontSize: "12px",
      top: "-7px",
    },
    "& .MuiFormLabel-root": {
      color: "#000000",
      opacity: "0.8",
    },
    "& .MuiButtonBase-root.MuiChip-root": {
      borderRadius: props.borderRadius ? props.borderRadius : "5px",
      margin: "0px",
      backgroundColor: "#FB8842",
      color: "#ffff",
      "& svg": {
        color: "#ffff",
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: props.borderColor ? props.borderColor : "white",
        borderRadius: props.borderRadius ? props.borderRadius : "0px",
      },
      "&:hover fieldset": {
        borderColor: props.borderColor ? props.borderColor : "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: props.borderColor ? props.borderColor : "white",
      },
      "& .MuiInputBase-input": {
        fontSize: "12px",
        padding: "0px !important",
      },
      "& input::placeholder": {
        color: placeholderColor ? placeholderColor : "#000000",
        fontSize: placeholderSize ? placeholderSize : 12,
        opacity: placeholderColorOpacity ? placeholderColorOpacity : 0.8,
      },
    },
    ".MuiOutlinedInput-root ": {
      padding: props.padding ? props.padding : "9px",
    },
    ".MuiButtonBase-root-MuiChip-root": {
      padding: "10px 0px",
      height: "0px",
    },
    // width: props.width ? props.width : "320px",

    "& .MuiAutocomplete-root:hover": {
      backgroundColor: props.backgroundColor
        ? props.backgroundColor
        : "transparent",
      borderColor: "red",
    },
    ".css-x6g01x-MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
      {
        padding: "0px",
      },
    ".MuiFormHelperText-root": {
      marginLeft: "0px !important",
    },
  };

  const getAddCustomTextOpt = (multiple = false) => {
    const addCustomTextOpt = addText
      ? {
          filterOptions: (options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) =>
              typeof option === "object"
                ? inputValue === option?.title
                : inputValue === option
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push(
                multiple ? { title: inputValue, value: inputValue } : inputValue
              );
            }
            return filtered;
          },
          getOptionLabel: (option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              const updatedOption = option?.replace("Add ", "");
              return updatedOption;
            }
            // Add "xxx" option created dynamically
            if (option?.inputValue) {
              return option?.inputValue;
            }
            // Regular option
            return typeof option === "object"
              ? option?.title || ""
              : option?.toString();
          },
        }
      : {};

    return addCustomTextOpt;
  };

  let autoCompleteProps = {};
  if (singleSelection) {
    autoCompleteProps = {
      renderOption: (props, option) => <li {...props}>{option}</li>,
      ...getAddCustomTextOpt(),
    };
  } else {
    autoCompleteProps = {
      multiple,
      getOptionLabel: (option) => option?.title || "",
      ...getAddCustomTextOpt(true),
      ...(limitTags && {
        limitTags,
      }),
    };
  }

  return (
    <Autocomplete
      {...autoCompleteProps}
      disabled={disabled}
      sx={styledAutoComplete}
      multiple={multiple}
      defaultValue={defaultValue}
      options={props.options}
      isOptionEqualToValue={(option, value) => option?.value === value?.value}
      onChange={(e, newValue) => props.handleChange(e, newValue)}
      onInputChange={(e, value) => props.onInputChange(e, value)}
      value={value}
      noOptionsText={props.noOptionsText}
      renderInput={(params) => (
        <TextField
          {...field}
          {...params}
          error={error}
          helperText={props.helperText}
          inputRef={ref}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default CustomAutoComplete;
