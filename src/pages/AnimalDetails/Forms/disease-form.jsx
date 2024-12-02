import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";

const DiseaseForm = (props) => {
  const { currentState = {} } = props;

  return (
    <>
      <Grid
        container
        alignItems={"baseline"}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {currentState?.diseases?.map((disease) => (
          <Grid item xs={4} mt={"10px"}>
            <Box>
              <CustomInput
                value={disease?.active === false ? "No" : "Yes"}
                type={"text"}
                inputLabel={disease?.display_name}
                disabled={true}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default DiseaseForm;
