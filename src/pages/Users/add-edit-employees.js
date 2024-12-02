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
    getStates();
    getDistricts();
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
    var ty = data.findIndex(role => role.value === currentState.user_type)
    var states = statesList.filter(role => (role.value = currentState.select_state));
    if(Array.isArray(states)) {
      states = states && states[0] && states[0].name ? states[0]?.name : ""
    }
    else {
      states = states && states.name ? states.name : ""
    }
    console.log(states,"FFFFFSSSSSSSS")
    const role = user?.role?.code;
    if (!isEdit) {
      return {
        farmerName: "",
        mobile: "",
        selectState: "",
        district: "",
        idType: "",
      };
    } else {
      return {
        farmerName: currentState?.name,
        mobile: currentState?.mobile,
        address: currentState?.address,
        selectState: `${
          role === "admin" ? currentState?.select_state : ""
        }`,
        district:
          `${
            role === "admin" ? currentState?.districtId : ""
          }`,
        email: currentState?.email,
        userType: currentState.user_type
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

    console.log("RRRRRRRRRRRRRRRRRR");

    if(Object.keys(currentState).length === 0) {

      // var typ = data.filter(role => (role.name = usertype));

      let payload = {
        user_type: data?.userType,
        mobile: data?.mobile,
        password: data?.password,
        name: data?.farmerName,
        email: data?.email,
        user_mobile: "9988776655"
      };

      let url = ''

      switch(data?.userType) {
        case "SUPER_ADMIN":
          url = 'user/add-super-admin'
          break;
        case "STATE_ADMIN":
          url = 'user/add-state-admin'
          break;
        case "DISTRICT_ADMIN":
          url = 'user/add-district-admin'
          break;
        case "SUPERVISOR":
          url = 'user/add-supervisor'
          break;
        default:
          
      }

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

      var typ = data.filter(role => (role.name = usertype));

      let payload = {
        user_type: data?.userType || typ,
        mobile: data?.mobile,
        name: data?.farmerName,
        email: data?.email
      };

      apiRequest({
        url: `user/updateAdmin`,
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            alignItems={"baseline"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Controller
                name="userType"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  // console.log(field, "FFF")
                  if(field && field.value) {
                    setUserType(field.value)
                  }
                  else
                  {

                  }
                  return (
                  <SelectPicker
                    {...field}
                    options={data}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select User Type"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}}
              />
            </Grid>
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
            {Object.keys(currentState).length === 0 ? <Grid item xs={6}>
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

            {((Object.keys(currentState).length != 0 && currentState.user_type!="SUPER_ADMIN") || (usertype != "" && usertype != "SUPER_ADMIN")) ? <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectState"
                  control={control}
                  render={({ field, fieldState: { error } }) => 
                  {
                    console.log(field, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
                    return (
                      <SelectPicker
                        options={statesList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select State"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )
                  }
                }
                />
              </Box>
            </Grid> : null}

            {((Object.keys(currentState).length != 0 && currentState.user_type!="SUPER_ADMIN" && currentState.user_type!="STATE_ADMIN") || (usertype != "" && usertype != "SUPER_ADMIN" && usertype != "STATE_ADMIN")) ? <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="district"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    console.log(field, "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
                    return (
                    <SelectPicker
                      options={districtList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select District"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                    />
                  )}}
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
