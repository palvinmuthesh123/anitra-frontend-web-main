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

const AddEditUser = (props) => {
  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [usertype, setUserType] = useState("");
  const [data, setData] = useState([
    { name: "Super Admin", value: "SUPER_ADMIN" },
    { name: "State Admin", value: "STATE_ADMIN" },
    { name: "District Admin", value: "DISTRICT_ADMIN" },
    { name: "Supervisor", value: "SUPERVISOR" },
  ]);
  const { user } = useAppContext();

  const { currentState = {} } = props;

  const schema = yup
    .object({
      // farmerName: yup.string().required("Name is required"),
      // mobile: yup.string().required("Mobile number is required"),
      // password: yup
      //   .string()
      //   .required("Password is required")
      //   .min(6, "Minimum Six Characters required"),
      // userType: yup.string().required("User Type is required"),
      // email: yup.string().required("Email is required"),
      companyName: yup.string().required("Company Name is required"),
      companyCategory: yup.string().required("Company Category is required"),
      companyContact: yup
        .string()
        .required("Company Contact is required")
        .matches(/^[0-9]+$/, "Contact must be a number")
        .min(10, "Minimum 10 digits required")
        .max(15, "Maximum 15 digits allowed"),
      companyAddress: yup.string().required("Company Address is required"),
    })
    .required();

  useEffect(() => {
    getStates();
    getDistricts();
  }, []);

  const getStates = () => {
    const URL = `master/states`;
    const method = "GET";

    apiRequest({ url: URL, method: method })
      .then((res) => {
        const getStatesList = res?.data?.map((state) => ({
          name: state?.name,
          value: state?.id,
        }));
        setStatesList(getStatesList);
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
    const payload = { state_id: Number(stateName), limit: 5000 };
    apiRequest({ url: URL, method: "POST", data: payload })
      .then((res) => {
        const getDistricts = res?.data?.map((district) => ({
          name: district?.name,
          value: district?.id,
        }));
        setDistrictList(getDistricts);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // farmerName: "",
      // mobile: "",
      // password: "",
      // userType: "",
      // email: "",
      companyName: "",
      companyCategory: "",
      companyContact: "",
      companyAddress: "",
    },
  });

  const onSubmit = (data) => {
    const payload = {
      // user_type: data?.userType,
      // mobile: data?.mobile,
      // password: data?.password,
      // name: data?.farmerName,
      // email: data?.email,
      companyName: data?.companyName,
      companyCategory: data?.companyCategory,
      companyContact: data?.companyContact,
      companyAddress: data?.companyAddress,
    };

    let url = "";
    switch (data?.userType) {
      case "SUPER_ADMIN":
        url = "user/add-super-admin";
        break;
      case "STATE_ADMIN":
        url = "user/add-state-admin";
        break;
      case "DISTRICT_ADMIN":
        url = "user/add-district-admin";
        break;
      case "SUPERVISOR":
        url = "user/add-supervisor";
        break;
      default:
        break;
    }

    apiRequest({ url: url, data: payload, method: "POST" })
      .then((res) => {
        alert(res?.message);
        props.getUsersByType();
        props.onCancel();
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  return (
    <Box sx={{ width: "100%", padding: "20px 0px 0px 0px" }}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container alignItems={"baseline"} rowSpacing={1} columnSpacing={2}>
          {/* User Type */}
          {/* <Grid item xs={6}>
            <Controller
              name="userType"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SelectPicker
                  {...field}
                  options={data}
                  placeholder={"Select User Type"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid> */}

          {/* Name */}
          {/* <Grid item xs={6}>
            <Controller
              name="farmerName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Name"}
                  placeholder={"Enter Name"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid> */}

          {/* Password */}
          {/* <Grid item xs={6}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Password"}
                  placeholder={"Enter Password"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid> */}

          {/* Mobile */}
          {/* <Grid item xs={6}>
            <Controller
              name="mobile"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Mobile"}
                  placeholder={"Enter Mobile Number"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid> */}

          {/* Email */}
          {/* <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Email"}
                  placeholder={"Enter Email"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid> */}

          {/* Company Name */}
          <Grid item xs={6}>
            <Controller
              name="companyName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Company Name"}
                  placeholder={"Enter Company Name"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>

          {/* Company Category */}
          <Grid item xs={6}>
            <Controller
              name="companyCategory"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Company Category"}
                  placeholder={"Enter Company Category"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>

          {/* Company Contact */}
          <Grid item xs={6}>
            <Controller
              name="companyContact"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Company Contact"}
                  placeholder={"Enter Company Contact"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>

          {/* Company Address */}
          <Grid item xs={6}>
            <Controller
              name="companyAddress"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  inputLabel={"Company Address"}
                  placeholder={"Enter Company Address"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent={"flex-end"} mt={2} gap={2}>
          <Grid item>
            <CustomButton
              title="Cancel"
              style={{ background: Colors.grey }}
              onClick={props.onCancel}
            />
          </Grid>
          <Grid item>
            <CustomButton title="Save" type="submit" />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEditUser;
