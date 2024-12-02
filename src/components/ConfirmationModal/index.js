import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = (props) => {
  const { children, open, onClose, title, fullScreen } = props;

  return (
    <>
      <Dialog
        maxWidth={props.maxWidth ? props.maxWidth : null}
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {title}

          <IconButton
            aria-label="onClose"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              borderRadius: props.borderRadius,
              width: props.width,
              height: props.height ? props.height : "auto",
            }}
          >
            {children}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomDialog;
