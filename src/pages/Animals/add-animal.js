import { Box, Button, Grid, Typography, debounce } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Colors } from "../../constants/Colors";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../../components/Input";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import CustomDatePicker from "../../components/DatePicker";
import CustomButton from "../../components/Button";
import FileUploader from "../../components/FileUploader/file-uploder";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AddAnimal = (props) => {
  const [loadingForFarmersList, setLoadingForFarmersList] = useState(false);

  const [animalTypes, setAnimalTypes] = useState([]);

  const navigate=useNavigate()

  const [farmersList, setFarmersList] = useState({
    data: [],
    open: false,
  });

  const [uploadIdImages, setUploadIdImages] = useState({
    frontSideResponseFiles: "",
    backSideResponseFiles: "",
    leftSideResponseFiles: "",
    rightSideResponseFiles: "",
  });

  const [uploadMuzzleImages, setUploadMuzzleImages] = useState({
    straightMuzzle: "",
    straightFace: "",
    topMuzzle: "",
    lowerMuzzle: "",
    leftMuzzle: "",
    rightMuzzle: "",
    leftFace: "",
    rightFace: "",
  });

  const [VaccinationList, setVaccinationList] = useState({
    data: [],
  });
  const [diseaseList, setDiseaseList] = useState({
    data: [],
  });

  const [vaccinationDetails, setVaccinationDetails] = useState([
    { selectVaccination: "", selectVaccinationDate: "" },
  ]);
  const [diseaseDetails, setDiseaseDetails] = useState([
    { selectDisease: "", selectDate: "" },
  ]);

  const schema = yup
    .object({
      farmerId: yup
        .object()
        .shape({
          title: yup.string().required("Farmer Id is required."),
        })
        .required("Farmer Id is required."),
      tagType: yup.string().required("Tag Type is required"),
      calvings: yup.string().required("calvings is required"),
      weight: yup.string().required("Weight is required"),
      socks: yup.string().required("Socks is required"),
      tagNo: yup.string().required("Tag No is required"),
      mithunType: yup.string().required("Mithun  Type is required"),
      ageInMonths: yup.string().required("Age In Months is required"),
    })
    .required();

  useEffect(() => {
    getAnimalTypes();
    getVaccinations();
    getDiseases();
  }, []);

  const mithunDefaultValues = () => {
    return {
      tagType: "",
      tagNo: "",
      weight: "",
      ageInMonths: "",
      calvings: "",
      socks: "",
      tagNo: "",
      vaccinationDetails: [
        { selectVaccination: "", selectVaccinationDate: "" },
      ],
      diseaseDetails: [{ selectDisease: "", selectDate: "" }],
      breeding: "",
      fatheredBy: "",
      farmerId: {
        title: "",
        value: "",
      },
      startDate: "",
      endDate: "",
      insuranceNumber: "",
      insuranceValue: "",
      agentMobile: "",
      agentName: "",
      mithunType: "",
    };
  };

  const { handleSubmit, control, clearErrors, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mithunDefaultValues(),
  });

  const { remove: deleteVaccination } = useFieldArray({
    control,
    name: "vaccinationDetails",
  });

  const { remove: deleteDisease } = useFieldArray({
    control,
    name: "diseaseDetails",
  });

  const addVaccination = () => {
    setVaccinationDetails([
      ...vaccinationDetails,
      { selectVaccination: "", selectVaccinationDate: "" },
    ]);
  };

  const removeVaccination = (index) => {
    const modifiedVaccinationDetails = [...vaccinationDetails];
    modifiedVaccinationDetails.splice(index, 1);
    setVaccinationDetails(modifiedVaccinationDetails);
    deleteVaccination(index);
  };
  const addDisease = () => {
    setDiseaseDetails([
      ...diseaseDetails,
      { selectDisease: "", selectDate: "" },
    ]);
  };

  const removeDisease = (index) => {
    const modifiedDiseaseDetails = [...diseaseDetails];
    modifiedDiseaseDetails.splice(index, 1);
    setDiseaseDetails(modifiedDiseaseDetails);
    deleteDisease(index);
  };

  const fetchFarmers = async (searchQuery) => {
    setLoadingForFarmersList(true);
    const url = `madmin/farmer/list`;

    const payload = {
      skip: 0,
      searchText: searchQuery,
      search_fields: ["name", "mobile", "user_id"],
      limit: 100,
    };

    if (searchQuery && searchQuery?.length > 0) {
      try {
        const response = await apiRequest({
          url: url,
          method: "POST",
          data: payload,
        });
        const modifiedMandalList = response?.data?.map((farmer) => ({
          title: farmer?.name,
          value: farmer?.user_id,
        }));
        setFarmersList({
          data: modifiedMandalList ? modifiedMandalList : [],
          open: true,
        });
        setLoadingForFarmersList(false);
      } catch (error) {
        setLoadingForFarmersList(false);
      }
    }
  };

  const debouncedOptions = debounce(fetchFarmers, 300);

  const handleInputChange = (event, value) => {
    setValue("farmerId", value); // Update the value of the 'farmerId' field
    clearErrors("farmerId");
    if (value === "") {
      setFarmersList({
        data: [],
        open: false,
      });
      setLoadingForFarmersList(false);
    }
  };

  const getAnimalTypes = () => {
    const payload = {
      skip: 0,
      limit: 1000,
    };
    const url = `madmin/master/types`;
    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          name: animalType?.display_name,
          value: animalType?.id,
        }));
        setAnimalTypes(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVaccinations = () => {
    const payload = {
      skip: 0,
      limit: 1000,
    };
    const url = `madmin/master/vaccines/list`;
    apiRequest({
      url,
      data: payload,
      method: "GET",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          name: animalType?.display_name,
          value: animalType?.id,
        }));
        setVaccinationList({ data: modifiedData });
      })
      .catch((err) => {
        alert(err);
      });
  };
  const getDiseases = () => {
    const payload = {
      skip: 0,
      limit: 1000,
    };
    const url = `madmin/master/diseases/list`;
    apiRequest({
      url,
      data: payload,
      method: "GET",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          name: animalType?.display_name,
          value: animalType?.id,
        }));
        setDiseaseList({ data: modifiedData });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onSubmit = (data) => {
    if (
      !uploadIdImages?.frontSideResponseFiles?.Location ||
      !uploadIdImages?.backSideResponseFiles?.Location
    ) {
      alert("Front Side or Back Side Photos are required For Animal Photso");
      return;
    }

    const choosenDate = new Date(data?.ageInMonths);
    const currentDate = new Date();

    let monthsDifference;
    if (!isNaN(choosenDate.getTime())) {
      const yearsDifference =
        currentDate.getFullYear() - choosenDate.getFullYear();
      monthsDifference =
        currentDate.getMonth() - choosenDate.getMonth() + 12 * yearsDifference;
    } else {
      console.error("Invalid selectVaccinationDate format for choosenDate");
    }

    const disease_list = data?.diseaseDetails
      ? data.diseaseDetails
          ?.filter((disease) => disease.selectDisease && disease.selectDate)
          ?.map((disease) => ({
            item_id: disease.selectDisease,
            date: moment(disease.selectDate).format("DD-MM-YYYY"),
          }))
      : [];
    const vaccine_list = data?.vaccinationDetails
      ? data.vaccinationDetails
          ?.filter(
            (vaccine) =>
              vaccine?.selectVaccination && vaccine?.selectVaccinationDate
          )
          ?.map((vaccine) => ({
            item_id: vaccine?.selectVaccination,
            date: moment(vaccine.selectVaccinationDate).format("DD-MM-YYYY"),
          }))
      : [];

    if (monthsDifference === 0) {
      alert("Age In Months Should be greater than 31 days");
      return;
    }

    const payload = {
      type_id: data?.mithunType,
      farmer_id: data?.farmerId?.value,
      tag_no: data?.tagNo,
      tag_type: data?.tagType,
      details: {
        age_in_months: monthsDifference,
        weight: data?.weight,
        socks: data?.socks,
        no_of_calvings: data?.calvings,
        breeding_type: data?.breeding,
        farthered_by: data?.fatheredBy,
      },
      images: {
        front_image: uploadIdImages?.frontSideResponseFiles?.Location,
        left_image: uploadIdImages?.leftSideResponseFiles?.Location,
        right_image: uploadIdImages?.rightSideResponseFiles?.Location,
        back_image: uploadIdImages?.backSideResponseFiles?.Location,
      },
      muzzle_images: {
        straight_muzzle:
          uploadMuzzleImages?.straightMuzzleResponseFiles?.Location,
        straight_face: uploadMuzzleImages?.straightFaceResponseFiles?.Location,
        top_muzzle: uploadMuzzleImages?.topMuzzleResponseFiles?.Location,
        lower_muzzle: uploadMuzzleImages?.lowerMuzzleResponseFiles?.Location,
        left_muzzle: uploadMuzzleImages?.leftMuzzleResponseFiles?.Location,
        right_muzzle: uploadMuzzleImages?.rightMuzzleResponseFiles?.Location,
        left_face: uploadMuzzleImages?.leftFaceResponseFiles?.Location,
        right_face: uploadMuzzleImages?.rightFaceResponseFiles?.Location,
      },

      insurance_details: {
        value: data?.insuranceValue,
        number: data?.insuranceNumber,
        agent_mobile: data?.agentMobile,
        agent_name: data?.agentName,
        company_name: data?.insuranceCompanyName,
        start_date: moment(data?.startDate)?.valueOf() / 1000,
        end_date: moment(data?.endDate)?.valueOf() / 1000,
        is_insured: data?.isInsured === "false" ? false : true,
      },
      ...(disease_list?.length > 0 && { disease_list }),
      ...(vaccine_list?.length > 0 && { vaccine_list }),
    };

    apiRequest({
      url: `mithun/animal/add`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        reset();
        if (res?.success === true) {
          navigate(`/animals`)
          alert("Animal added successfully");
        } else if (res?.success === false) {
          alert(res?.message);
        }
      })
      .catch((err) => {});
  };
  return (
    <>
      <Grid item xs={4}>
        <Typography
          fontFamily={"Poppins-Medium"}
          fontSize={20}
          color={Colors.textColor}
        >
          Add Mithun
        </Typography>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"114px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Mithun Details
            </Typography>
            <Typography
              mt={2}
              fontFamily={"Poppins-Medium"}
              fontWeight={"500"}
              fontSize={14}
              color={Colors.textColor}
            >
              Basic Info
            </Typography>
          </Box>
          <Box>
            <Grid container mt={2} spacing={2}>
              <Grid xs={4} item>
                <Controller
                  name="farmerId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomAutoComplete
                      {...field}
                      helperText={
                        (error && error?.title?.message) || error?.message
                          ? error?.title?.message || error?.message
                          : ""
                      }
                      s
                      error={!!error}
                      options={farmersList.data}
                      borderColor={"black"}
                      borderRadius={"5px"}
                      handleChange={handleInputChange}
                      width={"100%"}
                      placeholder={"Search & Select Farmer"}
                      open={farmersList.open}
                      onInputChange={(event, value) => {
                        debouncedOptions(value);
                      }}
                      onOpen={() => {
                        setFarmersList({ open: true, data: [] });
                      }}
                      onClose={() => {
                        setFarmersList({ open: false, data: [] });
                      }}
                      loading={loadingForFarmersList}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="tagType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={[
                        {
                          value: "nrcm",
                          name: "NRCM",
                        },
                      ]}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Tag Type"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="tagNo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Tag No"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1} alignItems={"baseline"}>
              <Grid item xs={4}>
                <Controller
                  name="socks"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={[
                        {
                          value: "white",
                          name: "White",
                        },
                      ]}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Socks"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="ageInMonths"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomDatePicker
                      {...field}
                      type={"text"}
                      label={"Age In Months"}
                      disableFuture
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Weight"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1} alignItems={"baseline"}>
              <Grid item xs={4}>
                <Controller
                  name="calvings"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Calvings"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="mithunType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={animalTypes}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Mithun Type"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"154px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Breeding / Mating
            </Typography>
          </Box>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Controller
                  name="breeding"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={[
                        {
                          value: "natural",
                          name: "Natural",
                        },
                      ]}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Breed"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="fatheredBy"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter fatheredBy"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* ////  Vaccinations*/}
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"154px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Vaccination
            </Typography>
          </Box>
          <Box mt={2}>
            {vaccinationDetails.map((item, index) => (
              <Grid container spacing={2} alignItems={"baseline"}>
                <Grid item xs={4}>
                  <Controller
                    name={`vaccinationDetails.${index}.selectVaccination`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectPicker
                        options={VaccinationList.data}
                        {...field}
                        labelText={""}
                        type={"text"}
                        defaultValue={item.selectVaccination}
                        placeholder={"Select Vaccine"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`vaccinationDetails.${index}.selectVaccinationDate`}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <CustomDatePicker
                        {...field}
                        type={"text"}
                        label={"Vaccination Date"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        defaultValue=""
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  {index < 1 && (
                    <Button
                      sx={{
                        border: "1px solid #B1040E",
                        fontSize: "12px",
                        marginTop: "14px",
                        color: "#B1040E",
                      }}
                      onClick={() => addVaccination()}
                    >
                      Add
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      sx={{
                        border: "1px solid #B1040E",
                        color: "#B1040E",
                        marginTop: "14px",
                        fontSize: "12px",
                      }}
                      onClick={() => removeVaccination(index)}
                    >
                      Delete
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>

        {/* /// Add Disease */}
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"154px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Disease
            </Typography>
          </Box>
          <Box mt={2}>
            {diseaseDetails.map((item, index) => (
              <Grid container spacing={2} alignItems={"baseline"}>
                <Grid item xs={4}>
                  <Controller
                    name={`diseaseDetails.${index}.selectDisease`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectPicker
                        options={diseaseList.data}
                        {...field}
                        labelText={""}
                        type={"text"}
                        defaultValue={item.selectDisease}
                        placeholder={"Select Disease"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`diseaseDetails.${index}.selectDate`}
                    defaultValue=""
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomDatePicker
                        {...field}
                        type={"text"}
                        label={"Disease Date"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        defaultValue={""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  {index < 1 && (
                    <Button
                      sx={{
                        border: "1px solid #B1040E",
                        fontSize: "12px",
                        marginTop: "14px",
                        color: "#B1040E",
                      }}
                      onClick={() => addDisease()}
                    >
                      Add
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      sx={{
                        border: "1px solid #B1040E",
                        color: "#B1040E",
                        marginTop: "14px",
                        fontSize: "12px",
                      }}
                      onClick={() => removeDisease(index)}
                    >
                      Delete
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>

        {/* // Add Insurance Details */}
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"154px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Insurance Details
            </Typography>
          </Box>
          <Box>
            <Grid container mt={2} spacing={2}>
              <Grid xs={4} item>
                <Controller
                  name="agentName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Agent Name"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="agentMobile"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Agent Mobile"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="insuranceCompanyName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Insurance Company"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1} alignItems={"baseline"}>
              <Grid item xs={4}>
                <Controller
                  name="insuranceValue"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Insurance Value"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="insuranceNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Insurance Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="isInsured"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={[
                        {
                          value: "false",
                          name: "false",
                        },
                      ]}
                      {...field}
                      labelText={""}
                      type={"text"}
                      placeholder={"Select Is Insured"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1} alignItems={"baseline"}>
              <Grid item xs={4}>
                <Controller
                  name={`startDate`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomDatePicker
                      {...field}
                      type={"text"}
                      label={"start Date"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`endDate`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomDatePicker
                      {...field}
                      type={"text"}
                      label={"End Date"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* //// Animal Photos */}
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"140px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Animal Photos
            </Typography>
          </Box>

          <Grid container alignItems={"center"}>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"frontSide"}
                    uploadIdImages={uploadIdImages}
                    setUploadedFiles={setUploadIdImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"animalPhotos"}
                    heading={`${
                      uploadIdImages?.frontSideResponseFiles?.Location
                        ? ""
                        : "Upload Front Side Image"
                    }`}
                    image={
                      uploadIdImages?.frontSideResponseFiles?.Location
                        ? uploadIdImages?.frontSideResponseFiles?.Location
                        : null
                    }
                    uploadType={"frontSide"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Front Image
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"backSide"}
                    uploadIdImages={uploadIdImages}
                    setUploadedFiles={setUploadIdImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"animalPhotos"}
                    heading={`${
                      uploadIdImages?.backSideResponseFiles?.Location
                        ? ""
                        : "Upload back Side Image"
                    }`}
                    image={
                      uploadIdImages?.backSideResponseFiles?.Location
                        ? uploadIdImages?.backSideResponseFiles?.Location
                        : null
                    }
                    uploadType={"backSide"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Back Image
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"leftSide"}
                    uploadIdImages={uploadIdImages}
                    setUploadedFiles={setUploadIdImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"animalPhotos"}
                    heading={`${
                      uploadIdImages?.leftSideResponseFiles?.Location
                        ? ""
                        : "Upload Left Side Image"
                    }`}
                    image={
                      uploadIdImages?.leftSideResponseFiles?.Location
                        ? uploadIdImages?.leftSideResponseFiles?.Location
                        : null
                    }
                    uploadType={"leftSide"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Left Image
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"rightSide"}
                    uploadIdImages={uploadIdImages}
                    setUploadedFiles={setUploadIdImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"animalPhotos"}
                    heading={`${
                      uploadIdImages?.rightSideResponseFiles?.Location
                        ? ""
                        : "Upload right Side Image"
                    }`}
                    image={
                      uploadIdImages?.rightSideResponseFiles?.Location
                        ? uploadIdImages?.rightSideResponseFiles?.Location
                        : null
                    }
                    uploadType={"rightSide"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Right Image
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* /// animal photos ends here*/}

        {/* ////   muzzle upload starts here*/}
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Typography
              fontFamily={"Poppins-Medium"}
              borderBottom={"2px solid #B1040E"}
              width={"130px"}
              fontSize={16}
              color={"#B1040E"}
              fontWeight={"500"}
            >
              Muzzle Photos
            </Typography>
          </Box>

          <Grid container alignItems={"center"}>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"straightMuzzle"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.straightMuzzleResponseFiles?.Location
                        ? ""
                        : "Upload Straight Muzzle"
                    }`}
                    image={
                      uploadMuzzleImages?.straightMuzzleResponseFiles?.Location
                        ? uploadMuzzleImages?.straightMuzzleResponseFiles
                            ?.Location
                        : null
                    }
                    uploadType={"straightMuzzle"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Straight Muzzle
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"straightFace"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.straightFaceResponseFiles?.Location
                        ? ""
                        : "Upload Straight Face"
                    }`}
                    image={
                      uploadMuzzleImages?.straightFaceResponseFiles?.Location
                        ? uploadMuzzleImages?.straightFaceResponseFiles
                            ?.Location
                        : null
                    }
                    uploadType={"straightFace"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Straight Face
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"topMuzzle"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.topMuzzleResponseFiles?.Location
                        ? ""
                        : "Upload Top Muzzle "
                    }`}
                    image={
                      uploadMuzzleImages?.topMuzzleResponseFiles?.Location
                        ? uploadMuzzleImages?.topMuzzleResponseFiles?.Location
                        : null
                    }
                    uploadType={"topMuzzle"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Top Muzzle
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"lowerMuzzle"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.lowerMuzzleResponseFiles?.Location
                        ? ""
                        : "Upload Lower Muzzle "
                    }`}
                    image={
                      uploadMuzzleImages?.lowerMuzzleResponseFiles?.Location
                        ? uploadMuzzleImages?.lowerMuzzleResponseFiles?.Location
                        : null
                    }
                    uploadType={"lowerMuzzle"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Lower Muzzle
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"leftMuzzle"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.leftMuzzleResponseFiles?.Location
                        ? ""
                        : "Upload Left Muzzle "
                    }`}
                    image={
                      uploadMuzzleImages?.leftMuzzleResponseFiles?.Location
                        ? uploadMuzzleImages?.leftMuzzleResponseFiles?.Location
                        : null
                    }
                    uploadType={"leftMuzzle"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Left Muzzle
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"rightMuzzle"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.rightMuzzleResponseFiles?.Location
                        ? ""
                        : "Upload right Muzzle "
                    }`}
                    image={
                      uploadMuzzleImages?.rightMuzzleResponseFiles?.Location
                        ? uploadMuzzleImages?.rightMuzzleResponseFiles?.Location
                        : null
                    }
                    uploadType={"rightMuzzle"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  right Muzzle
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"leftFace"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.leftFaceResponseFiles?.Location
                        ? ""
                        : "Upload Left Face "
                    }`}
                    image={
                      uploadMuzzleImages?.leftFaceResponseFiles?.Location
                        ? uploadMuzzleImages?.leftFaceResponseFiles?.Location
                        : null
                    }
                    uploadType={"leftFace"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Left Face
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} alignItems={"center"}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"20px"}
                flexDirection={"column"}
              >
                <Box
                  border="1px dashed #F47821"
                  borderRadius={5}
                  mt={2}
                  width={"180px"}
                >
                  <FileUploader
                    key={"rightFace"}
                    uploadMuzzleImages={uploadMuzzleImages}
                    setUploadMuzzleImages={setUploadMuzzleImages}
                    accept={"image/png,image/jpeg,image/jpg"}
                    displayType={"muzzlePhotos"}
                    heading={`${
                      uploadMuzzleImages?.rightFaceResponseFiles?.Location
                        ? ""
                        : "Upload Right Face "
                    }`}
                    image={
                      uploadMuzzleImages?.rightFaceResponseFiles?.Location
                        ? uploadMuzzleImages?.rightFaceResponseFiles?.Location
                        : null
                    }
                    uploadType={"rightFace"}
                  />
                </Box>
                <Typography fontFamily={"poppins"} fontSize={"13px"}>
                  Left Face
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={4}
          gap={3}
        >
          {/* <Grid item>
            <CustomButton
              title={`reset`}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={130}
              height={34}
              borderColor={"#B1040E"}
              borderRadius={2}
              border={"1px solid #B1040E"}
              handleButtonClick={() => reset({ ageInMonths: "" })}
              textFontSize={14}
            />
          </Grid> */}
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
              type={"submit"}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddAnimal;
