import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";

const VaccinationForm = (props) => {
  const { animalId, currentState = {} } = props;

  return (
    <>
      <Grid
        container
        alignItems={"baseline"}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {currentState?.vaccines?.map((vaccine) => (
          <Grid item xs={4} mt={"10px"}>
            <Box>
              <CustomInput
                value={vaccine?.active === false ? "No" : "Yes"}
                type={"text"}
                inputLabel={vaccine?.display_name}
                disabled={true}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default VaccinationForm;
