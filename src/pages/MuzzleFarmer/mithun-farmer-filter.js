import React, { useEffect, useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import { apiRequest } from "../../services/api-request";
import { useForm, Controller } from "react-hook-form";
import SelectPicker from "../../components/SelectPicker";
import CustomInput from "../../components/Input";

const MithunFarmerFilter = (props) => {
  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [villageList, setVillageList] = useState([]);

  const { handleSubmit, control, watch, reset, getValues } = useForm({
    defaultValues: {
      selectState: "",
      district: "",
      selectMandal: "",
      selectVillage: "",
    },
  });

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (watch("selectState")) {
      setDistrictList([]);
      setMandalList([]);
      setVillageList([]);
      getDistrictList(watch("selectState"));
    }
  }, [watch("selectState")]);

  useEffect(() => {
    if (watch("district")) {
      setMandalList([]);
      setVillageList([]);

      getMandalList(watch("district"));
    }
  }, [watch("district")]);

  useEffect(() => {
    if (watch("selectMandal")) {
      setVillageList([]);

      getVillageList(watch("selectMandal"));
    }
  }, [watch("selectMandal")]);

  const getStates = () => {
    apiRequest({
      url: `madmin/master/states`,
      method: "POST",
    })
      .then((res) => {
        const modifiedStateList = res?.data?.map((state) => ({
          name: state?._id,
          value: state?.State,
        }));
        setStatesList(modifiedStateList);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getDistrictList = (stateId) => {
    const payload = {
      state_name: stateId,
      limit: 100,
    };
    apiRequest({
      url: `madmin/master/districts`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getDistrictList = res?.data?.map((district) => ({
          name: district?._id,
          value: district?.District,
        }));
        setDistrictList(getDistrictList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getMandalList = (districtId) => {
    const payload = {
      district_name: districtId,
      limit: 1000,
    };
    apiRequest({
      url: `madmin/master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getMandalList = res?.data?.map((mandal) => ({
          name: mandal?._id,
          value: mandal?.Block,
        }));
        setMandalList(getMandalList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVillageList = (mandalId) => {
    const payload = {
      mandal_name: mandalId,
      limit: 1000,
    };
    apiRequest({
      url: `madmin/master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getVillageList = res?.data?.map((village) => ({
          name: village?._id,
          value: village?.Village,
        }));
        setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onSubmit = (data) => {
    console.log("data", data);
  };

  useEffect(() => {
    handleFilterChange({
      selectState: watch("selectState"),
      district: watch("district"),
      selectMandal: watch("selectMandal"),
      selectVillage: watch("selectVillage"),
      searchText: watch("searchText"),
    });
  }, [
    watch("selectState"),
    watch("district"),
    watch("selectMandal"),
    watch("selectVillage"),
    watch("searchText"),
  ]);

  const handleFilterChange = useCallback((filter) => {
    const finalFilters = {
      ...(filter?.selectState && {
        state_name: filter?.selectState,
      }),
      ...(filter?.district && {
        district_name: filter?.district,
      }),
      ...(filter?.selectMandal && {
        mandal_name: filter?.selectMandal,
      }),
      ...(filter?.selectVillage && {
        village_name: filter?.selectVillage,
      }),
      ...(filter?.searchText && {
        searchText: filter?.searchText,
      }),
    };
    props.onFilterChange(finalFilters);
  }, []);

  const handleClearClick = () => {
    //To reset filters
    reset({});
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          gap={2}
        >
          <Grid item width={"25%"}>
            <Box>
              <Controller
                name="searchText"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    inputLabel={"Search"}
                    type={"text"}
                    placeholder={"Search"}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item width={"15%"}>
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
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item width={"15%"}>
            <Box>
              <Controller
                name="district"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={districtList}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select District"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item width={"15%"}>
            <Box>
              <Controller
                name="selectMandal"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={mandalList}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select Mandal"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item width={"15%"}>
            <Box>
              <Controller
                name="selectVillage"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectPicker
                    options={villageList}
                    {...field}
                    labelText={""}
                    type={"text"}
                    placeholder={"Select Village"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item width={"8%"}>
            <Box
              onClick={() => handleClearClick()}
              fontFamily={"poppins"}
              fontSize={"13px"}
              bgcolor={"#B1040E"}
              textAlign={"center"}
              borderRadius={"5px"}
              sx={{ cursor: "pointer" }}
              padding={"7px"}
              color={"#fff"}
            >
              Clear
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default MithunFarmerFilter;
