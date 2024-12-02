import React from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const FamilyBreedAndGeneticsForm = (props) => {
  const { currentState = {} } = props;

  const schema = yup
    .object({
      thoutArtificialInseminated: yup
        .string()
        .required("Thout Artificial Inseminated is required"),
      fatheredBy: yup.string().required("Fathered by(Semen) is required"),
      motheredBy: yup.string().required("Mothered by is required"),
    })
    .required();

  const getEditUserDetails = (currentState) => {
    return {
      thoutArtificialInseminated: currentState.thoutArtificialInseminated,
      fatheredBy: currentState.fatheredBy,
      motheredBy: "",
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
                name="thoutArtificialInseminated"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Thought Artificial Inseminated"}
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
                    inputLabel={"Fathered by(Semen)"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    disabled={true}
                  />
                )}
              />
            </Box>
          </Grid>
          {/* <Grid item xs={4}>
            <Box>
              <Controller
                name="motheredBy"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Mothered by"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    disabled={true}
                  />
                )}
              />
            </Box>
          </Grid> */}
        </Grid>
      </form>
    </>
  );
};
export default FamilyBreedAndGeneticsForm;
