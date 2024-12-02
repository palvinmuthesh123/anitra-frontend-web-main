import { Grid, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../../constants/Colors";
import {
  ConvertMonthsToYearsMonthsDays,
  EpochFormatDate,
} from "../../../utilities/date-utility";
import { CustomTab } from "../../../components/CustomTabs";
import BreedingMatingDetails from "./mithunSubDetails/mithun-sub-details";
import MithunVaccinationDetails from "./mithunSubDetails/vaccination";
import MithunDiseasesDetails from "./mithunSubDetails/diseases";
import MithunInsuranceDetails from "./mithunSubDetails/Insurance";
import MithunPhotosDetails from "./mithunSubDetails/mithunPhotos";

const MithunBasicInfo = (props) => {
  const { userDetails } = props;

  const schema = yup
    .object({
      animalType: yup.string().required("Animal Type is required"),
      animalBreed: yup.string().required("Animal Breed is required"),
      ageInMonths: yup.string().required("Age is required"),
      purchaseFrom: yup.string().required("Purchase From is required"),
    })
    .required();

  const getEditUserDetails = (userDetails) => ({
    tagType: userDetails?.tag_type,
    tagId: userDetails?.tag_no,
    mithunType: userDetails?.type_name,
    socks: userDetails?.details?.socks,
    ageInMonths: ConvertMonthsToYearsMonthsDays(
      userDetails?.details?.age_in_months
    ),
    weight: userDetails?.details?.weight,
    calvings: userDetails?.details?.no_of_calvings,
    createdDate: EpochFormatDate(userDetails?.created_on),
    updatedDate: EpochFormatDate(userDetails?.updated_on),
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(userDetails),
  });

  const onSubmit = () => {};

  const OtherDetails = () => {
    const subTabs = [
      {
        id: 1,
        title: "Breeding Mate",
      },
      {
        id: 2,
        title: `Vaccination`,
      },
      {
        id: 3,
        title: "Disease",
      },
      {
        id: 4,
        title: `Insurance`,
      },
      {
        id: 5,
        title: "Photos",
      },
      {
        id: 6,
        title: `Muzzle`,
      },
    ];

    const [subTab, setSubTab] = useState(subTabs[0]);

    return (
      <>
        <Box mt={2}>
          <CustomTab
            margin={"0px"}
            data={subTabs}
            tab={subTab}
            setTab={setSubTab}
          />
          {subTab.id === 1 && (
            <BreedingMatingDetails userDetails={userDetails} />
          )}
          {subTab.id === 2 && (
            <MithunVaccinationDetails userDetails={userDetails} />
          )}
          {subTab.id === 3 && (
            <MithunDiseasesDetails userDetails={userDetails} />
          )}
          {subTab.id === 4 && (
            <MithunInsuranceDetails userDetails={userDetails} />
          )}
          {subTab.id === 5 && <MithunPhotosDetails userDetails={userDetails} />}
        </Box>
      </>
    );
  };

  return (
    <>
      <Box m={2}>
        <Typography
          fontFamily={"Poppins-Medium"}
          fontSize={13}
          color={Colors.textColor}
        >
          Basic Details
        </Typography>
        <Box mt={"20px"}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid
              container
              alignItems={"baseline"}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={4}>
                <Box>
                  <Controller
                    name="tagType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Tag Type"}
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
                    name="tagId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Tag Id"}
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
                    name="mithunType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Select Mithun Type"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="socks"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Box>
                        <CustomInput
                          {...field}
                          inputLabel={"Socks"}
                          type={"text"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          disabled={true}
                        />
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="ageInMonths"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Enter Age in Months"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Weight"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="calvings"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Calvings"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="createdDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Created At"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} mt={"10px"}>
                <Box>
                  <Controller
                    name="updatedDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        type={"text"}
                        inputLabel={"Updated Date"}
                        error={!!error}
                        helperText={error ? error.message : ""}
                        disabled={true}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
            {/* <Grid
              container
              alignItems={"center"}
              justifyContent={"flex-end"}
              mt={4}
              gap={3}>
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
        <Box mt={"20px"}>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={13}
            color={Colors.textColor}
          >
            Other Details
          </Typography>
        </Box>
        {OtherDetails()}
      </Box>
    </>
  );
};

export default MithunBasicInfo;
