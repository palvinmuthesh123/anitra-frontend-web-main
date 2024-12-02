import React, { useState } from "react";
import { Box, Grid, RadioGroup, Typography } from "@mui/material";
import styles from "./adminNotifications.module.css";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import { useStateListHook } from "../../hooks/useStateListHook";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { useDistrictListHook } from "../../hooks/useDistrictListHook";
import { useMandalListHook } from "../../hooks/useMandalListHook";
import { useVillageListHook } from "../../hooks/useVillageListHook";
import { useHamletListHook } from "../../hooks/useHamletListHook";
import useIndividualFarmerHook from "../../hooks/useIndividualFarmerHook";
import { MITHUN_USER_ROLES, USER_ROLES } from "../../utilities/constants";
import useIndividualAceHook from "../../hooks/useIndividualAceHook";
import useIndividualTraderHook from "../../hooks/useIndividualTraderListHook";
import { useAppContext } from "../../context/AppContext";
import { useMithunTypeHook } from "../../hooks/useMithunTypeHook";

const AddEditNotification = (props) => {
  const [showDifferentNavigation, setShowDifferentNavigation] = useState("all");

  const [categories, setCategories] = useState([]);

  const { user } = useAppContext();

  const { stateList, getStatesList } = useStateListHook();
  const { districtList, getDistrictList } = useDistrictListHook();
  const { mandalList, getMandalList } = useMandalListHook();
  const { villageList, getVillageList } = useVillageListHook();
  const { hamletList, getHamletList } = useHamletListHook();
  const { farmerList, getFarmerList } = useIndividualFarmerHook();
  const { aceList, getAceList } = useIndividualAceHook();
  const { traderList, getTradersList } = useIndividualTraderHook();
  const { mithunTypeList, getMithunType, setMithunList } = useMithunTypeHook();

  const [selectUserType, setSelectUserType] = useState("");

  const schema = yup
    .object({
      title: yup.string().required("Farmer Name is required"),
      description: yup.string().required("Description  is required"),

      ...(showDifferentNavigation === "specificAnimal" && {
        animalCategory: yup
          .array()
          .of(
            yup.object().shape({
              value: yup.string(),
              title: yup.string(),
            })
          )
          .min(1, "At least one Animal Category  is required"),
      }),
      ...(showDifferentNavigation === "individualFarmer" && {
        userType: yup.string().required("User Type  is required"),
      }),
    })
    .required();

  const getDefaultValues = () => {
    return {
      title: "",
      description: "",
      animalCategory: [],
      userType: "",
      state: [],
      state: [],
      district: [],
      village: [],
      hamlet: [],
      mandal: [],
    };
  };

  const { handleSubmit, control, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "userType") {
        setSelectUserType(value?.userType);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleShowNavigationType = (data) => {
    if (data === "all") {
      setShowDifferentNavigation("all");
    } else if (data === "specificAnimal") {
      setShowDifferentNavigation("specificAnimal");
    } else if (data === "specificLocation") {
      setShowDifferentNavigation("specificLocation");
    } else {
      setShowDifferentNavigation("individualFarmer");
    }
  };

  const getCategories = (selectedValue) => {
    if (selectedValue && selectedValue?.length > 0) {
      apiRequest({
        url: `master/categories?skip=0&limit=10${
          selectedValue?.length ? `&search=${selectedValue}` : ""
        }`,
        method: "GET",
      })
        .then((res) => {
          const modifiedData = res?.data?.map((animal) => ({
            title: animal?.display_name,
            value: animal?.id,
          }));
          setCategories(modifiedData);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const handleSearchCategories = (e) => {
    const searchString = e.target.value;
    if (user?.role?.code === "admin") {
      getCategories(searchString);
    } else {
      getMithunType(searchString);
    }
  };

  const handleSearchState = (e) => {
    const searchString = e.target.value;
    getStatesList(searchString);
  };
  const handleSearchDistrict = (e) => {
    const searchString = e.target.value;
    getDistrictList(searchString);
  };

  const handleSearchMandal = (e) => {
    const searchString = e.target.value;
    getMandalList(searchString);
  };

  const handleSearchVillage = (e) => {
    const searchString = e.target.value;
    getVillageList(searchString);
  };

  const handleSearchHamlet = (e) => {
    const searchString = e.target.value;
    getHamletList(searchString);
  };

  const handleSearchFarmer = (e) => {
    const searchString = e.target.value;
    getFarmerList(searchString);
  };

  const handleSearchAce = (e) => {
    const searchString = e.target.value;
    getAceList(searchString);
  };

  const handleSearchTrader = (e) => {
    const searchString = e.target.value;
    getTradersList(searchString);
  };

  const onSubmit = (data) => {
    if (
      showDifferentNavigation === "specificLocation" &&
      !data?.state?.[0]?.value &&
      !data?.district?.[0]?.value &&
      !data?.mandal?.[0]?.value &&
      !data?.village?.[0]?.value &&
      !data?.hamlet?.[0]?.value
    ) {
      return alert("At least one location is required");
    }
    if (
      showDifferentNavigation === "individualFarmer" &&
      data?.userType &&
      !data?.farmer?.[0]?.value &&
      !data?.ace?.[0]?.value &&
      !data?.trader?.[0]?.value
    ) {
      return alert("Type of User is required");
    }
    let payload;
    if (user?.role?.code === "admin") {
      if (showDifferentNavigation === "all") {
        const allPayload = {
          broadcast: true,
          title: data?.title,
          description: data?.description,
        };
        payload = allPayload;
      } else if (showDifferentNavigation === "specificAnimal") {
        const categoryId = data?.animalCategory?.map((animal) => animal?.value);
        const allPayload = {
          broadcast: false,
          title: data?.title,
          description: data?.description,
          category_ids: categoryId,
        };
        payload = allPayload;
      } else if (showDifferentNavigation === "specificLocation") {
        if (data?.state?.length) {
          const stateListId = data?.state?.map((state) => state?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_ids: stateListId,
            location_type: "STATE",
          };
          payload = allPayload;
        } else if (data?.district?.length) {
          const districtId = data?.district?.map((district) => district?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_ids: districtId,
            location_type: "DISTRICT",
          };
          payload = allPayload;
        } else if (data?.mandal?.length) {
          const mandalId = data?.mandal?.map((mandal) => mandal?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_ids: mandalId,
            location_type: "MANDAL",
          };
          payload = allPayload;
        } else if (data?.village?.length) {
          const villageId = data?.village?.map((village) => village?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_ids: villageId,
            location_type: "VILLAGE",
          };
          payload = allPayload;
        } else if (data?.hamlet?.length) {
          const hamletId = data?.hamlet?.map((village) => village?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_ids: hamletId,
            location_type: "HAMLET",
          };
          payload = allPayload;
        }
      } else if (showDifferentNavigation === "individualFarmer") {
        if (data?.userType === "FARMER") {
          const farmerId = data?.farmer?.map((farmer) => farmer?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            user_ids: farmerId,
            user_types: [data?.userType],
          };
          payload = allPayload;
        } else if (data?.userType === "ACE") {
          const aceId = data?.ace?.map((ace) => ace?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            user_ids: aceId,
            user_types: [data?.userType],
          };
          payload = allPayload;
        } else if (data?.userType === "TRADER") {
          const traderId = data?.trader?.map((trader) => trader?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            user_ids: traderId,
            user_types: [data?.userType],
          };
          payload = allPayload;
        }
      }
    } else {
      if (showDifferentNavigation === "all") {
        const allPayload = {
          broadcast: true,
          title: data?.title,
          description: data?.description,
        };
        payload = allPayload;
      } else if (showDifferentNavigation === "specificAnimal") {
        const allAnimalId = data?.animalCategory?.map(
          (animal) => animal?.value
        );
        const allPayload = {
          broadcast: false,
          title: data?.title,
          description: data?.description,
          animal_ids: allAnimalId,
        };
        payload = allPayload;
      } else if (showDifferentNavigation === "specificLocation") {
        if (data?.state?.length) {
          const stateListId = data?.state?.map((state) => state?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_names: stateListId,
            location_type: "STATE",
          };
          payload = allPayload;
        } else if (data?.district?.length) {
          const districtId = data?.district?.map((district) => district?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_names: districtId,
            location_type: "DISTRICT",
          };
          payload = allPayload;
        } else if (data?.mandal?.length) {
          const mandalId = data?.mandal?.map((mandal) => mandal?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_names: mandalId,
            location_type: "MANDAL",
          };
          payload = allPayload;
        } else if (data?.village?.length) {
          const villageId = data?.village?.map((village) => village?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            location_names: villageId,
            location_type: "VILLAGE",
          };
          payload = allPayload;
        }
      } else if (showDifferentNavigation === "individualFarmer") {
        if (data?.userType === "FARMER") {
          const farmerId = data?.farmer?.map((farmer) => farmer?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            user_ids: farmerId,
            user_types: [data?.userType],
          };
          payload = allPayload;
        } else if (data?.userType === "ADC") {
          const aceId = data?.ace?.map((ace) => ace?.value);
          const allPayload = {
            broadcast: false,
            title: data?.title,
            description: data?.description,
            user_ids: aceId,
            user_types: [data?.userType],
          };
          payload = allPayload;
        }
      }
    }

    const URL =
      user?.role?.code === "admin"
        ? `admin/notifications/send`
        : `madmin/notifications/send`;

    apiRequest({
      url: URL,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        console.log(res, "RRRRRRRRRRRRRR")
        reset();
        if (res?.success === true) {
          props.onClose();
          props.notificationList();
          alert("Notification Sent successfully");
        } else if (res?.success === false) {
          props.onClose();
          props.notificationList();
          alert(res?.message);
        }
      })
      .catch((err) => {
        console.log(err, "EEEEEEEEEEEEEEEEEEE")
      });
  };

  const disableState = () => {
    return (
      !!watch("district")?.[0]?.value ||
      !!watch("mandal")?.[0]?.value ||
      !!watch("village")?.[0]?.value ||
      !!watch("hamlet")?.[0]?.value
    );
  };

  const disableDistrict = () => {
    return (
      !!watch("state")?.[0]?.value ||
      !!watch("mandal")?.[0]?.value ||
      !!watch("village")?.[0]?.value ||
      !!watch("hamlet")?.[0]?.value
    );
  };

  const disableMandal = () => {
    return (
      !!watch("district")?.[0]?.value ||
      !!watch("state")?.[0]?.value ||
      !!watch("village")?.[0]?.value ||
      !!watch("hamlet")?.[0]?.value
    );
  };

  const disableVillage = () => {
    return (
      !!watch("district")?.[0]?.value ||
      !!watch("state")?.[0]?.value ||
      !!watch("mandal")?.[0]?.value ||
      !!watch("hamlet")?.[0]?.value
    );
  };
  
  const disableHamlet = () => {
    return (
      !!watch("district")?.[0]?.value ||
      !!watch("state")?.[0]?.value ||
      !!watch("mandal")?.[0]?.value ||
      !!watch("village")?.[0]?.value
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="az"
          name="radio-buttons-group"
        >
          <Box display={"flex"}>
            <Box display={"flex"} alignItems={"center"}>
              <FormControlLabel
                sx={{ ml: "0px", mr: "0px" }}
                checked={showDifferentNavigation === "all"}
                value={"all"}
                onChange={() => handleShowNavigationType("all")}
                control={<Radio size="small" />}
              />
              <Typography
                className={styles.allFilters}
                sx={{ fontFamily: "MetropolisSemiBold" }}
              >
                All
              </Typography>
            </Box>
            {user?.role?.code === "admin" && (
              <Box display={"flex"} alignItems={"center"}>
                <FormControlLabel
                  sx={{ ml: "0px", mr: "0px" }}
                  value={"specificAnimal"}
                  onChange={() => handleShowNavigationType("specificAnimal")}
                  control={<Radio size="small" />}
                />
                <Typography
                  className={styles.allFilters}
                  sx={{ fontFamily: "MetropolisSemiBold" }}
                >
                  Animal Category
                </Typography>
              </Box>
            )}
            <Box display={"flex"} alignItems={"center"} flexDirection={"row"}>
              <FormControlLabel
                sx={{ ml: "0px", mr: "0px" }}
                value={"specificLocation"}
                onChange={() => handleShowNavigationType("specificLocation")}
                control={<Radio size="small" />}
              />
              <Typography
                className={styles.allFilters}
                sx={{ fontFamily: "MetropolisSemiBold" }}
              >
                Specific Location
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} flexDirection={"row"}>
              <FormControlLabel
                sx={{ ml: "0px", mr: "0px" }}
                value={"individualFarmer"}
                onChange={() => handleShowNavigationType("individualFarmer")}
                control={<Radio size="small" />}
              />
              <Typography
                className={styles.allFilters}
                sx={{ fontFamily: "MetropolisSemiBold" }}
              >
                Individual Farmer
              </Typography>
            </Box>
          </Box>
        </RadioGroup>

        <Box mt={3}>
          <Grid container spacing={2}>
            {showDifferentNavigation === "specificAnimal" && (
              <Grid item md={12}>
                <Controller
                  name="animalCategory"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <CustomAutoComplete
                      value={value}
                      padding={"9.4px"}
                      width={"100%"}
                      borderRadius={"5px"}
                      borderColor={"#000000"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      handleChange={(e, value) => {
                        onChange(value);
                      }}
                      multiple
                      onInputChange={(e, value) =>
                        handleSearchCategories(e, value)
                      }
                      options={
                        user?.role?.code === "admin"
                          ? categories
                            ? categories
                            : []
                          : user?.role?.code === "mithunAdmin"
                          ? mithunTypeList.data
                            ? mithunTypeList.data
                            : []
                          : []
                      }
                      label="Select Animal Categories"
                    />
                  )}
                />
              </Grid>
            )}
            {showDifferentNavigation === "specificLocation" && (
              <>
                <Grid item md={6}>
                  <Controller
                    name="state"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <CustomAutoComplete
                          value={value}
                          label={"Select State "}
                          error={!!error}
                          padding={"9.4px"}
                          width={"100%"}
                          borderRadius={"5px"}
                          borderColor={"#000000"}
                          noOptionsText={"Search for State"}
                          handleChange={(e, value) => {
                            onChange(value);
                          }}
                          multiple
                          onInputChange={(e, value) =>
                            handleSearchState(e, value)
                          }
                          sx={{ width: "100%" }}
                          options={stateList.data ? stateList.data : []}
                          disabled={disableState()}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name="district"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <CustomAutoComplete
                          value={value}
                          label={" Search and Select District"}
                          error={!!error}
                          padding={"9.4px"}
                          handleChange={(e, value) => {
                            onChange(value);
                          }}
                          multiple
                          onInputChange={(e, value) =>
                            handleSearchDistrict(e, value)
                          }
                          noOptionsText={"Search for District"}
                          borderColor={"#000000"}
                          width={"100%"}
                          borderRadius={"5px"}
                          sx={{ width: "100%" }}
                          options={districtList.data ? districtList.data : []}
                          disabled={disableDistrict()}
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item md={6}>
                  <Controller
                    name="mandal"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <CustomAutoComplete
                          value={value}
                          label={"Search and Select Mandal"}
                          error={!!error}
                          padding={"9.4px"}
                          noOptionsText={"Search for Mandal"}
                          handleChange={(e, value) => {
                            onChange(value);
                          }}
                          multiple
                          onInputChange={(e, value) =>
                            handleSearchMandal(e, value)
                          }
                          borderColor={"#000000"}
                          width={"100%"}
                          borderRadius={"5px"}
                          sx={{ width: "100%" }}
                          options={mandalList.data ? mandalList.data : []}
                          disabled={disableMandal()}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name="village"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <CustomAutoComplete
                          value={value}
                          error={!!error}
                          padding={"9.4px"}
                          noOptionsText={"Search for village"}
                          label={"Search and Select village"}
                          borderColor={"#000000"}
                          width={"100%"}
                          borderRadius={"5px"}
                          handleChange={(e, value) => {
                            onChange(value);
                          }}
                          multiple
                          onInputChange={(e, value) =>
                            handleSearchVillage(e, value)
                          }
                          sx={{ width: "100%" }}
                          options={villageList.data ? villageList.data : []}
                          disabled={disableVillage()}
                        />
                      );
                    }}
                  />
                </Grid>
                {user?.role?.code === "admin" && (
                  <Grid item md={6}>
                    <Controller
                      name="hamlet"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <CustomAutoComplete
                            value={value}
                            error={!!error}
                            padding={"9.4px"}
                            noOptionsText={"Search for hamlet"}
                            label={"Search and Select hamlet"}
                            borderColor={"#000000"}
                            width={"100%"}
                            borderRadius={"5px"}
                            handleChange={(e, value) => {
                              onChange(value);
                            }}
                            multiple
                            onInputChange={(e, value) =>
                              handleSearchHamlet(e, value)
                            }
                            sx={{ width: "100%" }}
                            options={hamletList.data ? hamletList.data : []}
                            disabled={disableHamlet()}
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  md={3}
                  display={"flex"}
                  alignItems={"end"}
                  justifyContent={"flex-end"}
                >
                  <CustomButton
                    title={`Clear`}
                    handleButtonClick={() =>
                      reset({
                        state: [],
                        district: [],
                        village: [],
                        hamlet: [],
                        mandal: [],
                      })
                    }
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={"100%"}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                  />
                </Grid>
              </>
            )}
            {showDifferentNavigation === "individualFarmer" && (
              <>
                <Grid item md={6}>
                  <Controller
                    name="userType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SelectPicker
                        {...field}
                        placeholder={"Select User Type"}
                        width={180}
                        options={
                          user?.role?.code === "admin"
                            ? USER_ROLES
                            : MITHUN_USER_ROLES
                        }
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>
                {selectUserType === "FARMER" && (
                  <Grid item md={6}>
                    <Controller
                      name="farmer"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <CustomAutoComplete
                            value={value}
                            error={!!error}
                            helperText={error ? error.message : ""}
                            padding={"9.4px"}
                            noOptionsText={"Search for Farmer"}
                            label={"Search and Select Farmer"}
                            borderColor={"#000000"}
                            width={"100%"}
                            borderRadius={"5px"}
                            handleChange={(e, value) => {
                              onChange(value);
                            }}
                            multiple
                            onInputChange={(e, value) =>
                              handleSearchFarmer(e, value)
                            }
                            sx={{ width: "100%" }}
                            options={farmerList.data ? farmerList.data : []}
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
                {selectUserType === "ACE" && (
                  <Grid item md={6}>
                    <Controller
                      name="ace"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <CustomAutoComplete
                            value={value}
                            error={!!error}
                            padding={"9.4px"}
                            noOptionsText={"Search for Ace"}
                            helperText={error ? error.message : ""}
                            label={"Search and Select Ace"}
                            borderColor={"#000000"}
                            width={"100%"}
                            borderRadius={"5px"}
                            handleChange={(e, value) => {
                              onChange(value);
                            }}
                            multiple
                            onInputChange={(e, value) =>
                              handleSearchAce(e, value)
                            }
                            sx={{ width: "100%" }}
                            options={aceList.data ? aceList.data : []}
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
                {selectUserType === "TRADER" && (
                  <Grid item md={6}>
                    <Controller
                      name="ace"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => {
                        return (
                          <CustomAutoComplete
                            value={value}
                            error={!!error}
                            padding={"9.4px"}
                            noOptionsText={"Search for Trader"}
                            label={"Search and Select Trader"}
                            borderColor={"#000000"}
                            width={"100%"}
                            borderRadius={"5px"}
                            handleChange={(e, value) => {
                              onChange(value);
                            }}
                            multiple
                            onInputChange={(e, value) =>
                              handleSearchTrader(e, value)
                            }
                            sx={{ width: "100%" }}
                            options={traderList.data ? traderList.data : []}
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
              </>
            )}
            <Grid item md={12}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter Notification Title"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item md={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter Notification Description"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    multiline={true}
                    minRows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container justifyContent={"end"} gap={"10px"} mt={"10px"}>
          <Grid item md={2}>
            <CustomButton
              variant={"outlined"}
              title={`Cancel`}
              handleButtonClick={() => props.onClose()}
              backgroundColor={Colors.white}
              textColor={Colors.headerColor}
              width={"100%"}
              height={34}
              borderColor={Colors.headerColor}
              textFontSize={14}
            />
          </Grid>

          <Grid item md={2}>
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

export default AddEditNotification;
