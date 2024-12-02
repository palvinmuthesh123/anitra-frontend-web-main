import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import { useAppContext } from "../../context/AppContext";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { debounce } from "lodash";

const AddHamlet = (props) => {
  const { openCurrentModal, isEdit } = props;

  const { user } = useAppContext();

  const [statesList, setStatesList] = useState([]);

  const [DistrictList, setDistrictList] = useState([]);

  const [MandalLists, setMandalList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [villageSearchQuery, setVillageSearchQuery] = useState({
    data: [],
  });

  const [openVillageList, setOpenVillageList] = useState(false);


  const getDefaultValues = (isEdit, openCurrentModal) => {
    if (!isEdit && openCurrentModal.data) {
      return {
        name: "",
        selectVillage: {
          title: "",
          value: "",
        },
      };
    } else {
      return {
        name: openCurrentModal.data?.row?.display_name,
        selectVillage: {
          title: openCurrentModal.data?.row?.village_name,
          value: openCurrentModal.data?.row?.village_id,
        },
      };
    }
  };

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    // resolver: yupResolver(schema),
    defaultValues: getDefaultValues(isEdit, openCurrentModal),
  });

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (watch("selectState")) {
      getDistrictList(watch("selectState"));
    }
  }, [watch("selectState")]);

  useEffect(() => {
    if (watch("selectDistrict")) getMandalsList(watch("selectDistrict"));
  }, [watch("selectDistrict")]);

  const getStates = () => {
    apiRequest({
      url: `master/states`,
      method: "GET",
    })
      .then((res) => {
        const getStatesList = res?.data?.map((state) => ({
          name: state?.name,
          value: state?.id,
        }));
        setStatesList(getStatesList);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };
  const getDistrictList = (stateName) => {
    const payload = {
      limit: 10,
      skip: 10,
      state_id: stateName,
      active: true,
      matchStart: true,
    };
    apiRequest({
      url: `master/districts`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getDistrictList = res?.data?.map((mandal) => ({
          name: mandal?.name,
          value: mandal?.id,
        }));
        setDistrictList(getDistrictList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getMandalsList = (districtName) => {
    const payload = {
      limit: 10,
      skip: 10,
      active: true,
      matchStart: true,
      district_id: districtName,
    };
    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getMandalList = res?.data?.map((mandal) => ({
          name: mandal?.name,
          value: mandal?.id,
        }));
        setMandalList(getMandalList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const fetchVillages = async (searchQuery) => {
    setLoading(true);
    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    const payload = {
      skip: 0,
      searchText: searchQuery,
      limit: 100,
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
        setLoading(false);

        setVillageSearchQuery({
          data: modifiedMandalList,
        });
      } else {
        const modifiedMandalList = response?.data?.map((village) => ({
          tile: village?.Block,
          value: village?.Block,
        }));
        setLoading(false);
        setVillageSearchQuery({
          data: modifiedMandalList ? modifiedMandalList : [],
        });
      }
    } catch (error) {}
    setLoading(false);
  };

  const debouncedOptions = debounce(fetchVillages, 300);

  const handleInputChange = (event, value) => {
    setValue("selectVillage", value); // Update the value of the 'selectVillage' field
    clearErrors("selectVillage");
    if (value === "") {
      setVillageSearchQuery({
        data: [],
      });
    }
  };

  const onSubmit = (data) => {
    if (isEdit && openCurrentModal) {
    
      const payload = {
        name: data.name,
        local_name: data.name,
        num_id: data.selectVillage?.value.toString(),
      };
      apiRequest({
        url: `master/update-hamlet/${openCurrentModal.data?.row?.id}`,
        data: payload,
        method: "PUT",
      })
        .then((res) => {
          if (res?.success === true) {
            alert(res?.message);
          } else if (res?.success === false) {
            alert(res?.message);
          }
          props.getHamletList()
          props.onClose()
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    } else {
      const payload = {
        name: data.name,
        local_name: data.name,
        village_id: data.selectVillage?.value,
      };
      apiRequest({
        url: `master/add-hamlet`,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          if (res?.success === true) {
            alert(res?.message);
          } else if (res?.success === false) {
            alert(res?.message);
          }
          props.getHamletList()
          props.onClose()
        })
        .catch((err) => {
          alert(err?.response?.data?.message, "error");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container mt={4} gap={2} width={"100%"}>
          <Grid item width={"100%"}>
            <Box display={"flex"} gap={"10px"} width={"100%"}>
              <Grid item width={"100%"}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Display name"}
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
          </Grid>

          <Grid display={"flex"} gap={"10px"} width={"100%"}>
            <Grid item width={"100%"}>
              <Controller
                name="selectDistrict"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={DistrictList}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select District"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item width={"100%"}>
              <Controller
                name="selectMandal"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={MandalLists}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select Mandal"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid item width={"50%"}>
            <Controller
              name="selectVillage"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomAutoComplete
                  {...field}
                  helperText={error ? error.message : ""}
                  error={!!error}
                  options={villageSearchQuery.data}
                  borderColor={"black"}
                  borderRadius={"5px"}
                  handleChange={handleInputChange}
                  width={"100%"}
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
                handleButtonClick={() => props.onClose()}
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
        </Grid>
      </form>
    </>
  );
};

export default AddHamlet;
