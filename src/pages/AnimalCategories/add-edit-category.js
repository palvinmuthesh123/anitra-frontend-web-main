import React from "react";
import { Grid } from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";

const AddEditCategory = (props) => {
  const { isEdit, currentCategory, closeModal } = props;

  const schema = yup
    .object({
      categoryName: yup.string().required("Category Name is required"),
    })
    .required();

  const { handleSubmit, control,  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: !isEdit
      ? { categoryName: "" }
      : { categoryName: currentCategory?.data?.animalCategory },
  });

  const onSubmit = (data) => {
    if (isEdit && currentCategory) {
      const payload = {
        category_name: data.categoryName,
        local_name: data.categoryName,
      };
      apiRequest({
        url: `master/update-Category/${currentCategory?.data?.id}`,
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
          props.getCategories();
          props.closeModal();
        })
        .catch((err) => {});
    } else {
      const payload = {
        category_name: data.categoryName,
        local_name: data.categoryName,
      };
      apiRequest({
        url: `master/add-category`,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          if (res?.success === true) {
            alert(res?.message);
          }
          if (res?.success === false) {
            alert(res?.message);
          }
          props.getCategories();
          props.closeModal();
        })
        .catch((err) => {});
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid>
          <Grid container mt={"10px"} display={"flex"} flexDirection={""}>
            <Controller
              name="categoryName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  type={"text"}
                  inputLabel={"Enter Animal Category Name"}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid
          container
          alignItems={"center"}
          justifyContent={"flex-end"}
          mt={"24px"}
          gap={"12px"}
        >
          <Grid item>
            <CustomButton
              variant={"outlined"}
              title={`Cancel`}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={"100%"}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
              handleButtonClick={() => closeModal()}
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

export default AddEditCategory;
