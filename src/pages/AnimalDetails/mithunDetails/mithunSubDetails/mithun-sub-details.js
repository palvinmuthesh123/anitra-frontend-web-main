import React from "react";
import { Box, Grid } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../../../../components/Input";
import { apiRequest } from "../../../../services/api-request";

const BreedingMatingDetails = (props) => {
  const { userDetails } = props;

  const { animalId } = props;

  const schema = yup
    .object({
      bodyWeight: yup.string().required("Body Weight is required"),
      teethCount: yup.string().required("Teeth Count is required"),
      hornDistance: yup.string().required("Horn Distance is required"),
      noOfRings: yup.string().required("No of Rings is required"),
    })
    .required();

  const getEditUserDetails = (userDetails) => ({
    breeding: userDetails?.details?.breeding_type,
    fatheredBy: userDetails?.details?.farthered_by,
  });

  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(userDetails),
  });

  const onSubmit = (data) => {
    const payload = {};

    apiRequest({
      url: `animal/update${animalId}`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        alert(err?.response?.data?.message, "error");
      });
  };

  return (
    <>
      <Box m={"20px 16px 16px 0px"}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            alignItems={"baseline"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="breeding"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Breeding"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      disabled={true}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="fatheredBy"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Feathered By"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      disabled={true}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};
export default BreedingMatingDetails;
