import React from "react";
import {
  Box,
  Grid,
} from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";

const AddState = (props) => {
  
  const { isEdit, currentStateList } = props;

  const { user } = useAppContext();

  const schema = yup
    .object({
      name: yup.string().required("State name is required"),
      ...(user?.role?.code === "admin" && {
        localName: yup.string().required("Local name is required"),
        code: yup.string().required("Code is required"),
      }),
    })
    .required();

  const getEditUserDetails = (isEdit, currentStateList) => {
    if (!isEdit) {
      return { name: "", localName: "", code: "" };
    } else {
      return {
        name:
          currentStateList?.display_name ||
          currentStateList?.display_name?.State,
        localName: currentStateList?.local_name,
        code: currentStateList?.code,
      };
    }
  };

  const { handleSubmit, control,  getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(isEdit, currentStateList),
  });

  const onSubmit = (data) => {
    if (isEdit && currentStateList?.display_name) {
      const formData = getValues();
      const payload = {
        name: formData?.name,
        local_name: formData?.localName,
        code: formData?.code,
      };
      const mithunPayload = {
        curr_name: currentStateList?.display_name,
        new_name: data?.name,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/update-state/${currentStateList?.id}`
          : "madmin/master/update-state";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "PUT",
      })
        .then((res) => {
          props.onClickModalClose(true);
          props.getStates()
          if (res?.success === true) {
            alert("States added successfully");
          }
          if (res?.success === false) {
            alert(res?.message);
          }
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        name: data.name,
        local_name: data.localName,
        code: data.code,
      };
      const mithunPayload = {
        name: data.name,
      };
      const URL =
        user?.role?.code === "admin"
          ? "master/add-state"
          : "madmin/master/add-state";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "POST",
      })
        .then((res) => {
          props.onClickModalClose(true);
          props.getStates()
          if (res?.success === true) {
            alert("States added successfully");
          }
          if (res?.success === false) {
            alert(res?.message);
          }
        })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
        });
    }
  };

  return (
    <>
      {props.loader ? (
        <>{"loading"}</>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            mt={"10px"}
            gap={3}>
            <Grid item width={user?.role?.code === "admin" ? "45%" : "80%"}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter State Name"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            {user?.role?.code === "admin" && (
              <Grid item width={"45%"}>
                <Controller
                  name="localName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Local name"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
          <Grid
            container
            alignItems={"flex-start"}
            justifyContent={user?.role?.code === "admin" ? "center" : "end"}
            mt={3}
            width={"100%"}
            gap={3}>
            {user?.role?.code === "admin" && (
              <Grid item width={user?.role?.code === "admin" ? "45%" : "80%"}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Code"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item width={"45%"}>
              <Box
                display={"flex"}
                alignItems={"end"}
                justifyContent={"flex-end"}
                width={"100%"}
                gap={"12px"}>
                <Box width={"48%"}>
                  <CustomButton
                    variant={"outlined"}
                    title={`Cancel`}
                    handleButtonClick={props.onClickModalClose}
                    backgroundColor={Colors.white}
                    textColor={Colors.headerColor}
                    width={"100%"}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                  />
                </Box>
                <Box width={"48%"}>
                  <CustomButton
                    title={`Save`}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={"100%"}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                    type={"submit"}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default AddState;
