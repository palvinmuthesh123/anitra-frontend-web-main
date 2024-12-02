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
  const [villageList, setVillageList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [hamletList, setHamletList] = useState([]);

  const [statesList1, setStatesList1] = useState([]);
  const [districtList1, setDistrictList1] = useState([]);
  const [villageList1, setVillageList1] = useState([]);
  const [mandalList1, setMandalList1] = useState([]);
  const [hamletList1, setHamletList1] = useState([]);

  const [filters, setFilters] = useState({
    selectedState: "",
    selectedDistrict: "",
    selectedVillage: "",
    selectedMandal: "",
    selectedHamlet: ""
  });

  const [usertype, setUserType] = useState('');
  const [data, setData] = useState([
    {
      name: "Yes",
      value: "YES",
    },
    {
      name: "No",
      value: "NO",
    }
  ])
  const [cardType, setCardType] = useState([
    {
      name: "Aadhar Card",
      value: "ADHAAR_CARD",
    },
    {
      name: "Pan Card",
      value: "PAN_CARD",
    }
  ])
  const [gender, setGender] = useState([
    {
      name: "Male",
      value: "MALE",
    },
    {
      name: "Female",
      value: "FEMALE",
    },
    {
      name: "Not to Say",
      value: "NOTSAY",
    }
  ])
  const [ownerType, setOwnerType] = useState(
    [
      {
        name: "Individual",
        value: "INDIVIDUAL"
      },
      {
        name: "Company / Institution",
        value: "COMPANY / INSTITUTION"
      }
  ])
  const [caste, setCaste] = useState(
    [
      {
        name: "ST",
        value: "ST"
      },
      {
        name: "SC",
        value: "SC"
      },
      {
        name: "BC",
        value: "BC"
      },
      {
        name: "OBC",
        value: "OBC"
      },
      {
        name: "MBC",
        value: "MBC"
      },
      {
        name: "OC",
        value: "OC"
      },
      {
        name: "Others",
        value: "OTHERS"
      }
  ])
  const [lands, setLands] = useState(
    [
      {
        name: "Landless / Marginal (< 1 Ha)",
        value: "Landless / Marginal (< 1 Ha)"
      },
      {
        name: "Small (1-1.99 Ha)",
        value: "Small (1-1.99 Ha)"
      },
      {
        name: "Semi-Medium (2-3.99 Ha)",
        value: "Semi-Medium (2-3.99 Ha)"
      },
      {
        name: "Medium (4-9.99 Ha)",
        value: "Medium (4-9.99 Ha)"
      },
      {
        name: "Large (>10 Ha)",
        value: "Large (>10 Ha)"
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
    setFilters((prev) => ({
      ...prev,
      selectedState: currentState.farmer_data.state_id,
      selectedDistrict: currentState.farmer_data.district_id,
      selectedMandal: currentState.farmer_data.mandal_id,
      selectedVillage: currentState.farmer_data.village_id,
      selectedHamlet: currentState.farmer_data.hamlet_id,
    }));
  },[])

  useEffect(() => {
    getStates();
    getDistricts();
    getVillages();
    getMandals();
    getHamlets();
  }, [])

  const getStates = () => {
    const URL = `master/states`;
    const method = "GET";

    apiRequest({
        url: URL,
        method: method,
    })
        .then((res) => {
            console.log(res, res.data?.length, "Response Data");
            setStatesList1(res?.data);
            if (Array.isArray(res?.data)) {
                const getStatesList = res?.data.map((state) => ({
                    name: state?.name,
                    value: state?.id,
                }));
                setStatesList(getStatesList);
            } else {
                console.warn("No valid states data received");
                setStatesList([]);
            }
        })
        .catch((err) => {
            console.error("Error fetching states:", err?.response?.data?.message || err.message);
            alert(err?.response?.data?.message || "Failed to fetch states");
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
        setDistrictList1(res?.data);
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

  const getVillages = () => {
    const URL = `master/villages`;
    const method = "POST";

    console.log(URL, method);

    apiRequest({
      url: URL,
      method: method,
    })
      .then((res) => {
        console.log(res, res.data?.length, "Response Data");
        setVillageList1(res?.data);
        // Check if `res.data` exists and is an array
        if (Array.isArray(res?.data)) {
          // Map the states to get name and value
          const getVillagesList = res.data.map((state) => ({
            name: state?.name || "", // Fallback to empty string if name is undefined
            value: state?.id || "", // Fallback to empty string if id is undefined
          }));

          console.log(getVillagesList, "Villages List");

          setVillageList(getVillagesList);
        } else {
          console.warn("No valid states data received");
          setVillageList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching states:", err?.response?.data?.message || err.message);
        alert(err?.response?.data?.message || "Failed to fetch states");
      });
  };

  const getMandals = () => {
    const URL = `master/mandals`;
    const method = "POST";

    console.log(URL, method);

    apiRequest({
      url: URL,
      method: method,
    })
      .then((res) => {
        setMandalList1(res?.data);
        console.log(res, res.data?.length, "Response Data");

        // Check if `res.data` exists and is an array
        if (Array.isArray(res?.data)) {
          // Map the states to get name and value
          const getMandalsList = res.data.map((state) => ({
            name: state?.name || "", // Fallback to empty string if name is undefined
            value: state?.id || "", // Fallback to empty string if id is undefined
          }));

          console.log(getMandalsList, "Mandals List");

          setMandalList(getMandalsList);
        } else {
          console.warn("No valid states data received");
          setMandalList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching states:", err?.response?.data?.message || err.message);
        alert(err?.response?.data?.message || "Failed to fetch states");
      });
  };

  const getHamlets = () => {
    const URL = `master/hamlets`;
    const method = "POST";

    console.log(URL, method);

    apiRequest({
      url: URL,
      method: method,
    })
      .then((res) => {
        setHamletList1(res?.data);
        console.log(res, res.data?.length, "Response Data");

        // Check if `res.data` exists and is an array
        if (Array.isArray(res?.data)) {
          // Map the states to get name and value
          const getHamletsList = res.data.map((state) => ({
            name: state?.name || "", // Fallback to empty string if name is undefined
            value: state?.id || "", // Fallback to empty string if id is undefined
          }));

          console.log(getHamletsList, "Hamlets List");

          setHamletList(getHamletsList);
        } else {
          console.warn("No valid states data received");
          setHamletList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching states:", err?.response?.data?.message || err.message);
        alert(err?.response?.data?.message || "Failed to fetch states");
      });
  };

  const getEditUserDetails = (isEdit, currentState) => {
    console.log(isEdit, currentState, "HHHHHHHHHHHHHHH")
    var states = statesList.filter(role => (role.value = currentState.farmer_data?.state_id));
    if (Array.isArray(states)) {
      states = states && states[0] && states[0].name ? states[0]?.name : ""
    }
    else {
      states = states && states.name ? states.name : ""
    }
    console.log(states, "FFFFFSSSSSSSS")
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
        farmerName: currentState?.farmer_data?.name,
        mobile: currentState?.farmer_data?.mobile,
        address: currentState?.farmer_data?.address,
        email: currentState?.farmer_data?.email,
        selectState: `${role === "admin" ? currentState?.farmer_data?.state_id : ""
          }`,
        district:
          `${role === "admin" ? currentState?.farmer_data?.district_id : ""
          }`,
        pincode: currentState?.farmer_data?.pincode,
        idType: currentState?.farmer_data?.id_type,
        cardNo: currentState?.farmer_data?.id_number,
        association: currentState?.farmer_asso_num,
        villageInst: currentState?.village_inst,
        villageinsttype: currentState?.village_inst_type,
        affliatedAgency: currentState?.affliated_agency,
        milchAnimal: currentState?.no_of_milch_animal,
        ownerType: currentState?.owner_type,
        selectMandal: currentState?.farmer_data?.mandal_id,
        village: currentState?.farmer_data?.village_id,
        hamlet: currentState?.farmer_data?.hamlet_id,
        gender: currentState?.farmer_data?.gender,
        social: currentState?.social_status,
        land: currentState?.landholding,
        pourer: currentState?.pourer_mem,
        poverty: currentState?.below_pow_line,
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

    const state = statesList1.filter(role => (role.value = formData.get("selectState")));
    const district = districtList1.filter(role => (role.value = formData.get("district")));
    const mandal = mandalList1.filter(role => (role.value = formData.get("selectMandal")));
    const village = villageList1.filter(role => (role.value = formData.get("village")));
    const hamlet = hamletList1.filter(role => (role.name = formData.get("hamlet")));

    console.log(formData.get("district"), state, district, mandal, village, hamlet, "PPPPPPPPPPPPPPPPP");

    let payload = {
      user_id: currentState.user_id,
      owner_type: formData.get("ownerType"),
      social_status: formData.get("social"),
      landholding: formData.get("land"),
      farmer_asso_num: formData.get("association"),
      pourer_mem: formData.get("pourer"),
      below_pow_line: formData.get("poverty"),
      village_inst: formData.get("villageInst"),
      village_inst_type: formData.get("villageinsttype"),
      affliated_agency: formData.get("affliatedAgency"),
      no_of_milch_animal: formData.get("milchAnimal"),
      farmer_data: {
        mobile: formData.get("mobile"),
        name: formData.get("farmerName"),
        email: formData.get("email"),
        address: formData.get("address"),
        pincode: formData.get("pincode"),
        id_type: formData.get("idType"),
        id_number: formData.get("cardNo"),
        state_id: formData.get("selectState"),
        district_id: formData.get("district"),
        mandal_id: formData.get("selectMandal"),
        village_id: formData.get("village"),
        hamlet_id: formData.get("hamlet"),
        gender: formData.get("gender"),
        state_name: state,
        district_name: district,
        mandal_name: mandal,
        village_name: village,
        hamlet_name: hamlet,
      }
    };

    apiRequest({
      url: `user/updateMuzzleFarmer`,
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
  };

  const handleSelectState = (e) => {
    console.log(e, "EEEEEEEEEEEEEEEEEEEEEE")
    const selectedState = e.target.value.toString();
    setFilters((prev) => ({
      ...prev,
      selectedState: selectedState,
    }));
  };

  const handleSelectDistrict = (e) => {
    const selectedDistrict = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedDistrict: selectedDistrict,
    }));
  };

  const handleSelectVillage = (e) => {
    const selectedVillage = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedVillage: selectedVillage,
    }));
  };

  const handleSelectedMandal = (e) => {
    const selectedMandal = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedMandal: selectedMandal,
    }));
  };

  const handleSelectedHamlet = (e) => {
    const selectedHamlet = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedHamlet: selectedHamlet,
    }));
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
            <Grid item xs={6}>
              <Box>
                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Address"}
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
                  name="pincode"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Pincode"}
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
                  name="idType"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={cardType}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"ID Type"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )
                  }
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Controller
                  name="cardNo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Aadhard / Card ID Number"}
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
                  name="association"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Farmer Association Number"}
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
                  name="villageInst"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Village Institution"}
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
                  name="villageinsttype"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Village Institution Type"}
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
                  name="affliatedAgency"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Affliated Agency"}
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
                  name="milchAnimal"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      inputLabel={"Number of Milch Animal"}
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
                  name="ownerType"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={ownerType}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Owner Type"}
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
                        value={filters.selectedState}
                        onChange={handleSelectState}
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
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={districtList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select District"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        value={filters.selectedDistrict}
                        onChange={handleSelectDistrict}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="selectMandal"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={mandalList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Mandal"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        value={filters.selectedMandal}
                        onChange={handleSelectedMandal}
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
                  name="village"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={villageList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Village"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        value={filters.selectedVillage}
                        onChange={handleSelectVillage}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="hamlet"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={hamletList}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Hamlet"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        value={filters.selectedHamlet}
                        onChange={handleSelectedHamlet}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={gender}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Gender"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="social"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={caste}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Social Status"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="land"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={lands}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Land Holdings"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="pourer"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={data}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Pourer Member"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} mt={"5px"}>
              <Box>
                <Controller
                  name="poverty"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <SelectPicker
                        options={data}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Below Poverty Line"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      // defaultOption={"Select State to get Districts"}
                      />
                    )
                  }}
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