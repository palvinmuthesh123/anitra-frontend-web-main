import React, { useState, useEffect } from "react";
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

const AddVillages = (props) => {
  const { currentVillage = {}, isEdit = false } = props;
  const { user } = useAppContext();
  const schema = yup
    .object({
      villageName: yup.string().required("Village Name is required"),
      selectState: yup.string().required("State is required"),
      selectMandal: yup.string().required("State is required"),
      selectDistrict: yup.string().required("district is required"),
    })
    .required();


  const getEditMandals = (isEdit, currentVillage) => {
    if (!isEdit) {
      return {
        villageName: "",
        selectState: "",
        selectDistrict: "",
        selectMandal: "",
      };
    } else {
      return {
        villageName: currentVillage?.name,
        selectState: currentVillage?.state_name || 25,
        selectDistrict:
          currentVillage?.district_id || currentVillage?.district_name,
        selectMandal: currentVillage?.mandal_id,
      };
    }
  };

  const { handleSubmit, control, getValues,  watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditMandals(isEdit, currentVillage),
  });

  const [statesList, setStatesList] = useState([]);

  const [DistrictList, setDistrictList] = useState([]);

  const [mandalList, setMandalList] = useState([]);

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (!isEdit && !currentVillage) {
      if (watch("selectState")) {
        getDistricts(watch("selectState"));
      }
    } else if (currentVillage?.state_id || 25) {
      if (watch("selectState")) {
        getDistricts(watch("selectState"));
      }
    }
  }, [watch("selectState")]);

  useEffect(() => {
    if (watch("selectDistrict")) {
      getMandalsList(watch("selectDistrict"));
    }
  }, [watch("selectDistrict")]);

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

    const mithunPayload = {
      state_name: stateName,
      limit: 5000,
    };

    const payload = {
      state_id: stateName,
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
          setDistrictList(getDistricts);
        } else {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.District,
            value: district?._id,
          }));
          setDistrictList(getDistricts);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getMandalsList = (districtName) => {
    const URL =
      user?.role?.code === "admin" ? `master/mandals` : `madmin/master/mandals`;

    const payload = {
      district_id: districtName,
      limit: 5000,
    };
    const mithunPayload = {
      district_name: districtName,
      limit: 5000,
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const modifiedMandalList = res?.data?.map((mandal) => ({
            name: mandal?.name,
            value: mandal?.id,
          }));
          setMandalList(modifiedMandalList);
        } else {
          const modifiedMandalList = res?.data?.map((mandal) => ({
            name: mandal?.Block,
            value: mandal?.Block,
          }));
          setMandalList(modifiedMandalList);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const onSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.districtName,
        local_name: data.districtName,
        state_id: 2,
      };
      const { villageName, selectState, selectDistrict, selectMandal } =
        getValues();
      const mithunPayload = {
        new_name: villageName,
        curr_name: currentVillage?.name,
        state_name: selectState,
        district_name: selectDistrict,
        mandal_name: selectMandal,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/update-village${currentVillage?.id}`
          : "madmin/master/update-village";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "PUT",
      })
        .then((res) => {
          props.onClose();
          props.getVillagesList();
          if (res?.status === "success") {
            alert("Village updated successfully");
          }
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const URL =
        user?.role?.code === "admin"
          ? `master/add-village`
          : `madmin/master/add-village`;

      const payload = {
        name: data.villageName,
        local_name: data.villageName,
        mandal_id: Number(data.selectMandal),
      };

      const mithunPayload = {
        village_name: data.villageName,
        mandal_name: data.selectMandal,
        district_name: data.selectDistrict,
        state_name: data.selectState,
      };
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "POST",
      })
        .then((res) => {
          props.onClose();
          props.getVillagesList();
          if (res?.status === "success") {
            alert("village added successfully");
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
                  name="villageName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Village Name"}
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
                      options={statesList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select State"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
                {/* <CustomSelectPicker placeholder={"Select state"}  width={300}/> */}
              </Grid>
            </Box>

            <Grid
              display={"flex"}
              gap={"10px"}
              width={"100%"}
              marginTop={"23px"}
            >
              <Grid item width={"100%"}>
                <Controller
                  name="selectDistrict"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={DistrictList}
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

              <Grid item width={"100%"}>
                <Controller
                  name="selectMandal"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={mandalList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Mandal"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
                {/* <CustomSelectPicker placeholder={"Select state"}  width={300}/> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"flex-end"}
            mt={"20px"}
            gap={"10px"}
          >
            <Grid item>
              <CustomButton
                title={`Cancel`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={130}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                variant={"outlined"}
                handleButtonClick={props.onClose}
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

export default AddVillages;
