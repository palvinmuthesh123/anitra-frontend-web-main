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
  const { user } = useAppContext();

  const { currentState = {} } = props;

  const schema = yup
    .object({
      farmerName: yup.string().required("Farmer name is required"),
      mobile: yup.string().required("Mobile number is required"),
      address: yup.string().required("Address is required"),
      selectState: yup.string().required("State is required"),
      selectMandal: yup.string().required("Mandal is required"),
      selectTribe: yup.string().required("Tribe is required"),
      selectCommunity: yup.string().required("Community is required"),
      district: yup.string().required("District is required"),
      selectVillage: yup.string().required("Village is required"),
      // hamlet: yup.string().required("Hamlet is required"),
      pincode: yup.string().required("Pincode is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum Six Characters required"),
      userType: yup.string().required("User Type is required"),
      aadharCardNumber: yup.string().required("Aadhar Card is required"),
      email: yup.string().required("Email  is required"),
    })
    .required();

  const getEditUserDetails = (isEdit, currentState) => {
    const role = user?.role?.code;
    if (!isEdit) {
      return {
        farmerName: "",
        mobile: "",
        address: "",
        selectState: "",
        selectMandal: "",
        district: "",
        selectVillage: "",
        hamlet: "",
        pincode: "",
        idType: "",
        idNumber: "",
        selectTribe: "",
        selectCommunity: "",
      };
    } else {
      return {
        farmerName: currentState?.name,
        mobile: currentState?.mobile,
        address: currentState?.address,
        selectState: `${
          role === "admin" ? currentState?.stateId : currentState?.stateName
        }`,
        district:
          `${
            role === "admin" ? currentState?.districtId : currentState?.district
          }` || currentState?.district,
        selectMandal:
          `${
            role === "admin" ? currentState?.mandalId : currentState?.mandal
          }` || currentState?.mandal,
        selectVillage:
          `${
            role === "admin" ? currentState?.villageId : currentState?.village
          }` || currentState?.village,
        hamlet: currentState?.hamletId,
        pincode: currentState?.pincode,
        email: currentState?.email,
      };
    }
  };

  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(props?.isEdit, currentState),
  });

  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [hamletList, setHamletList] = useState([]);
  const [tribesList, setTribesList] = useState({
    data: [],
  });

  const [communityList, setCommunityList] = useState({
    data: [],
  });

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (watch("selectState")) {
      setDistrictList([]);
      setMandalList([]);
      setVillageList([]);
      setHamletList([]);
      getDistricts(watch("selectState"));
      getMithunTribes(watch("selectState"));
      getCommunityList(watch("selectState"));
    }
  }, [watch("selectState")]);

  useEffect(() => {
    if (watch("district")) {
      setMandalList([]);
      setVillageList([]);
      setHamletList([]);
      getMandalsList(watch("district"));
    }
  }, [watch("district")]);

  useEffect(() => {
    if (watch("selectMandal")) {
      setVillageList([]);
      setHamletList([]);
      getVillageList(watch("selectMandal"));
    }
  }, [watch("selectMandal")]);

  useEffect(() => {
    if (user?.role?.code === "admin") {
      if (watch("selectVillage")) {
        setHamletList([]);
        getHamletList(watch("selectVillage"));
      }
    }
  }, [watch("selectVillage")]);

  const getStates = () => {
    const URL =
      user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    apiRequest({
      url: URL,
      method: user?.role?.code === "admin" ? "GET" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getStates = res?.data?.map((state) => ({
            name: state?.display_name,
            value: state?.id,
          }));
          setStatesList(getStates);
        } else {
          const getStates = res?.data?.map((state) => ({
            name: state?.State,
            value: state?.State,
          }));
          setStatesList(getStates);
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

  const getMandalsList = (districtName) => {
    const URL =
      user?.role?.code === "admin" ? `master/mandals` : `madmin/master/mandals`;

    const payload = {
      district_id: Number(districtName),
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

  const getVillageList = (mandalId) => {
    const payload = {
      mandal_id: Number(mandalId),
      limit: 1000,
    };
    const mithunPayload = {
      limit: 1000,
      mandal_name: mandalId,
    };
    const URL =
      user?.role?.code === "admin"
        ? `master/villages`
        : "madmin/master/villages";
    apiRequest({
      url: URL,
      data: user?.role?.code === "admin" ? payload : mithunPayload,
      method: user?.role?.code === "admin" ? "POST" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const modifiedVillageList = res?.data?.map((village) => ({
            name: village?.name,
            value: village?.id,
          }));
          setVillageList(modifiedVillageList);
        } else {
          const modifiedVillageList = res?.data?.map((village) => ({
            name: village?.Village,
            value: village?._id,
          }));
          setVillageList(modifiedVillageList);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getHamletList = (villageId) => {
    const payload = {
      village_id: Number(villageId),
    };
    apiRequest({
      url: `master/hamlets`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const hamletResponse = res?.data?.map((hamlet) => ({
          name: hamlet?.name,
          value: hamlet?.id,
        }));
        setHamletList(hamletResponse);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getMithunTribes = (selectState) => {
    const payload = {
      state_name: selectState,
    };
    apiRequest({
      url: `madmin/master/tribe/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedTribeList = res?.data?.map((tribe) => ({
          name: tribe?.Tribe,
          value: tribe?.Tribe,
        }));
        setTribesList({ data: modifiedTribeList });
      })
      .catch((err) => {
        alert(err);
      });
  };
  
  const getCommunityList = (selectState) => {
    const payload = {
      state_name: selectState,
    };
    apiRequest({
      url: `madmin/master/community/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedCommunityList = res?.data?.map((community) => ({
          name: community?.SocietyName,
          value: community?.SocietyName,
        }));
        setCommunityList({ data: modifiedCommunityList });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onSubmit = (data) => {
    let payload = {
      user_type: data?.userType,
      mobile: data?.mobile,
      password: data?.password,
      name: data?.farmerName,
      address: data?.address,
      aadhar_number: data?.aadharCardNumber,
      pincode: Number(data?.pincode),
      state_name: data?.selectState,
      district_name: data?.district,
      mandal_name: data?.selectMandal,
      village_name: data?.selectVillage,
      tribe_name: data?.selectTribe,
      community_name: data?.selectCommunity,
    };
    apiRequest({
      url: `madmin/farmer/add`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
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
      });
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
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    {...field}
                    options={[
                      {
                        name: "Mithun Farmer",
                        value: "MITHUN_FARMER",
                      },
                      {
                        name: "Mithun Buyer",
                        value: "MITHUN_BUYER",
                      },
                      {
                        name: "Mithun ADC",
                        value: "MITHUN_ADC ",
                      },
                    ]}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select User Type"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
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
                  name="address"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Enter address"}
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
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      {...field}
                      options={statesList}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select State"}
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
                  name="district"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={districtList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select District"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      defaultOption={"Select State to get Districts"}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={6} mt={"5px"}>
              <Box>
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
                      defaultOption={"Select Districts to get Mandals"}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectVillage"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={villageList}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Village"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      defaultOption={"Select Mandals to get Villages"}
                    />
                  )}
                />
              </Box>
            </Grid>
            {user?.role?.code === "admin" && (
              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="hamlet"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectPicker
                        options={hamletList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Hamlet"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectTribe"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={tribesList.data}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Tribe"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      defaultOption={"Select State to get Tribe"}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectCommunity"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={communityList.data}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Community"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      defaultOption={"Select State to get Community"}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Pincode"}
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
                  name="aadharCardNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Aadhar Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
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

export default AddEditUser;
