import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const BreedDetailsForm = (props) => {
  const { currentState = {} } = props;

  const schema = yup
    .object({
      noOfBirths: yup.string().required("No. of births is required"),
      calvingOptions: yup.string().required("Calving Optionst is required"),
      milking: yup.string().required("Milking is required"),
      milkingQuantity: yup.string().required("Avg Milk (Ltr) is required"),
    })
    .required();

  const getEditUserDetails = (isEdit, currentState) => {
    return {
      noOfBirths: currentState.noOfBirths,
      calvingOptions: currentState.calvingOptions,
      milking: currentState?.milking === false ? "No" : "Yes",
      milkingQuantity: currentState?.milkingQuantity,
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
                name="noOfBirths"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"No. of births"}
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
                name="calvingOptions"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Calving Options"}
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
                name="milking"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Milking"}
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
                name="milkingQuantity"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Milking Quantity (Ltr)"}
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
export default BreedDetailsForm;
