import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";

const AddEditBreed = (props) => {
  const { isEdit, currentBreedDetails, onClickModalClose } = props;

  const [categoryList, setCategoriesList] = useState([]);

  useEffect(() => {
    gatCategories();
  }, []);

  const gatCategories = () => {
    apiRequest({
      url: `master/categories`,
      data: {},
      method: "GET",
    })
      .then((res) => {
        const modifiedCategoryList = res?.data?.map((category) => ({
          name: category?.display_name,
          value: category?.id,
        }));
        setCategoriesList(modifiedCategoryList);
      })
      .catch((err) => {
        console.log(err);
        alert(err?.response?.data?.message, "error");
      });
  };

  const schema = yup
    .object({
      breedName: yup.string().required("Breed Name is required"),
      categoryId: yup.string().required("Category is required"),
    })
    .required();

  console.log(currentBreedDetails);
  const getEditUserDetails = (isEdit, currentBreedDetails) => {
    if (!isEdit && !currentBreedDetails) {
      return { breedName: "", categoryId: "" };
    } else {
      return {
        breedName: currentBreedDetails?.breedName,
        categoryId: currentBreedDetails?.categoryId,
      };
    }
  };

  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(isEdit, currentBreedDetails),
  });

  const onSubmit = (data) => {
    if (isEdit && currentBreedDetails?.id) {
      const formData = getValues();
      const payload = {
        breed_name: formData?.breedName,
        breed_display_name: formData?.breedName,
        breed_local_name: formData?.breedName,
      };
      apiRequest({
        url: `master/update-breed/${currentBreedDetails?.id}`,
        data: payload,
        method: "PUT",
      })
        .then((res) => {
          props.onClickModalClose(true);
          props.getBreeds();
          if (res?.success === true) {
            alert(res?.message);
          }
          if (res?.success === false) {
            alert(res?.message);
          }
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        breed_name: data?.breedName,
        category_id: data?.categoryId,
      };

      apiRequest({
        url: `master/add-breed`,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res, "hi");
          props.onClickModalClose(true);
          props.getBreeds();
          if (res?.success === true) {
            alert(res?.message);
          }
          if (res?.success === false) {
            alert(res?.message);
          }
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          mt={"10px"}
          gap={2}
          width={"100%"}
        >
          <Grid item width={"45%"}>
            <Controller
              name="breedName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  type={"text"}
                  inputLabel={"Breed Name"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
          <Grid item width={"45%"}>
            <Box>
              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={categoryList}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select Category"}
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
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={"30px"}
          gap={2}
        >
          <Grid item>
            <CustomButton
              title={`Cancel`}
              variant={"outlined"}
              handleButtonClick={onClickModalClose}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              borderColor={Colors.headerColor}
              textFontSize={14}
              width={"100%"}
              height={34}
            />
          </Grid>
          <Grid item>
            <CustomButton
              title={`Save`}
              backgroundColor={Colors.headerColor}
              textColor={Colors.white}
              width={"100%"}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
              type={"submit"}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditBreed;
