import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import { useAppContext } from "../../context/AppContext";

const AddEditMandal = (props) => {
  const { currentMandal = {}, isEdit } = props;
  const { user } = useAppContext();

  const schema = yup
    .object({
      mandalName: yup.string().required("Mandal name is required"),
      selectState: yup.string().required("State is required"),
      selectDistrict: yup.string().required("District  is required"),
    })
    .required();

  const getEditMandals = (isEdit, currentMandal) => {
    if (!isEdit && !currentMandal) {
      return { mandalName: "", selectState: "", selectDistrict: "" };
    } else {
      return {
        mandalName: currentMandal?.name,
        selectState: currentMandal?.state_id || 25,
        selectDistrict:
          currentMandal?.districtID || currentMandal?.district_name,
      };
    }
  };

  const { handleSubmit, control, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditMandals(isEdit, currentMandal),
  });

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (watch("selectState")) {
      getDistricts(watch("selectState"));
    }
  }, [watch("selectState")]);

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const getStates = () => {
    const URL =
      user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    apiRequest({
      url: URL,
      method: user?.role?.code === "admin" ? "GET" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getStatesList = res?.data?.map((state) => ({
            name: state?.name,
            value: state?.id,
          }));
          setStatesList(getStatesList);
        } else {
          const getStatesList = res?.data?.map((state) => ({
            name: state?.State,
            value: state?._id,
          }));
          setStatesList(getStatesList);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getDistricts = (stateName) => {
    const URL =
      user?.role?.code === "admin"
        ? `master/districts`
        : `madmin/master/districts`;
    const payload = {
      state_id: watch("selectState")?.name?.props.value,
      limit: 5000,
    };
    const mithunPayload = {
      state_name: stateName,
      limit: 5000,
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.name,
            value: district?.id,
          }));
          setDistrictsList(getDistricts);
        } else {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.District,
            value: district?._id,
          }));
          setDistrictsList(getDistricts);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const onSubmit = (data) => {
    if (isEdit && currentMandal) {
      const payload = {
        name: data?.mandalName,
        local_name: data?.mandalName,
      };
      const { mandalName, selectState, selectDistrict } = getValues();
      const mithunPayload = {
        new_name: mandalName,
        curr_name: currentMandal?.name,
        state_name: selectState,
        district_name: selectDistrict,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/update-mandal/${currentMandal?.value}`
          : "madmin/master/update-mandal";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "PUT",
      })
        .then((res) => {
          props.onClose();
          props.getUserMandals();
          if (res?.status === true) {
            alert("Districts added successfully");
          } else {
            alert(res?.message);
          }
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        name: data.mandalName,
        local_name: data.mandalName,
        district_id: 5,
      };
      const mithunPayload = {
        mandal_name: data.mandalName,
        district_name: data.selectDistrict,
        state_name: data.selectState,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/add-mandal`
          : `madmin/master/add-mandal`;

      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "POST",
      })
        .then((res) => {
          props.onClose();
          props.getUserMandals();
          if (res?.status === true) {
            alert("Districts added successfully");
          } else {
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
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container mt={"10px"} gap={2} width={"100%"}>
          <Grid item width={"100%"}>
            <Box display={"flex"} gap={"10px"} width={"100%"}>
              <Grid item width={"100%"}>
                <Controller
                  name="mandalName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Mandal Name"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item width={"100%"}>
                <Controller
                  name="selectState"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      {...field}
                      onChange={(value, name) =>
                        field.onChange({ name, value })
                      }
                      options={statesList}
                      labelText={""}
                      type={"text"}
                      value={field.value}
                      placeholder={"Select state"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Box>

            <Box>
              <Grid item width={"50%"} marginTop={"23px"}>
                <Controller
                  name="selectDistrict"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={districtsList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select District"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"flex-end"}
            mt={"24px"}
            gap={"10px"}
          >
            <Grid item>
              <CustomButton
                title={`Cancel`}
                handleButtonClick={props.onClose}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={130}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                variant={"outlined"}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Submit`}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={130}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                type={"submit"}
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditMandal;
