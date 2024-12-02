import React, { useEffect, useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import { Colors } from "../../constants/Colors";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";

const ACEFilter = ({ filters, setFilters }) => {
  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [hamletList, setHamletList] = useState([]);

  useEffect(() => {
    getStates();
  }, []);

  console.log(filters);

  useEffect(() => {
    if (filters?.state) {
      getDistrictList(filters?.state);
    }
  }, [filters?.state]);

  useEffect(() => {
    if (filters?.district) {
      getMandalList(filters?.district);
    }
  }, [filters?.district]);

  useEffect(() => {
    if (filters?.mandal) {
      getVillageList(filters?.mandal);
    }
  }, [filters?.mandal]);

  useEffect(() => {
    if (filters?.village) {
      getHamletList(filters?.village);
    }
  }, [filters?.village]);

  const getStates = useCallback(() => {
    apiRequest({
      url: `master/states`,
      method: "GET",
    })
      .then((res) => {
        const getStatesList = res?.data?.map((state) => ({
          name: state?.display_name,
          value: state?.id,
        }));
        setStatesList(getStatesList);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  }, []);

  const getDistrictList = useCallback((stateId) => {
    const payload = {
      state_id: Number(stateId),
      limit: 100,
    };
    apiRequest({
      url: `master/districts`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getDistrictList = res?.data?.map((district) => ({
          name: district?.display_name,
          value: district?.id,
        }));
        setDistrictList(getDistrictList);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const getMandalList = useCallback((districtId) => {
    const payload = {
      district_id: Number(districtId),
      limit: 1000,
    };
    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getMandalList = res?.data?.map((mandal) => ({
          name: mandal?.display_name,
          value: mandal?.id,
        }));
        setMandalList(getMandalList);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const getVillageList = useCallback((mandalId) => {
    const payload = {
      mandal_id: Number(mandalId),
      limit: 1000,
    };
    apiRequest({
      url: `master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getVillageList = res?.data?.map((village) => ({
          name: village?.display_name,
          value: village?.id,
        }));
        setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const getHamletList = useCallback((villageId) => {
    const payload = {
      village_id: Number(villageId),
    };
    apiRequest({
      url: `master/hamlets`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const hamletResponse = res?.data?.map((hamlet) => ({
          name: hamlet?.display_name,
          value: hamlet?.id,
        }));
        setHamletList(hamletResponse);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const handleSearchTextChange = (e) => {
    const searchString = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: searchString,
    }));
  };

  const selectState = (e) => {
    const selectedValue = e.target.value.toString();
    setFilters((prev) => ({
      ...prev,
      state: selectedValue,
    }));
  };

  const selectDistrict = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      district: selectedValue,
    }));
  };

  const selectMandal = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      mandal: selectedValue,
    }));
  };

  const selectVillage = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      village: selectedValue,
    }));
  };
  const selectHamlet = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      hamlet: selectedValue,
    }));
  };
  const handleClearClick = () => {
    setFilters({
      search: "",
      state: "",
      district: "",
      mandal: "",
      village: "",
      hamlet: "",
    });
  };
  return (
    <Box mt={2}>
      <Grid
        container
        direction="row"
        justifyContent="start"
        alignItems="center"
        gap={2}
      >
        <Grid item md={3}>
          <CustomInput
            placeholder={`Search With Name`}
            padding={"12px 12px 12px 0px"}
            value={filters.search}
            onChange={(e) => handleSearchTextChange(e)}
            leftIcon={
              <SearchOutlinedIcon style={{ color: Colors.greyColor }} />
            }
          />
        </Grid>
        <Grid item md={3}>
          <Box>
            <SelectPicker
              options={statesList}
              onChange={selectState}
              value={filters.state}
              type={"text"}
              placeholder={"Select State"}
            />
          </Box>
        </Grid>

        <Grid item md={3}>
          <Box>
            <SelectPicker
              options={districtList}
              onChange={selectDistrict}
              value={filters.district}
              type={"text"}
              defaultOption={"Select State to get Districts"}
              placeholder={"Select District"}
            />
          </Box>
        </Grid>

        <Grid item md={3}>
          <Box>
            <SelectPicker
              options={mandalList}
              onChange={selectMandal}
              value={filters.mandal}
              defaultOption={"Select Districts to get Mandals"}
              type={"text"}
              placeholder={"Select Mandal"}
            />
          </Box>
        </Grid>

        <Grid item md={3}>
          <Box>
            <SelectPicker
              options={villageList}
              type={"text"}
              onChange={selectVillage}
              defaultOption={"Select Mandals to get Villages"}
              value={filters.village}
              placeholder={"Select Village"}
            />
          </Box>
        </Grid>

        <Grid item md={3}>
          <SelectPicker
            options={hamletList}
            onChange={selectHamlet}
            value={filters.hamlet}
            type={"text"}
            placeholder={"Select Hamlet"}
            defaultOption={"Select Villages to get Hamlets"}
          />
        </Grid>

        <Grid item md={2}>
          <CustomButton
            handleButtonClick={() => handleClearClick()}
            backgroundColor={"#B1040E"}
            textColor={"#fff"}
            title={"Clear"}
            padding={"5px 15px"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ACEFilter;
