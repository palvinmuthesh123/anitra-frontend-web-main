import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const InsuranceForm = (props) => {
  const { currentState = {} } = props;

  const schema = yup.object({}).required();

  const getEditUserDetails = (isEdit, currentState) => {
    return {
      animalInsurance: currentState.animalInsurance,
      insuranceNo: currentState.insuranceNo,
      insuranceValue: currentState.insuranceValue,
      startDate: currentState.startDate,
      endDate: currentState.endDate,
      company: currentState.company,
      agentName: currentState.agentName,
    };
  };

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(props?.isEdit, currentState),
  });

  const onSubmit = (data) => {
    console.log(data);
    // const formValues = getValues();
    // console.log("getValues", formValues);
    // const payload = {};

    // apiRequest({
    //   url: `animal/update${animalId}`,
    //   data: payload,
    //   method: "PUT",
    // })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert(err?.response?.data?.message, "error");
    //   });
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
                name="animalInsurance"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Animal Insurance"}
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
                name="insuranceNo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Insurance No."}
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
                name="insuranceValue"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Insurance Value"}
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
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Start Date"}
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
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"End Date"}
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
                name="company"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Company"}
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
                name="agentName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Agent Name"}
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
export default InsuranceForm;
