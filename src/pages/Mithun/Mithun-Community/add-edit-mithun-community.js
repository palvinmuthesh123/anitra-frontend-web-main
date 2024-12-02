import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CustomButton from "../../../components/Button";
import CustomInput from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../../constants/Colors";
import { apiRequest } from "../../../services/api-request";
import SelectPicker from "../../../components/SelectPicker";
import { useAppContext } from "../../../context/AppContext";

const AddEditMithunCommunity = (props) => {
  const { onClose, isEdit, currentCommunity } = props;

  const schema = yup
    .object({
      societyName: yup.string().required("Society name is required"),
      selectState: yup.string().required("State is required"),
    })
    .required();

  const getEditTribes = (isEdit, currentCommunity) => {
    if (!isEdit) {
      return { societyName: "", selectState: "" };
    } else {
      return {
        societyName: currentCommunity?.data?.societyName,
        selectState: currentCommunity?.data?.state,
      };
    }
  };

  const { handleSubmit, control,  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditTribes(isEdit, currentCommunity),
  });

  const [statesList, setStatesList] = useState([]);

  const { user } = useAppContext();

  useEffect(() => {
    getStates();
  }, []);

  const getStates = () => {
    const URL =
      user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    apiRequest({
      url: URL,
      method: "POST",
    })
      .then((res) => {
        const getStates = res?.data?.map((state) => ({
          name: state?.State,
          value: state?._id,
        }));
        setStatesList(getStates);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const onSubmit = (data) => {
    if (isEdit) {
      const payload = {
        new_name: data.societyName,
      };
      apiRequest({
        url: `madmin/master/update-community/${currentCommunity?.data?.communityID}`,
        data: payload,
        method: "PUT",
      })
        .then((res) => {
          if (res?.success === true) {
            alert("Edited Successfully");
          }
          props.onClose();
          props.allCommunity();
        })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        name: data.societyName,
        state_name: data.selectState,
      };
      apiRequest({
        url: `madmin/master/add-community`,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          if (res?.success === true) {
            alert("Added Mithun Community");
          }
          props.onClose();
          props.allCommunity();
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
        <Grid container mt={"10px"} gap={2} width={"100%"}>
          <Grid item width={"100%"}>
            <Box display={"flex"} gap={"10px"} width={"100%"}>
              <Grid item width={"100%"}>
                <Controller
                  name="societyName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Mithun Society Name"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item width={"100%"}>
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
                    />
                  )}
                />
              </Grid>
            </Box>

            <Grid
              display={"flex"}
              gap={"10px"}
              justifyContent={"space-between"}
              width={"100%"}
              marginTop={"23px"}>
              <Grid
                item
                width={"100%"}
                justifyContent={"end"}
                display={"flex"}
                gap={"10px"}>
                <Grid item>
                  <CustomButton
                    title={`Cancel`}
                    variant={"outlined"}
                    backgroundColor={Colors.white}
                    textColor={Colors.headerColor}
                    width={80}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                    handleButtonClick={() => onClose()}
                  />
                </Grid>
                <Grid item>
                  <CustomButton
                    title={`Submit`}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={80}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                    type={"submit"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddEditMithunCommunity;
