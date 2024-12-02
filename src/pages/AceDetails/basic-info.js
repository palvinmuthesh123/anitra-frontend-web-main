import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "../../constants/Colors";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectPicker from "../../components/SelectPicker";
import CustomDatePicker from "../../components/DatePicker";
import { apiRequest } from "../../services/api-request";
import CustomInput from "../../components/Input";
import { EpochFormatDate } from "../../utilities/date-utility";

import moment from "moment";
import "moment-timezone";

const AceBasicInfo = (props) => {
  const { userDetails } = props;

  const schema = yup
    .object({
      farmerName: yup.string().required("Farmer Name is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      addressLine: yup.string().required("Address Line is required"),
      state: yup.string().required("State is required"),
      district: yup.string().required("District is required"),
      mandal: yup.string().required("Mandal is required"),
      village: yup.string().required("Village is required"),
      hamlet: yup.string().required("Hamlet is required"),
      pincode: yup.string().required("PinCode is required"),
      idNumber: yup.string().required("Aadhar Number is required"),
      dateOfJoining: yup.string().required("Date Of Joining is required"),
      dob: yup.string().required("DOB is required"),
    })
    .required();

  const getDefaultValues = (userDetails) => {
    const joiningDate = userDetails?.created_on && userDetails?.created_on;
    const utcJoiningDate = new Date(joiningDate);
    const istJoiningDateTimeEndsAt = moment
      .utc(utcJoiningDate)
      .tz("Asia/Kolkata");

    const istJoiningDate = moment(istJoiningDateTimeEndsAt, "DD MMM YYYY");

    if (userDetails?.user_id) {
      return {
        userID: userDetails?.user_id,
        farmerName: userDetails?.name,
        mobileNumber: userDetails?.mobile,
        email: userDetails?.email,
        addressLine: userDetails?.address,
        state: userDetails?.state_id,
        district: userDetails?.district_id,
        mandal: userDetails?.mandal_id,
        village: userDetails?.village_id,
        hamlet: userDetails?.hamlet_id,
        pincode: userDetails?.pincode,
        dateOfJoining: istJoiningDate,
        idNumber: userDetails?.aadhar_number || "",
      };
    } else {
      return { farmerName: "", userID: "", mobileNumber: "" }; // Set default values when userDetails is falsy
    }
  };

  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(userDetails),
  });

  const [statesList, setStatesList] = useState({
    data: [],
    loader: false,
  });
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [hamletList, setHamletList] = useState([]);

  useEffect(() => {
    if (userDetails?.state_id) {
      getStates();
    }
  }, [userDetails?.state_id]);

  useEffect(() => {
    if (watch("state")) {
      getDistrictList(watch("state"));
      setMandalList([]);
      setVillageList([]);
      setHamletList([]);
    }
  }, [watch("state")]);

  useEffect(() => {
    if (watch("district")) {
      setMandalList([]);
      setVillageList([]);
      setHamletList([]);
      getMandalList(watch("district"));
    }
  }, [watch("district")]);

  useEffect(() => {
    if (watch("mandal")) {
      setVillageList([]);
      setHamletList([]);
      getVillageList(watch("mandal"));
    }
  }, [watch("mandal")]);

  useEffect(() => {
    if (watch("village")) {
      setHamletList([]);
      getHamletList(watch("village"));
    }
  }, [watch("village")]);

  useEffect(() => {
    if (watch("idType")) {
    }
  }, [watch("idType")]);

  const getStates = () => {
    setStatesList({ loader: true });
    apiRequest({
      url: `master/states`,
      method: "GET",
    })
      .then((res) => {
        const modifiedStateList = res?.data?.map((state) => ({
          name: state?.name,
          value: state?.id,
        }));
        setStatesList({ data: modifiedStateList, loader: false });
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
        setStatesList({ loader: false });
      });
  };

  const getDistrictList = (stateId) => {
    const payload = {
      state_id: stateId,
      limit: 100,
    };
    apiRequest({
      url: `master/districts`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedDistrictList = res?.data?.map((district) => ({
          name: district?.name,
          value: district?.id,
        }));
        setDistrictList(modifiedDistrictList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getMandalList = (districtId) => {
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
        const modifiedMandalList = res?.data?.map((mandal) => ({
          name: mandal?.name,
          value: mandal?.id,
        }));
        setMandalList(modifiedMandalList);
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
        const modifiedVillageList = res?.data?.map((village) => ({
          name: village?.name,
          value: village?.id,
        }));
        setVillageList(modifiedVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getHamletList = (villageId) => {
    const payload = {
      village_id: villageId,
    };
    apiRequest({
      url: `master/hamlets`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedHamletList = res?.data?.map((hamlet) => ({
          name: hamlet?.name,
          value: hamlet?.id,
        }));
        setHamletList(modifiedHamletList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onSubmit = (data) => {
    const dateString = EpochFormatDate(data.dob);
    const epochTimestamp = new Date(dateString).getTime() / 1000;
    const payload = {
      pincode: Number(data.pincode),
      state_id: Number(data.state),
      district_id: Number(data.district),
      mandal_id: Number(data.mandal),
      village_id: Number(data.village),
      hamlet_id: Number(data.hamlet),
      dob: epochTimestamp && epochTimestamp,
      name: data.farmerName,
      email: data.email,
      address: data.address,
      id_type: data.idType,
      id_number: data.idNumber,
    };
    apiRequest({
      url: `user/update`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        alert("success");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box m={3}>
      <Typography
        fontFamily={"Poppins-Medium"}
        fontSize={13}
        color={Colors.textColor}
      >
        Basic Details
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Box mt={2}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"baseline"}
          >
            <Box width={"30%"}>
              <Controller
                name="userID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Id"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
            <Box width={"30%"}>
              <Controller
                name="farmerName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Name"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
            <Box width={"30%"}>
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Mobile Number"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
          </Box>
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"baseline"}
          >
            <Box width={"30%"}>
              <Controller
                name={"dateOfJoining"}
                rules={{ required: true }}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomDatePicker
                    {...field}
                    label={"Date of Joining"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
            <Box width={"30%"}>
              <Controller
                name="addressLine"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Address Line"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>

            <Box width={"30%"}>
              <Controller
                name="state"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      {...field}
                      options={statesList.data}
                      label={"State"}
                      placeholder={"Select State"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box>
          </Box>
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"baseline"}
          >
            <Box width={"30%"}>
              <Controller
                name="district"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      {...field}
                      options={districtList}
                      type={"text"}
                      label={"District"}
                      placeholder={"Select District"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box>
            <Box width={"30%"}>
              <Controller
                name="mandal"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      options={mandalList}
                      {...field}
                      label={"Mandal"}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Mandal"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box>
            <Box width={"30%"} mt={"10px"}>
              <Controller
                name="village"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      options={villageList}
                      {...field}
                      label={"Village"}
                      type={"text"}
                      placeholder={"Select Village"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box>
          </Box>
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"baseline"}
          >
            <Box width={"30%"}>
              <Controller
                name="hamlet"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      options={hamletList}
                      {...field}
                      label={"Hamlet"}
                      type={"text"}
                      placeholder={"Select Hamlet"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box>
            <Box width={"30%"}>
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
            {/* <Box width={"30%"}>
              <Controller
                name="idType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      options={type}
                      {...field}
                      label={"Select Address Proof"}
                      type={"text"}
                      placeholder={"Select Address Proof"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Box> */}
            <Box width={"30%"}>
              <Controller
                name="idNumber"
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
          </Box>
        </Box>
        {/* <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={4}
          gap={3}
        >
          <Grid item>
            <CustomButton
              title={`Save`}
              backgroundColor={Colors.headerColor}
              textColor={Colors.white}
              width={130}
              height={34}
              borderColor={Colors.headerColor}
              borderRadius={2}
              textFontSize={14}
              // padding={"14px 50px"}
              type={"submit"}
            />
          </Grid>
        </Grid> */}
      </form>
    </Box>
  );
};
export default AceBasicInfo;
