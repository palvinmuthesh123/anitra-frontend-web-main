import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Colors } from "../../constants/Colors";
import SelectPicker from "../../components/SelectPicker";
import CustomDatePicker from "../../components/DatePicker";
import { apiRequest } from "../../services/api-request";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { useAppContext } from "../../context/AppContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EpochFormatDate } from "../../utilities/date-utility";
import moment from "moment";
import "moment-timezone";
import { debounce } from "lodash";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";

const BasicInfo = (props) => {
  const { userDetails } = props;

  const { user } = useAppContext();

  const [openVillageList, setOpenVillageList] = useState(false);
  const [openHamletList, setOpenHamletList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hamletLoading, setHamletLoading] = useState(false);
  const [villageList, setVillageList] = useState({
    data: [],
  });

  const [hamletList, setHamletList] = useState({
    data: [],
  });

  const [statesList, setStatesList] = useState({
    data: [],
    loader: false,
  });
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [tribeList, setTribeList] = useState({
    data: [],
  });
  const [mithunCommunity, setMithunCommunity] = useState({
    data: [],
  });

  useEffect(() => {
    if (userDetails?.user_id) {
      getStates();
    }
  }, []);

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
    const createdDate = userDetails?.dob;
    const utcDate = new Date(createdDate);
    const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");

    const istDob = moment(istDateTimeEndsAt, "DD MMM YYYY");

    const joiningDate = userDetails?.created_on && userDetails?.created_on;
    const utcJoiningDate = new Date(joiningDate);
    const istJoiningDateTimeEndsAt = moment
      .utc(utcJoiningDate)
      .tz("Asia/Kolkata");

    const istJoiningDate = moment(istJoiningDateTimeEndsAt, "DD MMM YYYY");

    if (!userDetails?.user_id) {
      return {
        farmerName: "",
        idNumber: "",
        farmerID: "",
        mobileNumber: "",
        village: {
          title: "",
          value: "",
        },
      };
    } else {
      return {
        farmerID: userDetails?.user_id,
        farmerName: userDetails?.name,
        idNumber: userDetails?.id_number,
        mobileNumber: userDetails?.mobile,
        email: userDetails?.email,
        addressLine: userDetails?.address,
        state: userDetails?.state_id || userDetails?.state_name,
        district: userDetails?.district_id || userDetails?.district_name,
        mandal: userDetails?.mandal_id || userDetails?.mandal_name,
        village: {
          title: userDetails?.village_name,
          value: userDetails?.village_id,
        },
        hamlet: {
          title: userDetails?.hamlet_name,
          value: userDetails?.hamlet_name,
        },
        community: userDetails?.community_name
          ? userDetails?.community_name
          : null,
        tribe: userDetails?.tribe_name,
        pincode: userDetails?.pincode,
        aadharNumber: userDetails?.aadhar_number || "",
        dateOfJoining: istJoiningDate,
        dob: istDob,
        password: userDetails?.password,
      };
    }
  };

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
    clearErrors,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(userDetails),
  });

  useEffect(() => {
    if (user?.role?.code === "mithunAdmin" && userDetails?.user_id) {
      if (watch("state")) {
        getTribesList(watch("state"));
        getCommunityList(watch("state"));
      }
    }
  }, [watch("state")]);

  useEffect(() => {
    if (watch("state")) {
      getDistrictList(watch("state"));
      setMandalList([]);
    }
  }, [watch("state")]);

  useEffect(() => {
    if (watch("district")) {
      setMandalList([]);

      getMandalList(watch("district"));
    }
  }, [watch("district")]);

  useEffect(() => {
    if (watch("idType")) {
    }
  }, [watch("idType")]);

  const getTribesList = (state) => {
    const payload = {
      skip: 0,
      limit: 100,
      state_name: state,
    };
    const URL =
      user?.role?.code === "admin"
        ? `master/tribe/list`
        : "madmin/master/tribe/list";
    apiRequest({
      url: URL,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedTribesList = res?.data?.map((tribe) => ({
          name: tribe?.Tribe,
          value: tribe?.Tribe,
        }));
        setTribeList({ data: modifiedTribesList, loader: false });
      })
      .catch((err) => {});
  };

  const getCommunityList = (state) => {
    console.log(state);
    const payload = {
      skip: 0,
      limit: 100,
      state_name: state,
    };
    const URL =
      user?.role?.code === "admin"
        ? `master/community/list`
        : "madmin/master/community/list";
    apiRequest({
      url: URL,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedStateList = res?.data?.map((society) => ({
          name: society?.SocietyName,
          value: society?.SocietyName,
        }));
        setMithunCommunity({ data: modifiedStateList, loader: false });
      })
      .catch((err) => {
        setMithunCommunity({ loader: false });
      });
  };

  const getStates = () => {
    setStatesList({ loader: true });
    const URL =
      user?.role?.code === "admin" ? `master/states` : "madmin/master/states";
    apiRequest({
      url: URL,
      method: user?.role?.code === "admin" ? "GET" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const modifiedStateList = res?.data?.map((state) => ({
            name: state?.name,
            value: state?.id,
          }));
          setStatesList({ data: modifiedStateList, loader: false });
        } else {
          const modifiedStateList = res?.data?.map((state) => ({
            name: state?.State,
            value: state?._id,
          }));
          setStatesList({ data: modifiedStateList, loader: false });
        }
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
    const mithunPayload = {
      limit: 100,
      state_name: stateId,
    };
    const URL =
      user?.role?.code === "admin"
        ? `master/districts`
        : "madmin/master/districts";
    apiRequest({
      url: URL,
      data: user?.role?.code === "admin" ? payload : mithunPayload,
      method: user?.role?.code === "admin" ? "POST" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const modifiedDistrictList = res?.data?.map((district) => ({
            name: district?.name,
            value: district?.id,
          }));
          setDistrictList(modifiedDistrictList);
        } else {
          const modifiedDistrictList = res?.data?.map((district) => ({
            name: district?.District,
            value: district?._id,
          }));
          setDistrictList(modifiedDistrictList);
        }
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

    const URL =
      user?.role?.code === "admin" ? `master/mandals` : "madmin/master/mandals";
    const mithunPayload = {
      limit: 100,
      district_name: districtId,
    };
    apiRequest({
      url: URL,
      data: user?.role?.code === "admin" ? payload : mithunPayload,
      method: user?.role?.code === "admin" ? "POST" : "POST",
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
            value: mandal?._id,
          }));
          setMandalList(modifiedMandalList);
        }
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
      district_name: Number(data.districtName),
      mandal_id: Number(data.mandal),
      village_id: Number(data.villag),
      hamlet_id: Number(data.hamlet),
      dob: epochTimestamp && epochTimestamp,
      // partner_id: data.farmerID,
      name: data.farmerName,
      email: data.email,
      address: data.address,
      id_type: data.idType,
      id_number: data.idNumber,
      aadhar_number: data.aadharNumber,
    };
    apiRequest({
      url: `user/update`,
      data: payload,
      method: "PUT",
    })
      .then(() => {
        alert("success");
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    if (userDetails?.mandal_id) {
      fetchVillages();
    }
  }, [userDetails?.mandal_id]);

  const fetchVillages = async (searchQuery) => {
    setLoading(true);

    // if (!searchQuery && searchQuery.trim() === "") {
    //   setLoading(false);
    //   return;
    // }

    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    const payload = {
      skip: 0,
      searchText: searchQuery,
      limit: 100,
      mandal_id: userDetails?.mandal_id,
    };
    try {
      const response = await apiRequest({
        url: url,
        method: "POST",
        data: payload,
      });
      if (user?.role?.code === "admin") {
        const modifiedMandalList = response?.data?.map((village) => ({
          title: village?.name,
          value: village?.id,
        }));
        setVillageList({
          data: modifiedMandalList ? modifiedMandalList : [],
        });

        setLoading(false);
      } else {
        const modifiedMandalList = response?.data?.map((village) => ({
          tile: village?.Block,
          value: village?.Block,
        }));
        setLoading(false);
        setVillageList({ data: modifiedMandalList });
      }
    } catch (error) {}
    setLoading(false);
  };

  const debouncedOptions = debounce(fetchVillages, 300);

  const fetchHamlets = async (hamletList) => {
    setHamletLoading(true);
    if (!hamletList && hamletList.trim() === "") {
      setHamletLoading(false);
      return;
    }
    const url =
      user?.role?.code === "admin" ? `master/hamlets` : `madmin/master/hamlets`;

    const payload = {
      skip: 0,
      searchText: hamletList,
      limit: 100,
    };
    try {
      const response = await apiRequest({
        url: url,
        method: "POST",
        data: payload,
      });

      if (user?.role?.code === "admin") {
        const modifiedVillageList = response?.data?.map((hamlet) => ({
          title: hamlet?.name,
          value: hamlet?.id,
        }));
        setHamletLoading(false);

        setHamletList({
          data: modifiedVillageList ? modifiedVillageList : [],
        });
      } else {
        const modifiedVillageList = response?.data?.map((hamlet) => ({
          tile: hamlet?.name,
          value: hamlet?.id,
        }));
        setHamletLoading(false);
        setHamletList({ data: modifiedVillageList });
      }
    } catch (error) {}
    setHamletLoading(false);
  };

  const hamletDebouncedOptions = debounce(fetchHamlets, 300);

  const handleSelectHamlet = (e, value) => {
    setValue("hamlet", value); // Update the value of the 'hamlet' field
    clearErrors("hamlet");
    if (value) {
      setHamletList(value);
    } else if (value === null) {
      setHamletList({ data: [] });
    }
  };
  const handleSelectVillage = (e, value) => {
    setValue("village", value); // Update the value of the 'village' field
    clearErrors("village");
    if (value) {
      setVillageList(value);
    } else if (value === null) {
      setVillageList({ data: [] });
    }
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
        <Box mt={2} display={"flex"} flexDirection={"column"} gap={"20px"}>
          <Grid container spacing={2} alignItems={"baseline"}>
            <Grid item xs={4}>
              <Controller
                name="farmerID"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"ID"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"baseline"}>
            {user?.role?.code === "admin" && (
              <Grid item xs={4}>
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
              </Grid>
            )}

            <Grid item xs={4}>
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
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"baseline"}>
            <Grid item xs={4}>
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
                      placeholder="District"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="mandal"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <SelectPicker
                      {...field}
                      options={mandalList}
                      type={"text"}
                      label={"Mandal"}
                      placeholder={"Mandal"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="village"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomAutoComplete
                    options={villageList?.data ? villageList?.data : ""}
                    borderColor={"black"}
                    borderRadius={"5px"}
                    defaultValue={{
                      title: userDetails?.village_name,
                      value: userDetails?.village_id,
                    }}
                    width={"100%"}
                    handleChange={handleSelectVillage}
                    placeholder={"Search & Select Village"}
                    open={openVillageList}
                    onInputChange={(event, value) => {
                      debouncedOptions(value);
                    }}
                    onOpen={() => {
                      setOpenVillageList(true);
                    }}
                    onClose={() => {
                      setOpenVillageList(false);
                    }}
                    loading={loading}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"baseline"}>
            {user?.role?.code === "admin" && (
              <Grid item xs={4}>
                <Controller
                  name="hamlet"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomAutoComplete
                      options={hamletList.data ? hamletList.data : []}
                      borderColor={"black"}
                      defaultValue={{
                        title: userDetails?.hamlet_name,
                        value: userDetails?.hamlet_name,
                      }}
                      borderRadius={"5px"}
                      width={"100%"}
                      handleChange={handleSelectHamlet}
                      placeholder={"Search & Select Hamlet"}
                      open={openHamletList}
                      onInputChange={(event, hamletValue) => {
                        hamletDebouncedOptions(hamletValue);
                      }}
                      onOpen={() => {
                        setOpenHamletList(true);
                      }}
                      onClose={() => {
                        setOpenHamletList(false);
                      }}
                      loading={hamletLoading}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={4}>
              <Controller
                name="pincode"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Pincode"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="aadharNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Aadhar Number"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
          </Grid>

          {user?.role?.code === "mithunAdmin" && (
            <Grid container spacing={2} alignItems={"baseline"}>
              <Grid item xs={4}>
                <Controller
                  name="community"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <SelectPicker
                        options={mithunCommunity.data}
                        {...field}
                        label={"Hamlet"}
                        type={"text"}
                        placeholder={"Select Community"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="tribe"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <SelectPicker
                        options={tribeList.data}
                        {...field}
                        label={"Tribe"}
                        type={"text"}
                        placeholder={"Select Tribe"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default BasicInfo;
