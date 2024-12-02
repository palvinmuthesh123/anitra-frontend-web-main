import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";

import Slider from "@mui/material/Slider";
import CustomInput from "../../components/Input";
import SelectPicker from "../../components/SelectPicker";
import CustomButton from "../../components/Button";
import { useAppContext } from "../../context/AppContext";
import useCategoryDetails from "../../hooks/useCategoryDetails";
import { apiRequest } from "../../services/api-request";
import { debounce } from "lodash";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { StyledAutoComplete } from "./styles";
import { calvings } from "../../utilities/constants";
const AnimalFilters = (props) => {
  const { setFilters, filters } = props;

  const [breeds, setBreeds] = useState([]);

  const { user = {} } = useAppContext();

  const [animalTypes, setAnimalTypes] = useState([]);

  const [anitraAnimalTypes, setAnitraAnimalTypes] = useState([]);

  const [selectedValue, setSelectedValue] = useState("");

  const categories = useCategoryDetails();

  useEffect(() => {
    if (filters.selectedCategory) {
      getBreedsByCategory(filters.selectedCategory);
    }
  }, [filters.selectedCategory]);

  const getBreedsByCategory = (selectedCategory) => {
    const payload = {
      category_id: selectedCategory,
    };
    apiRequest({
      url: `master/breeds`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((breed) => ({
          name: breed?.display_name,
          value: breed?.id,
        }));
        setBreeds(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleClearClick = () => {
    setFilters({
      searchText: "",
      selectedBreed: "",
      selectedCategory: "",
      selectAnimalType: [],
      calvings: "",
      milkingQuantity: [0, 99],
    });
    setSelectedValue("");
    setAnitraAnimalTypes([]);
  };

  useEffect(() => {
    if (user?.role?.code === "mithunAdmin") {
      getAnimalTypes();
    }
  }, []);

  useEffect(() => {
    if (selectedValue) {
      getAnitraAnimalTypes(selectedValue);
    }
  }, [selectedValue]);

  const getAnitraAnimalTypes = (selectedValue) => {
    if (selectedValue && selectedValue?.length > 0) {
      const payload = {
        searchText: selectedValue,
      };
      apiRequest({
        url: `master/types`,
        method: "POST",
        data: payload,
      })
        .then((res) => {
          console.log(res.data, "RRRRRRRRRRRRRRRRR")
          const modifiedData = res?.data?.map((animal) => ({
            title: animal?.display_name + " - " + animal?.category_name,
            value: animal?.id,
          }));
          setAnitraAnimalTypes(modifiedData);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const getAnimalTypes = () => {
    const payload = {
      skip: 0,
      limit: 1000,
    };

    const url = `madmin/master/types`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          name: animalType?.display_name,
          value: animalType?.id,
        }));
        setAnimalTypes(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleSearchText = (e) => {
    const searchText = e.target.value;
    setFilters((prev) => ({
      ...prev,
      searchText: searchText,
    }));
  };
  const handleSelectAnimalCategory = (e) => {
    const selectedCategory = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedCategory: selectedCategory,
    }));
  };
  const handleSelectAnimalBreed = (e) => {
    const selectedBreed = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedBreed: selectedBreed,
    }));
  };
  const handleSelectCalvings = (e) => {
    const selectedBreed = e.target.value;
    setFilters((prev) => ({
      ...prev,
      calvings: selectedBreed,
    }));
  };
  const handleSelectMithunType = (e) => {
    const string = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectMithunType: string,
    }));
  };
  const handleSelectSubscription = (e) => {
    const string = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectSubscription: string,
    }));
  };

  const handleSearchAnimalType = (e, value) => {
    setSelectedValue(value);
  };

  const debouncedHandleChange = debounce((event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      milkingQuantity: newValue,
    }));
  }, 100);

  const handleChange = (event, newValue) => {
    debouncedHandleChange(event, newValue);
  };

  return (
    <>
      <Grid container gap={2}>
        <Grid item md={3}>
          <Box>
            <CustomInput
              type={"text"}
              placeholder={"Search With Animal Id"}
              onChange={handleSearchText}
              value={filters.searchText}
            />
          </Box>
        </Grid>
        {user?.role?.code === "admin" && (
          <>
            <Grid item md={3}>
              <Box>
                <SelectPicker
                  options={categories}
                  type={"text"}
                  value={filters.selectedCategory}
                  placeholder={"Animal Category"}
                  onChange={handleSelectAnimalCategory}
                />
              </Box>
            </Grid>
            <Grid item md={3}>
              <Box>
                <SelectPicker
                  options={breeds}
                  type={"text"}
                  placeholder={"Select Breed"}
                  defaultOption={"Select Animal Category to get Breed"}
                  value={filters.selectedBreed}
                  onChange={handleSelectAnimalBreed}
                />
              </Box>
            </Grid>
            <Grid item md={3}>
              <Autocomplete
                multiple
                id="tags-outlined"
                sx={StyledAutoComplete}
                options={anitraAnimalTypes ? anitraAnimalTypes : []}
                value={filters.selectAnimalType}
                getOptionLabel={(option) => option.title}
                filterSelectedOptions
                onInputChange={(e, value) => handleSearchAnimalType(e, value)}
                onChange={(e, value) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectAnimalType: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search And Select Animal Types"
                    placeholder="Search Animal"
                  />
                )}
              />
            </Grid>
            <Grid item md={3}>
              <Box>
                <SelectPicker
                  options={calvings}
                  type={"text"}
                  placeholder={"Select Calvings"}
                  value={filters.calvings}
                  onChange={handleSelectCalvings}
                />
              </Box>
            </Grid>
            <Grid item md={3}>
              <Typography style={{fontSize: '12px', marginBottom: -10}}>Milk Capacity</Typography>
              <Slider
                value={filters.milkingQuantity}
                sx={{ color: "#B1040E" }}
                onChange={handleChange}
                valueLabelDisplay="auto"
              />
            </Grid>
          </>
        )}
        {user?.role?.code === "mithunAdmin" && (
          <>
            <Grid item width={"25%"}>
              <Box>
                <SelectPicker
                  options={animalTypes}
                  value={filters.selectMithunType}
                  type={"text"}
                  placeholder={"Mithun Type"}
                  onChange={handleSelectMithunType}
                />
              </Box>
            </Grid>
            <Grid item width={"25%"}>
              <Box>
                <SelectPicker
                  options={[
                    {
                      name: "Subscribed",
                      value: "true",
                    },
                    {
                      name: "Un Subscribed",
                      value: "false",
                    },
                  ]}
                  type={"text"}
                  value={filters.selectSubscription}
                  placeholder={"Subscription Status"}
                  onChange={handleSelectSubscription}
                />
              </Box>
            </Grid>
          </>
        )}

        <Grid item md={2}>
          {/* <Box
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
          </Box> */}
          <CustomButton
            handleButtonClick={() => handleClearClick()}
            backgroundColor={"#B1040E"}
            textColor={"#fff"}
            title={"Clear"}
            padding={"5px 15px"}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AnimalFilters;
