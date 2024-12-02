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

const AddEditVeteran = (props) => {
  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([])
  const [villageList, setVillageList] = useState([])

  const [usertype, setUserType] = useState('');
  const [datas, setData] = useState([
    {
      name: "Veteinarian",
      value: "VETEINARIAN",
    },
    {
      name: "Para VET",
      value: "PARA_VET",
    }
  ])
  const { user } = useAppContext();

  const { currentState = {} } = props;

  const schema = yup
    .object({
      farmerName: yup.string().required("Name is required"),
      mobile: yup.string().required("Mobile number is required"),
      // address: yup.string().required("Address is required"),
      selectState: yup.string().required("State is required"),
      selectMandal: yup.string().required("Mandal is required"),
      // selectTribe: yup.string().required("Tribe is required"),
      // selectCommunity: yup.string().required("Community is required"),
      district: yup.string().required("District is required"),
      selectVillage: yup.string().required("Village is required"),
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
    getMandalList();
    getVillageList();
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

      // const getStatesList = res?.data?.map((state) => {
      // console.log(state, "OOOOONNNNN.................")
      // ({
      //   name: state?.display_name,
      //   value: state?.id,
      // })
      // });

      const getStatesList = res?.data?.map(item => ({
        ...item, // retain all existing properties
        name: item.display_name, // add 'name' with value from 'display_name'
        value: item.id // add 'value' with value from 'id'
      }));

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

  const getMandalList = (districtId) => {
    console.log(districtId, "hi");
    const payload = {
      district_id: districtId,
      limit: 1000,
    };
    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getMandalList = res?.data?.map((mandal) => ({
          name: mandal?.name,
          value: mandal?.id,
        }));
        setMandalList(getMandalList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVillageList = (mandalId) => {
    const payload = {
      mandal_id: mandalId,
      limit: 1000,
    };
    apiRequest({
      url: `master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getVillageList = res?.data?.map((village) => ({
          name: village?.name,
          value: village?.id,
        }));
        setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getEditUserDetails = (isEdit, currentState) => {
    console.log(isEdit, currentState, "HHHHHHHHHHHHHHH")
    var states = statesList.filter(role => (role.value = currentState.state));
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
        selectMandal: "",
        selectVillage: "",
        email: "",
        userType: ""
      };
    } else {
      return {
        farmerName: currentState?.name,
        mobile: currentState?.mobile,
        selectState: `${
          role === "admin" ? currentState?.state : ""
        }`,
        district:
          `${
            role === "admin" ? currentState?.district : ""
          }`,
        email: currentState?.email,
        userType: currentState.role,
        selectMandal: currentState?.mandal,
        selectVillage: currentState?.village,
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

      var typ = datas.filter(role => (role.name = data?.userType));

      let payload = {
        role: typ || data?.userType,
        mobile: data?.mobile,
        name: data?.farmerName,
        email: data?.email,
        state: data?.selectState,
        district: data?.district
      };

      console.log(data, payload, "DDDDDDDDDDDDDDDDDDDDD....................")

      // apiRequest({
      //   url: `user/updateVeteran`,
      //   data: payload,
      //   method: "PUT",
      // })
      //   .then((res) => {
      //     console.log(res, "RRRRRRRRRRRRRRRRRR");
      //     if (res?.success === false) {
      //       alert(res?.message);
      //     }
      //     if (res?.success === true) {
      //       alert(res?.message);
      //     }
      //     props.getUsersByType();
      //     props.onCancel();
      // })
      //   .catch((err) => {
      //     console.log(err);
      //     alert(err?.response?.data?.message, "error");
      // })

  };

  const handleManualSubmit = (event) => {
    event.preventDefault(); // Prevents page reload
    const formData = new FormData(event.target); // Collects the form data
  
    // Extract values from the formData object
    const values = {
      user_id: currentState.user_id,
      name: formData.get("farmerName"),
      mobile: formData.get("mobile"),
      email: formData.get("email"),
      userType: formData.get("userType"),
      selectState: formData.get("selectState"),
      district: formData.get("district"),
      mandal: formData.get("selectMandal"),
      village: formData.get("selectVillage")
    };
  
    console.log(values); // Logs all the form values

    apiRequest({
        url: `user/updateVeteran`,
        data: values,
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
  };

  return (
    <>
      <Box sx={{ width: "100%", padding: "20px 0px 0px 0px" }}>
        <form onSubmit={handleManualSubmit} autoComplete="off">
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
                  // if(field && field.value) {
                  //   setUserType(field.value)
                  // }
                  // else
                  // {

                  // }
                  return (
                  <SelectPicker
                    {...field}
                    options={datas}
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

            <Grid item xs={6} mt={"5px"}>
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
            </Grid>

            <Grid item xs={6} mt={"5px"}>
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
            </Grid> 

            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectMandal"
                  control={control}
                  render={({ field, fieldState: { error } }) => 
                  {
                    // console.log(field, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
                    return (
                      <SelectPicker
                        options={mandalList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Mandal"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )
                  }
                }
                />
              </Box>
            </Grid>

            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectVillage"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    // console.log(field, "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
                    return (
                    <SelectPicker
                      options={villageList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Village"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                    />
                  )}}
                />
              </Box>
            </Grid> 

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

export default AddEditVeteran;
