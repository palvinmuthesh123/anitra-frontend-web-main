import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { apiRequest } from "../../../services/api-request";

const AdditionalInfoForm = (props) => {
  const { animalId, currentState = {} } = props;

  const schema = yup
    .object({
      bodyWeight: yup.string().required("Body Weight is required"),
      teethCount: yup.string().required("Teeth Count is required"),
      hornDistance: yup.string().required("Horn Distance is required"),
      noOfRings: yup.string().required("No of Rings is required"),
    })
    .required();

  const getEditUserDetails = (isEdit, currentState) => {
    return {
      bodyWeight: currentState.bodyWeight,
      teethCount: currentState.teethCount,
      hornDistance: currentState.hornDistance,
      noOfRings: currentState.noOfRings,
    };
  };

  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(props?.isEdit, currentState),
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
                name="bodyWeight"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Body Weight in (Kg)"}
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
                name="teethCount"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Teeth Count"}
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
                name="hornDistance"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Horn Distance"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    disabled={true}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={4} mt={1}>
            <Box>
              <Controller
                name="noOfRings"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"No of Rings"}
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
    </>
  );
};
export default AdditionalInfoForm;
