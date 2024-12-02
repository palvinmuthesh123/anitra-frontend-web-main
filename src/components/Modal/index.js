import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Colors } from "../../constants/Colors";
import { Typography, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: Colors.white,
  boxShadow: "0px 0px 48px #00183414",
  p: "20px",
  borderRadius: "14px",
  width: "565px",
};

export default function CustomModal(props) {
  const { handleModalClose, openModal } = props;

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleModalClose();
    }
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="anitra-modal"
        aria-describedby="anitra-modal-description"
        disableEscapeKeyDown={true}
        disableRestoreFocus={true}
      >
        <Box sx={style}>
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                fontSize={18}
                color={Colors.textColor}
              >
                {props.title}
              </Typography>
            </Grid>
            <Grid item>
              <CloseIcon
                onClick={handleModalClose}
                style={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
          {props.children}
        </Box>
      </Modal>
    </div>
  );
}
