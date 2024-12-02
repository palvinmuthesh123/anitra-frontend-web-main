import React from "react";
import { Box, Grid } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../../../../components/Input";
import { apiRequest } from "../../../../services/api-request";

const MithunInsuranceDetails = (props) => {
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
    animalInsurance:
      userDetails?.insurance_details?.is_insured === false ? "NO" : "Yes",
    insuranceNo: userDetails?.insurance_details?.number,
    insuranceValue: userDetails?.insurance_details?.value,
    startDate: userDetails?.insurance_details?.start_date,
    endDate: userDetails?.insurance_details?.end_date,
    company: userDetails?.insurance_details?.company_name,
    agentName: userDetails?.insurance_details?.agent_name,
    lastUpdated: "",
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
                      inputLabel={"Insurance No"}
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
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="lastUpdated"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Last Updated"}
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
export default MithunInsuranceDetails;
