export const StyledAutoComplete = {
  width: "100% !important",
  "& .MuiFormLabel-root:not(.MuiInputLabel-shrink)": {
    fontSize: "12px",
    top: "-7px",
  },
  "& .MuiFormLabel-root": {
    color: "#000000",
    opacity: "0.8",
  },
  "& .MuiButtonBase-root.MuiChip-root": {
    borderRadius: "5px",
    margin: "0px",
    backgroundColor: "#FB8842",
    color: "#ffff",
    "& svg": {
      color: "#ffff",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000000",
      borderRadius: "5px",
    },

    "& .MuiInputBase-input": {
      fontSize: "12px",
      padding: "0px !important",
    },
    "& input::placeholder": {
      color: "#000000",
      fontSize: 12,
      opacity: 0.8,
    },
  },
  ".MuiOutlinedInput-root ": {
    padding: "9px",
  },
  ".MuiButtonBase-root-MuiChip-root": {
    padding: "10px 0px",
    height: "0px",
  },

  "& .MuiAutocomplete-root:hover": {
    backgroundColor: "transparent",
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
