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

const AddDistrict = (props) => {
  const { isEdit, currentDistrict } = props;

  const { user } = useAppContext();

  const schema = yup
    .object({
      districtName: yup.string().required("District name is required"),
      selectState: yup.string().required("Select State is required"),
    })
    .required();

  const getEditDistricts = (isEdit, currentDistrict) => {
    if (!isEdit) {
      return { districtName: "", selectState: "" };
    } else {
      return {
        districtName: currentDistrict?.data?.name,
        selectState: currentDistrict?.data?.stateValue,
      };
    }
  };

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditDistricts(isEdit, currentDistrict),
  });

  const [statesList, setStatesList] = useState({
    data: [],
    loader: false,
  });

  useEffect(() => {
    getStates();
  }, []);

  const getStates = () => {
    setStatesList({ loader: true });
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
          setStatesList({ data: getStatesList, loader: false });
        } else {
          const getStatesList = res?.data?.map((state) => ({
            name: state?.State,
            value: state?._id,
          }));
          setStatesList({ data: getStatesList, loader: false });
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const onSubmit = (data) => {
    if (isEdit && currentDistrict) {
      const payload = {
        name: data.districtName,
        local_name: data.districtName,
        num_id: String(data?.selectState),
      };
      const mithunPayload = {
        new_name: data?.districtName,
        curr_name: currentDistrict?.data?.name,
        state_name: currentDistrict?.data?.state_name,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/update-district/${currentDistrict?.data?.value}`
          : "madmin/master/update-district";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "PUT",
      })
        .then((res) => {
          props.onClose();
          props.getUserDistricts();
          if (res?.status === "success") {
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
        name: data.districtName,
        local_name: data.districtName,
        state_id: Number(data?.selectState),
      };

      const mithunPayload = {
        district_name: data?.districtName,
        state_name: data?.selectState,
      };
      const URL =
        user?.role?.code === "admin"
          ? "master/add-district"
          : "madmin/master/add-district";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "POST",
      })
        .then((res) => {
          if (res?.status === "success") {
            alert("Districts added successfully");
          } else {
            alert(res?.message);
          }
          props.onClose();
          props.getUserDistricts();
        })
        .catch((err) => {
          console.log(err);
          alert(err?.message, "error");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container mt={"10px"} gap={2} display={"flex"} flexDirection={""}>
          <Box display={"flex"} gap={4}>
            <Grid item width={200}>
              <Controller
                name="districtName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter District Name"}
                    error={!!error}
                    helperText={error ? error?.message : ""}
                  />
                )}
              />
            </Grid>

            <Grid item width={200}>
              <Controller
                name="selectState"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    {...field}
                    borderRadius={10}
                    width={300}
                    options={statesList.data}
                    placeholder={"Select state"}
                    error={!!error}
                    helperText={error ? error?.message : ""}
                  />
                )}
              />
              {/* <CustomSelectPicker placeholder={"Select state"}  width={300}/> */}
            </Grid>
          </Box>
        </Grid>
        <Grid item width={"100%"}>
          <Box
            display={"flex"}
            alignItems={"end"}
            justifyContent={"flex-end"}
            width={"100%"}
            mt={"24px"}
            gap={"12px"}
          >
            <Box width={"25%"}>
              <CustomButton
                variant={"outlined"}
                title={`Cancel`}
                handleButtonClick={props.onClose}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
              />
            </Box>
            <Box width={"25%"}>
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
      </form>
    </>
  );
};

export default AddDistrict;
