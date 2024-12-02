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
  const [usertype, setUserType] = useState('');
  const [data, setData] = useState([
    {
      name: "Super Admin",
      value: "SUPER_ADMIN",
    },
    {
      name: "State Admin",
      value: "STATE_ADMIN",
    },
    {
      name: "District Admin",
      value: "DISTRICT_ADMIN",
    },
    {
      name: "Supervisor",
      value: "SUPERVISOR",
    }
  ])
  const { user } = useAppContext();

  const { currentState = {} } = props;

  const schema = yup
    .object({
      farmerName: yup.string().required("Name is required"),
      mobile: yup.string().required("Mobile number is required"),
      // address: yup.string().required("Address is required"),
      // selectState: yup.string().required("State is required"),
      // selectMandal: yup.string().required("Mandal is required"),
      // selectTribe: yup.string().required("Tribe is required"),
      // selectCommunity: yup.string().required("Community is required"),
      // district: yup.string().required("District is required"),
      // selectVillage: yup.string().required("Village is required"),
      // hamlet: yup.string().required("Hamlet is required"),
      // pincode: yup.string().required("Pincode is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum Six Characters required"),
      userType: yup.string().required("User Type is required"),
      // aadharCardNumber: yup.string().required("Aadhar Card is required"),
      email: yup.string().required("Email  is required"),
    })
    .required();

  useEffect(()=> {
    // getStates();
    // getDistricts();
  },[])

  const getStates = () => {
    // const URL = user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    // const method = user?.role?.code === "admin" ? "GET" : "POST";

    const URL = `master/states`
    const method = "GET"
  
    console.log(URL,method)

    apiRequest({
      url: URL,
      method: method,
    })
    .then((res) => {
      console.log(res, res.data.length, "OOOOOOOOOOOOOOOOOOOOO");
  
      // const statesList = res.data.map((state, index) => ({
      //   name: user?.role?.code === "admin" ? state.display_name : state.State,
      //   value: user?.role?.code === "admin" ? index : `${state.State}-${index}`,
      // }));

      const getStatesList = res?.data?.map((state) => {
      console.log(state, "OOOOONNNNN.................")
      ({
        name: state?.name,
        value: state?.id,
      })
    });

    var arr = []

    for(var i = 0; i < res?.data?.length; i++) {
      // arr.push({
      //   active: res?.data?[i].active,
      //   code: res?.data?[i].code,
      //   display_name: res?.data?[i].display_name,
      //   id: res?.data?[i].id,
      //   local_name: res?.data?[i].local_name,
      //   name: res?.data?[i].name
      // })
    }
  
      console.log(getStatesList, "LIST...............");
  
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
    const payload = {
      state_id: Number(stateName),
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

  const getEditUserDetails = (isEdit, currentState) => {
    console.log(isEdit, currentState, "HHHHHHHHHHHHHHH")
    if (!isEdit) {
      return {
        farmerName: "",
        mobile: "",
        email: ""
      };
    } else {
      return {
        farmerName: currentState?.name,
        mobile: currentState?.mobile,
        email: currentState?.email,
      };
    }
  };

  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(props?.isEdit, currentState),
  });

  const [communityList, setCommunityList] = useState({
    data: [],
  });

  const onSubmit = (data) => {
    data.preventDefault();
    const formData = new FormData(data.target);

    if(Object.keys(currentState).length === 0) {

      let payload = {
        name: formData.get("farmerName"),
        email: formData.get("email"),
        mobile: formData.get("mobile"),
        password: formData.get("password")
      };

      let url = 'user/add-company-users'

      apiRequest({
        url: url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res, "RRRRRRRRRRRRRRRRRR");
          if (res?.success === false) {
            alert(res?.message);
          }
          if (res?.success === true) {
            alert(res?.message);
          }
          props.getUsersByType();
          props.onCancel();
      })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
      })
    }
    else {

      let payload = {
        user_id: currentState.user_id,
        mobile: formData.get("mobile"),
        name: formData.get("farmerName"),
        email: formData.get("email"),
      };

      apiRequest({
        url: `user/updateCompanyUser`,
        data: payload,
        method: "PUT",
      })
        .then((res) => {
          console.log(res, "RRRRRRRRRRRRRRRRRR");
          if (res?.success === false) {
            alert(res?.message);
          }
          if (res?.success === true) {
            alert(res?.message);
          }
          props.getUsersByType();
          props.onCancel();
      })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
      })

    }

  };

  return (
    <>
      <Box sx={{ width: "100%", padding: "20px 0px 0px 0px" }}>
        <form onSubmit={onSubmit} autoComplete="off">
          <Grid
            container
            alignItems={"baseline"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Box>
                <Controller
                  name="farmerName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Name"}
                      type={"text"}
                      placeholder={"Enter Farmer Name"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Mobile"}
                      type={"number"}
                      placeholder={"Enter Mobile Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Email"}
                      type={"text"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
            {!props.isEdit ? <Grid item xs={6}>
              <Box>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Password"}
                      type={"text"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid> : null}
          </Grid>

          <Grid
            container
            alignItems={"end"}
            justifyContent={"flex-end"}
            mt={2}
            gap={2}
          >
            <Grid item>
              <CustomButton
                title={`Cancel`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={props?.onCancel}
                variant={"outlined"}
                width={130}
                height={34}
              />
            </Grid>
            <Grid item>
              <CustomButton
                variant={"contained"}
                title={`Submit`}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                borderColor={Colors.headerColor}
                textFontSize={14}
                type={"submit"}
                width={130}
                height={34}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AddEditUser;
