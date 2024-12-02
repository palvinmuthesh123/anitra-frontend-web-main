import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../../components/Input";
import { apiRequest } from "../../services/api-request";
import CustomButton from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import SelectPicker from "../../components/SelectPicker";
import styles from "./animal-list.module.css";
import useCategoryDetails from "../../hooks/useCategoryDetails";

const AddAnimal = (props) => {

  const navigate = useNavigate()
  const { user } = useAppContext();

  const { currentState = {} } = props;
  const [ageMonth, setAgeMonth] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
    { "name": "11", "value": "11" },
    { "name": "12", "value": "12" },
    { "name": "13", "value": "13" },
    { "name": "14", "value": "14" },
    { "name": "15", "value": "15" },
    { "name": "16", "value": "16" },
    { "name": "17", "value": "17" },
    { "name": "18", "value": "18" },
    { "name": "19", "value": "19" },
    { "name": "20", "value": "20" },
    { "name": "21", "value": "21" },
    { "name": "22", "value": "22" },
    { "name": "23", "value": "23" },
    { "name": "24", "value": "24" }
  ])
  const [calving, setCalving] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
  ])
  const [weight, setWeight] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
    { "name": "11", "value": "11" },
    { "name": "12", "value": "12" },
    { "name": "13", "value": "13" },
    { "name": "14", "value": "14" },
    { "name": "15", "value": "15" },
    { "name": "16", "value": "16" },
    { "name": "17", "value": "17" },
    { "name": "18", "value": "18" },
    { "name": "19", "value": "19" },
    { "name": "20", "value": "20" },
    { "name": "21", "value": "21" },
    { "name": "22", "value": "22" },
    { "name": "23", "value": "23" },
    { "name": "24", "value": "24" }
  ])
  const [milk, setMilk] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
  ])
  const [teeth, setTeeth] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
  ])
  const [horn, setHorn] = useState([
    { "name": "0", "value": "0" },
    { "name": "1", "value": "1" },
    { "name": "2", "value": "2" },
    { "name": "3", "value": "3" },
    { "name": "4", "value": "4" },
    { "name": "5", "value": "5" },
    { "name": "6", "value": "6" },
    { "name": "7", "value": "7" },
    { "name": "8", "value": "8" },
    { "name": "9", "value": "9" },
    { "name": "10", "value": "10" },
  ])
  const [type, setType] = useState([])
  const [breeds, setBreeds] = useState([]);
  const [cats, setCat] = useState([])
  const [bres, setBre] = useState([])
  const [typs, setTyp] = useState([])
  const [animalTypes, setAnimalTypes] = useState([]);

  const [anitraAnimalTypes, setAnitraAnimalTypes] = useState([]);

  const [selectedValue, setSelectedValue] = useState("");

  const categories = useCategoryDetails();

  const [filters, setFilters] = useState({
    searchText: "",
    selectedCategory: "",
    selectedBreed: "",
    selectMithunType: "",
    selectSubscription: "",
    selectAnimalType: [],
    calvings: "",
    milkingQuantity: [0, 99],
  });

  const schema = yup
    .object({
      mobile: yup.string().required("Mobile Number is required"),
      password: yup.string().required("Password is required"),
    })
    .required();

  useEffect(()=> {
    getCategory();
    setFilters((prev) => ({
      ...prev,
      selectedCategory: currentState.animal_data.category.id,
      selectedBreed: currentState.animal_data.breed.id,
      selectMithunType: currentState.animal_data.type.id
    }));
  },[])

  useEffect(() => {
    if (filters.selectedCategory) {
      getBreedsByCategory(filters.selectedCategory);
      getAnitraAnimalTypes(filters.selectedCategory);
    }
  }, [filters.selectedCategory]);

  const getCategory = () => {
    apiRequest({
      url: `master/categories`,
      // data: payload,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data, "CCCCCAAAAATTTTTTEEEEEE..........")
        setCat(res?.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

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
        setBre(res?.data);
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

  const getAnitraAnimalTypes = (selectedValue) => {
    if (selectedValue && selectedValue?.length > 0) {
      const payload = {
        category_id: selectedValue,
      };
      apiRequest({
        url: `master/types`,
        method: "POST",
        data: payload,
      })
        .then((res) => {
          setTyp(res?.data)
          console.log(res.data, "TTTTYYYYYPPPPEEEESSSS...........................")
          const modifiedData = res?.data?.map((animal) => ({
            name: animal?.display_name + " - " + animal?.category_name,
            value: animal?.id,
          }));
          setAnitraAnimalTypes(modifiedData);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const mithunDefaultValues = () => {

    return {
      tagNo: currentState.animal_data.tag_no,
      tagType: currentState.animal_data.tag_type,
      rings: currentState.animal_data.other_details.no_of_rings,
      blood: currentState.blood_level,
      regCharges: currentState.registration_charges,
      recNum: currentState.receipt_number,
      ticNum: currentState.ticket_number,
      sire: currentState.parentage_details.sire_id,
      siresire: currentState.parentage_details.sire_sire_id,
      dam: currentState.parentage_details.dam_id,
      damsire: currentState.parentage_details.dam_sire_id,
      age: currentState.animal_data.details.age_in_months,
      weight: currentState.animal_data.details.weight,
      calving: currentState.animal_data.details.no_of_calvings,
      milk: currentState.animal_data.details.milking_quantity,
      teeth: currentState.animal_data.other_details.teeth_count.toString(),
      horn: currentState.animal_data.other_details.horn_distance.toString(),
      category: currentState.animal_data.category.id,
      type: currentState.animal_data.type.id,
      breed: currentState.animal_data.breed.id,
    };
  };

  const { handleSubmit, control, clearErrors, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mithunDefaultValues(),
  });

  function convertMonthsToYearsMonths(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years}yr ${months}mo`;
  }

  const onSubmit = (data) => {

    data.preventDefault();
    const formData = new FormData(data.target);

    const cat = cats.filter(role => (role.id == filters.selectedCategory));
    const typ = typs.filter(role => (role.id == filters.selectMithunType));
    const bre = bres.filter(role => (role.id == filters.selectedBreed));

    const payload = {
      id: currentState.id,
      animal_data: {
        tag_no: formData.get("tagNo"),
        tag_type: formData.get("tagType"),
        created_on: currentState.animal_data.created_on,
        created_by: currentState.animal_data.created_by,
        updated_by: currentState.animal_data.updated_by,
        user_id: currentState.animal_data.user_id,
        registered_as: "INDIVIDUAL",
        vaccines: currentState.animal_data.vaccines,
        diseases: currentState.animal_data.diseases,
        details: {
          age_in_months: formData.get("age"),
          weight: formData.get("weight"),
          milking_quantity: formData.get("milk"),
          no_of_calvings: formData.get("calving"),
          no_of_births: currentState.animal_data.details.no_of_births,
          farthered_by: currentState.animal_data.details.farthered_by,
          artificial_insemination: currentState.animal_data.details.artificial_insemination,
          de_worming: currentState.animal_data.details.de_worming,
          deworming_date: currentState.animal_data.details.deworming_date,
          de_worming_date: currentState.animal_data.details.de_worming_date,
          current_age_in_months: formData.get("age"),
          current_display_age: convertMonthsToYearsMonths(parseInt(formData.get("age"))),
          flock_age: currentState.animal_data.details.flock_age
        },
        other_details: {
          colours: currentState.animal_data.other_details.colours,
          teeth_count: formData.get("teeth"),
          horn_distance: formData.get("horn"),
          no_of_rings: formData.get("rings"),
          dob: currentState.animal_data.other_details.dob
        },
        images: currentState.animal_data.images,
        muzzle_images: currentState.animal_data.muzzle_images,
        user_details: currentState.animal_data.user_details,
        category: cat[0],
        type: typ[0],
        breed: bre[0],
        flock_details: currentState.animal_data.flock_details,
        verification_fields: currentState.animal_data.verification_fields
      },
      blood_level: formData.get("blood"),
      registration_charges: formData.get("regCharges"),
      receipt_number: formData.get("recNum"),
      ticket_number: formData.get("ticNum"),
      parentage_details: {
        sire_id: formData.get("sire"),
        sire_sire_id: formData.get("siresire"),
        dam_id: formData.get("dam"),
        dam_sire_id: formData.get("damsire")
      },
      registration_organization: currentState.registration_organization,
      created_on: currentState.created_on,
      last_updated: currentState.last_updated,
      last_verified: currentState.last_verified,
      updated_on: currentState.updated_on,
      updated_by: currentState.updated_by,
      created_by: currentState.created_by
    };

    apiRequest({
      url: `animal/update-muzzle-animal`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        reset();
        if (res?.success === true) {
          navigate(`/muzzleanimal`)
          alert("Muzzle Farmer Update Successfully");
          props.getUserAnimals();
          props.onCancel();
        } else if (res?.success === false) {
          alert(res?.message);
        }
      })
      .catch((err) => {
        alert("Something Went Wrong")
      });
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

  const handleSearchAnimalType = (e) => {
    const selectedType = e.target.value;
    setFilters((prev) => ({
      ...prev,
      selectMithunType: selectedType,
    }));
    // setSelectedValue(value);
  };

  return (
    <>
    <Box sx={{ width: "100%", padding: "20px 0px 0px 0px", height: '80vh', overflowY: 'auto' }}>
      <form onSubmit={onSubmit}>
        <Box
          backgroundColor={Colors.white}
          boxShadow={"0px 0px 48px #00183414"}
          borderRadius={"5px"}
          p={2}
          margin={1}
        >
          <Box>
            <Grid container mt={2} spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="tagNo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Tag No."}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="tagType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Tag Type"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="rings"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Number of Rings"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="blood"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Blood Level"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="regCharges"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Registration Charges"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="recNum"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Receipt Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="ticNum"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Ticket Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="recNum"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Receipt Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="sire"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Sire ID"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="siresire"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Sire's Sire ID"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="dam"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Dam ID"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="damsire"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Dam's Sire ID"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={ageMonth}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Age in Month"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={weight}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Weight"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="calving"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={calving}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Calving"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="milk"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={milk}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Milking"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="teeth"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={teeth}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Teeth Count"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="horn"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={horn}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Horn Distance"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={categories}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Category"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          value={filters.selectedCategory}
                          onChange={handleSelectAnimalCategory}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={anitraAnimalTypes}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Type"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          value={filters.selectMithunType}
                          onChange={handleSearchAnimalType}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} mt={"5px"}>
                <Box>
                  <Controller
                    name="breed"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <SelectPicker
                          options={breeds}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select Breed"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                          value={filters.selectedBreed}
                          onChange={handleSelectAnimalBreed}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          mt={4}
          gap={3}
        >
          <Grid item>
            <CustomButton
              title={`Save`}
              backgroundColor={Colors.headerColor}
              textColor={Colors.white}
              width={130}
              height={34}
              borderColor={Colors.headerColor}
              borderRadius={2}
              textFontSize={14}
              type={"submit"}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
    </>
  );
};

export default AddAnimal;
