import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import CustomDatePicker from "../../components/DatePicker";
import moment from "moment";
import "moment-timezone";
const BasicInfoForm = (props) => {
  const { animalId, userAnimalDetails, transport, milk } = props;
  const [animalBreeds, setAnimalBreeds] = useState({
    data: [],
    totalCount: "",
  });

  const [animalTypes, setAnimalTypes] = useState({
    data: [],
    totalCount: "",
  });

  const schema = yup
    .object({
      animalType: yup.string().required("Animal Type is required"),
      animalBreed: yup.string().required("Animal Breed is required"),
      ageInMonths: yup.string().required("Age is required"),
      purchaseFrom: yup.string().required("Purchase From is required"),
    })
    .required();

  const getEditUserDetails = (isEdit, userAnimalDetails) => {
    const createdDate = userAnimalDetails?.created_on;
    const utcDate = new Date(createdDate);
    const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");

    const istDateEndsAt = moment(istDateTimeEndsAt, "YYYY-MM-DD]");

    const updatedDate = userAnimalDetails?.updated_on;
    const utcUpdatedDate = new Date(updatedDate);
    const istUpdatedDateTimeEndsAt = moment
      .utc(utcUpdatedDate)
      .tz("Asia/Kolkata");

    const istUpdatedDateEndsAt = moment(istUpdatedDateTimeEndsAt, "YYYY-MM-DD");

    const verifiedDate = userAnimalDetails?.verification_details?.verified_on;
    const utcverifiedDate = new Date(verifiedDate);
    const istverifiedDateTimeEndsAt = moment
      .utc(utcverifiedDate)
      .tz("Asia/Kolkata");

    const istVerifiedDateEndsAt = moment(
      istverifiedDateTimeEndsAt,
      "YYYY-MM-DD"
    );

    if (!isEdit) {
      return {
        animalId: userAnimalDetails?.id,
        animalTag: userAnimalDetails?.tag_no,
        animalType: userAnimalDetails?.type?.id,
        animalBreed: userAnimalDetails?.breed?.id,
        ageInMonths: userAnimalDetails?.details?.age_in_months,
        purchaseFrom: userAnimalDetails?.purchase_details?.purchased_from,
        createdAt: istDateEndsAt,
        updatedAt: istUpdatedDateEndsAt,
      };
    } else {
      return {
        animalId: userAnimalDetails?.id,
        animalTag: userAnimalDetails?.tag_no,
        animalType: userAnimalDetails?.type?.id,
        animalBreed: userAnimalDetails?.breed?.id,
        ageInMonths: userAnimalDetails?.details?.age_in_months,
        purchaseFrom: userAnimalDetails?.purchase_details?.purchased_from,
        createdAt: "22 Sept 2022",
        updatedAt: "22 Sept 2022",
      };
    }
  };

  const { handleSubmit, control, getValues } =

    useForm({
      resolver: yupResolver(schema),
      defaultValues: getEditUserDetails(props?.isEdit, userAnimalDetails),
    });

    // useEffect(()=> {
    //   console.log(getValues())
    // },[getValues().ageInMonths, getValues().animalBreed, getValues().animalId,
    //   getValues().animalTag, getValues().animalType, getValues().createdAt,
    //   getValues().purchaseFrom, getValues().updatedAt, 
    //   // getValues().milk, getValues().transport
    // ])

  useEffect(() => {
    if (userAnimalDetails?.breed) {
      getBreeds();
    }
  }, []);

  useEffect(() => {
    if (userAnimalDetails?.type) {
      getTypes();
    }
  }, []);

  const calcs = () => {
    // console.log(getTypes().milk, getTypes().transport)
  }

  const onSubmit = (data) => {
    const formValues = getValues();
    const payload = {};

    apiRequest({
      url: `animal/update${animalId}`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        // console.log(err);
        alert(err?.response?.data?.message, "error");
      });
  };

  const getBreeds = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    apiRequest({
      url: `master/breeds`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((categories) => ({
          value: categories?.id,
          name: categories?.name,
          breedName: categories?.display_name,
          localName: categories?.local_name,
          categoryId: categories?.category_id,
          categoryName: categories?.category_name,
        }));
        setAnimalBreeds({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getTypes = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    const url = `master/types`;

    apiRequest({
      url: url,
      method: "POST",
      data: payload,
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          value: animalType?.id,
          name: animalType?.name,
          displayName: animalType?.display_name,
          categoryName: animalType?.category_name,
          categoryId: animalType?.category_id,
          active: animalType?.active,
        }));
        setAnimalTypes({
          totalCount: res?.total_count,
          data: modifiedData,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          alignItems={"end"}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid container spacing={1} mt={"5px"}>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="animalId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Animal Id"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      disabled={true}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="animalTag"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Animal Tag"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      disabled={true}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="animalType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SelectPicker
                      options={animalTypes.data}
                      {...field}
                      type={"text"}
                      placeholder={"Select Animal Type"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={"20px"}>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="animalBreed"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    // console.log(field, "FFFFFFFFFFFFFF")
                    // var vals = animalBreeds.data.map((item, index)=> {
                    //   if(item.value == field.value) {
                    //     return item
                    //   }
                    // })
                    // props.breedChange(vals);
                    return (
                    <Box>
                      <SelectPicker
                        options={animalBreeds.data}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Breed"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    </Box>
                  )}}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="ageInMonths"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    // console.log(field, "FFFFFFFFFFFFFF")
                    // props.ageChange(field.value);
                    return (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Age in Months"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="purchaseFrom"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Purchase From"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={"12px"}>
            <Grid item xs={4}>
              <Box>
                {
                  <Controller
                    name="createdAt"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomDatePicker
                        {...field}
                        type={"text"}
                        label={"Created Date"}
                        disabled={true}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                }
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Controller
                  name="updatedAt"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomDatePicker
                      {...field}
                      type={"text"}
                      label={"Updated Date"}
                      disabled={true}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={4} style={{marginTop: '15px'}}>
              <Box>
                <Controller
                  name="transport"
                  control={control}
                  render={({ field, fieldState: { error } }) => 
                    {
                    // console.log(field, "FFFFFFFFFFFFFF")
                    props.onValueChange(field.value);
                    // if(field && field.value)
                    // {
                    //   localStorage.setItem('transs', field.value.toString())
                    // }
                    calcs();
                    return(
                    <Box>
                      <SelectPicker
                        options={transport}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Transportation"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    </Box>
                  )}}
                />
              </Box>
            </Grid> */}
          </Grid>
          {/* <Grid container spacing={1} mt={"12px"}>
            <Grid item xs={4} style={{marginTop: '15px'}}>
              <Box>
                <Controller
                  name="milk"
                  control={control}
                  render={({ field, fieldState: { error } }) => 
                    {
                    // console.log(field, "FFFFFFFFFFFFFF")
                    props.onValueChange1(field.value);
                    // if(field && field.value)
                    // {
                    //   localStorage.setItem('milks', field.value.toString())
                    // }
                    calcs();
                    return(
                    <Box>
                      <SelectPicker
                        options={milk}
                        {...field}
                        labelText={""}
                        type={"text"}
                        placeholder={"Select Balance Milk"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    </Box>
                    )}}
                />
              </Box>
            </Grid>
          </Grid> */}
        </Grid>
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
              type={"submit"}
            />
          </Grid>
        </Grid> */}
      </form>
    </>
  )

};
export default BasicInfoForm;
