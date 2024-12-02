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
import { useAppContext } from "../../context/AppContext";

const AddEditAnimalType = (props) => {
  const { isEdit, currentTypeDetails, onClickModalClose } = props;

  const [categoryList, setCategoriesList] = useState([]);

  const { user } = useAppContext();

  useEffect(() => {
    if (user?.role?.code === "admin") {
      gatCategories();
    }
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
      typeName: yup.string().required("Type Name is required"),
      ...(user?.role?.code === "admin" && {
        categoryId: yup.string().required("Category is required"),
      }),
      ...(user?.role?.code === "mithunAdmin" && {
        localName: yup.string().required("Local Name is required"),
      }),
    })
    .required();

  const getEditUserDetails = (isEdit, currentTypeDetails) => {
    if (!isEdit) {
      return { typeName: "", categoryId: "" };
    } else {
      return {
        typeName: currentTypeDetails?.displayName,
        categoryId: currentTypeDetails?.categoryId,
      };
    }
  };

  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(isEdit, currentTypeDetails),
  });

  const onSubmit = (data) => {
    if (isEdit && currentTypeDetails?.id) {
      const formData = getValues();
      const payload = {
        type_name: formData?.typeName,
        type_display_name: formData?.typeName,
        type_local_name: formData?.typeName,
      };
      apiRequest({
        url: `master/update-type/${currentTypeDetails?.id}`,
        data: payload,
        method: "PUT",
      })
        .then((res) => {
          if (res?.success === true) {
            alert(res?.message);
          }
          if (res?.success === false) {
            alert(res?.message);
          }
          props.onClickModalClose(true);
          props.getTypes();
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        type_name: data?.typeName,
        category_id: data?.categoryId,
      };

      const mithunPayload = {
        type_name: data?.typeName,
        local_name: data?.localName,
      };

      const URL =
        user?.role?.code === "admin"
          ? "master/add-type"
          : "madmin/master/add-type";
      apiRequest({
        url: URL,
        data: user?.role?.code === "admin" ? payload : mithunPayload,
        method: "POST",
      })
        .then((res) => {
          if (res?.success === true) {
            alert("Animal Type Added successfully");
          }
          if (res?.success === false) {
            alert(res?.message);
          }
          props.onClickModalClose(true);
          props.getTypes();
        })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          display={"flex"}
          alignItems={"flex-end"}
          justifyContent={"center"}
          mt={"10px"}
          gap={3}
          width={"100%"}
        >
          <Grid item width={"45%"}>
            <Controller
              name="typeName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  type={"text"}
                  inputLabel={"Enter Animal type name"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
          {user?.role?.code === "admin" && (
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
                      placeholder={"Select Animal Category"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Box>
            </Grid>
          )}
          {user?.role?.code === "mithunAdmin" && (
            <Grid item width={"45%"}>
              <Controller
                name="localName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter Local name"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>

        <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={"20px"}
          gap={2}
        >
          <Grid item>
            <CustomButton
              title={`Cancel`}
              handleButtonClick={onClickModalClose}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={"100%"}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
              variant={"outlined"}
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

export default AddEditAnimalType;
