import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Checkbox } from "@mui/material";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";

const label = { inputProps: { "aria-label": "switch" } };

const AceVillages = (props) => {
  const { userDetails = {} } = props;
  const { state_name = "", district_name = "" } = userDetails || {};

  const [villagesList, setVillagesList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [selectedMandal, setSelectedMandal] = useState(userDetails?.mandal_id);

  const [controlledVillages, setControlledVillages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userDetails?.district_id) {
        await getMandalListByDistrictId(userDetails?.district_id);
      }
    };
    fetchData();
  }, [userDetails?.district_id]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMandal) {
        await getVillagesList(
          userDetails?.district_id,
          userDetails?.controlling_villages,
          selectedMandal,
          null
        );
      }
    };

    fetchData();
  }, [selectedMandal]);

  const getMandalListByDistrictId = (districtId) => {
    const payload = {
      limit: 50,
      skip: 0,
      district_id: districtId,
    };

    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setSelectedMandal(userDetails?.mandal_id);
        const modifiedMandals = res?.data?.map((mandal) => ({
          name: mandal?.display_name,
          value: mandal?.id,
        }));
        setMandalList(modifiedMandals);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVillagesList = (
    districtId,
    controlling_villages,
    mandalId,
    searchText
  ) => {
    // Create a mapping of village ids from the controlling_villages array
    let controlledVillageIds = controlling_villages?.map(
      (village) => village.id
    );

    setControlledVillages(controlledVillageIds);

    const payload = {
      limit: 50,
      skip: 0,
      district_id: districtId,
      ...(Boolean(mandalId) && {
        mandal_id: mandalId,
      }),
      ...(Boolean(searchText?.length) && {
        searchText,
      }),
    };

    apiRequest({
      url: `master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        // Update villagesList with isSelected property
        const updatedVillagesList = res?.data?.map((village) => ({
          ...village,
          isSelected: controlledVillageIds?.includes(village.id),
        }));
        setVillagesList(updatedVillagesList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleCheckboxChange = (village) => {
    let updatedVillages = villagesList?.map((v) =>
      v.id === village.id ? { ...v, isSelected: !v.isSelected } : v
    );

    const payload = {
      controlling_villages: updatedVillages
        ?.filter((res) => res?.isSelected)
        ?.map((final) => final?.id),
      ace_id: userDetails?.user_id,
    };

    let apiResponse = {};
    apiRequest({
      url: `admin/update-ace-villages`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        // Update villagesList with isSelected property
        apiResponse = {
          success: res?.success,
        };
        if (!res?.success) {
          alert(res?.message);
          updatedVillages = villagesList?.map((v) =>
            v.id === village.id ? { ...v, isSelected: false } : v
          );
          setVillagesList(updatedVillages);
        }
      })
      .catch((err) => {
        alert(err);
      });
    if (apiResponse) {
      setVillagesList(updatedVillages);
    }
  };

  const handleSelectOnChange = (event) => {
    setSelectedMandal(event?.target?.value);
  };

  const handleInputChange = (event) => {
    getVillagesList(
      userDetails?.district_id,
      userDetails?.controlling_villages,
      selectedMandal,
      event?.target?.value
    );
  };

  return (
    <Box m={2}>
      <Grid
        container
        mt={4}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={4}
      >
        <Grid item width={250}>
          <CustomInput
            placeholder={""}
            label={"State"}
            disable={true}
            value={state_name}
            disabled={true}
          />
        </Grid>
        <Grid item width={250}>
          <CustomInput
            placeholder={""}
            label={"District"}
            disable={true}
            value={district_name}
            disabled={true}
          />
        </Grid>
        <Grid item>
          {mandalList?.length && (
            <SelectPicker
              options={mandalList}
              selectValue={selectedMandal}
              label={"Mandal"}
              type={"text"}
              placeholder={"Select Mandal"}
              onChange={handleSelectOnChange}
              isFormField={false}
            />
          )}
        </Grid>
      </Grid>
      <Grid container mt={2} justifyContent={"flex-end"} alignItems={"center"}>
        <Grid item width={250}>
          <CustomInput
            placeholder={"Search"}
            leftIcon={
              <SearchOutlinedIcon style={{ color: Colors.textColor }} />
            }
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Box mt={1}>
        <Typography
          fontFamily={"Poppins-Medium"}
          fontSize={13}
          color={Colors.textColor}
        >
          Villages
        </Typography>
      </Box>
      <Grid container mt={2} justifyContent="flex-start" alignItems="center">
        {villagesList?.map((village) => (
          <Grid item xs={3} key={village?.id}>
            <Grid container alignItems="center">
              <Grid item>
                <Checkbox
                  {...label}
                  size="small"
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                  checked={Boolean(village?.isSelected)}
                  onChange={() => handleCheckboxChange(village)}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily="Poppins-Medium"
                  color={Colors.textColor}
                  fontSize={13}
                >
                  {village?.display_name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AceVillages;
