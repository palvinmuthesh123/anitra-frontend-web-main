import React, { useEffect, useState } from "react";

import { Box, Typography, Grid, Divider, Link } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { apiRequest } from "../../services/api-request";
import CustomSelectPicker from "../../components/SelectPicker";

const AnimalPrices = (props) => {
  const { animal } = props
  const animals = [
    {
      id: 1,
      title: "Cow",
    },
    {
      id: 2,
      title: "Buffalo",
    },
    {
      id: 3,
      title: "Heifer",
    },
    {
      id: 4,
      title: "Meat - Cattle & Buffalo",
    },
    {
      id: 5,
      title: "Meat - Sheep & Goat",
    },
    {
      id: 6,
      title: "Small Animals",
    },
    // {
    //   id: 6,
    //   title: "Small Animals",
    // },
  ];

  const [tab, setTab] = useState(animals[0]);
  const [breed, setBreed] = useState([]);
  const [age, setAge] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [calving, setCalving] = useState([]);
  const [milkYeild, setMilkYeild] = useState([]);
  const [milk, setMilk] = useState([]);
  const [pregnancing, setPregnancing] = useState([]);
  const [pregnancingPeriod, setPregnancingPeriod] = useState([]);
  const [weights, setWeights] = useState([]);
  const [gender, setGender] = useState([]);
  const [leather, setLeather] = useState([]);


  const [breedValue, setBreedValue] = useState();
  const [ageValue, setAgeValue] = useState();
  const [transportationsValue, setTransportationsValue] = useState();
  const [calvingValue, setCalvingValue] = useState();
  const [milkYeildValue, setMilkYeildValue] = useState();
  const [milkValue, setMilkValue] = useState();
  const [pregnancingValue, setPregnancingValue] = useState();
  const [pregnancingPeriodValue, setPregnancingPeriodValue] = useState();
  const [weightValue, setWeightValue] = useState([]);
  const [genderValue, setGenderValue] = useState([]);
  const [leatherValue, setLeatherValue] = useState([]);

  const [total, setTotal] = useState(0);

  useEffect(()=> {
    if(animal && animal.category && animal.category.name) {
      let values = animals.find(obj => obj.title.toLowerCase() === animal.category.name.toLowerCase())
      setTab(values)
    }
    let fret = animal && animal.category && animal.category.name ? animal.category.name : null
    breedFactors(fret);
    ages();
    transportation();
    calvings();
    milkYeids();
    balanceMilk();
    pregnance();
    pregnancePeriod();
    Weights();
    Leather();
    Gender();
  },[])
  
  const calculatePrice = () => {
    console.log(breedValue, ageValue, transportationsValue, calvingValue, milkYeildValue, milkValue)

    if(!(tab.title=="Meat - Cattle & Buffalo" || tab.title=="Meat - Sheep & Goat") && !breedValue)
    {
      alert("Select Animal Type")
    }
    else if(!ageValue)
    {
      alert("Select Animal Age")
    }
    else if((tab.title=="Cattle" || tab.title=="Buffalo" || tab.title=="Heifer") && !milkYeildValue)
    {
      alert("Select Animal Milk Yeild")
    }
    else if((tab.title=="Cattle" || tab.title=="Buffalo") && !calvingValue)
    {
      alert("Select Animal Calving")
    }
    else if((tab.title=="Cattle" || tab.title=="Buffalo") && !milkValue)
    {
      alert("Select Animal Balance Milk")
    }
    else if(!transportationsValue)
    {
      alert("Select Animal Transportation")
    }
    else
    {
      if(tab.title=="Heifer") {
        if(!pregnancingValue)
        {
          alert("Select Pregnancy")
        }
        else if(!pregnancingPeriodValue)
        {
          alert("Select Pregnancy Period")
        }
        else {
        let val = 4500
        let margin = 0.12
        let tran_margin = 0.02
        let interest = 0.02
        let miss = 0.02

        let bre = breedValue.breed_factor * val
        let aag = ageValue.age_factor * (bre)
        let mil = milkYeildValue.milk_yeild_factor * (aag)
        let pre = pregnancingValue.pregnance_factor * (mil)
        let preper = pregnancingPeriodValue.pregnance_period_factor * (pre)
        let tran = transportationsValue.transportation_factor * (preper)


        let mar = (tran) - ( tran * margin)
        let tranmar = (mar) - ( mar * tran_margin)
        let inte = (tranmar) - ( tranmar * interest)
        let misss = (inte) - ( inte * miss)

        let tots = misss * milkYeildValue.milk_yeild

        setTotal(Math.ceil(tots))
        }
      }
      else if(tab.title=="Meat - Cattle & Buffalo" || tab.title=="Meat - Sheep & Goat") {
          if(!leatherValue)
          {
              alert("Select the Leather Factor")
          }
          else if(!weightValue)
          {
            alert("Select the Weight")
          }
          else if(!genderValue)
          {
            alert("Select Gender")
          }
          else {
          let val = tab.title=="Meat - Cattle & Buffalo" ? (150 * 50 * weightValue.weight) : (800 * 40 * weightValue.weight)
          let margin = 0.18
          let tran_margin = 0.02
          let interest = 0.02
          let miss = 0.02

          let bre = val
          let aag = ageValue.age_factor * (bre) * 0.01
          let wei = weightValue.factor * (aag)
          let gend = genderValue.factor * (wei)
          let leat = leatherValue.factor * (gend)
          let tran = transportationsValue.transportation_factor * (leat)
  
          console.log(bre, aag, wei, gend, leat, tran, "VVVVVVVVVV")

          let mar = (tran) - ( tran * margin)
          let tranmar = (mar) - ( mar * tran_margin)
          let inte = (tranmar) - ( tranmar * interest)
          let misss = (inte) - ( inte * miss)
  
          let tots = misss

          console.log(mar, tranmar, inte, misss, "XXXXXXXXXXXXX")
  
          setTotal(Math.ceil(tots))
          }
      }
      else {
        let val = tab.title == 'Buffalo' ? 10000 : 4500
        let margin = 0.12
        let tran_margin = 0.02
        let interest = 0.02
        let miss = 0.02

        let bre = breedValue.breed_factor * val
        let aag = ageValue.age_factor * (bre)
        let mil = milkYeildValue.milk_yeild_factor * (aag)
        let cal = calvingValue.calving_factor * (mil)
        let bal = milkValue.balance_milk_period_factor * (cal)
        let tran = transportationsValue.transportation_factor * (bal)

        let mar = (tran) - ( tran * margin)
        let tranmar = (mar) - ( mar * tran_margin)
        let inte = (tranmar) - ( tranmar * interest)
        let misss = (inte) - ( inte * miss)

        let tots = misss * milkYeildValue.milk_yeild

        setTotal(Math.ceil(tots))
      }
    }
  }

  const AnimalCategoriesTab = () => {
    return (
      <Grid container gap={6}>
        {animals.map((item) => {
          return (
            <Grid item key={item.id} onClick={() => {setTab(item); breedFactors(item); ages1(item); transportation1(item); Weights1(item);}}>
              <Link
                fontFamily={"Poppins-Regular"}
                fontSize={15}
                color={
                  tab.id === item.id ? Colors.headerColor : Colors.textColor
                }
                sx={styles.tabLink}
              >
                {item.title}
              </Link>
              {tab.id === item.id && <Divider sx={styles.dividerStyle} />}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const Breeding = (val) => {
    let values = breed.find(obj => obj.value === val.target.value)
    setBreedValue(values)
  }

  const Aging = (val) => {
    let values = age.find(obj => obj.value === val.target.value)
    setAgeValue(values)
  }

  const Preg = (val) => {
    let values = pregnancing.find(obj => obj.value === val.target.value)
    setPregnancingValue(values)
  }

  const PregPeriod = (val) => {
    let values = pregnancingPeriod.find(obj => obj.value === val.target.value)
    setPregnancingPeriodValue(values)
  }

  const Transporting = (val) => {
    let values = transportations.find(obj => obj.value === val.target.value)
    setTransportationsValue(values)
  }

  const Calv = (val) => {
    let values = calving.find(obj => obj.value === val.target.value)
    setCalvingValue(values)
  }

  const Milking = (val) => {
    let values = milkYeild.find(obj => obj.value === val.target.value)
    setMilkYeildValue(values)
  }

  const Balancing = (val) => {
    let values = milk.find(obj => obj.value === val.target.value)
    setMilkValue(values)
  }

  const Gendering = (val) => {
    let values = gender.find(obj => obj.value === val.target.value)
    setGenderValue(values)
  }

  const Leathering = (val) => {
    let values = leather.find(obj => obj.value === val.target.value)
    setLeatherValue(values)
  }

  const Weighting = (val) => {
    let values = weights.find(obj => obj.value === val.target.value)
    setWeightValue(values)
  }

  const PriceForm = () => {
    return (
      <>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <Grid item>
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={14}
              color={Colors.textColor}
            >
              Animal : {tab.title}
            </Typography>
          </Grid>
          {/* <Grid item>
            <Grid container gap={2}>
              <Grid item sx={{ cursor: "pointer" }}>
                <CustomButton
                  title={"+ Add Breed"}
                  handleButtonClick={() => {
                    console.log("hii");
                  }}
                  backgroundColor={Colors.headerColor}
                  textColor={Colors.white}
                  width={103}
                  height={32}
                  textFontSize={13}
                />
              </Grid>
              <Grid item sx={{ cursor: "pointer" }}>
                <CustomButton
                  title={"+ Add Factor"}
                  handleButtonClick={() => {
                    console.log("hii");
                  }}
                  backgroundColor={Colors.headerColor}
                  textColor={Colors.white}
                  width={103}
                  height={32}
                  textFontSize={13}
                />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
        <Box bgcolor={Colors.screenBg} p={3} borderRadius={4} mt={3}>
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            gap={10}
          >
            <Grid item>
              <Grid container alignItems={"center"} gap={3}>
                {!(tab.title=="Meat - Cattle & Buffalo" || 
                  tab.title=="Meat - Sheep & Goat")
                  ? <Grid item width={209}>
                      <CustomSelectPicker
                        placeholder={"Select Type"}
                        width={180}
                        value={breedValue && breedValue?.name}
                        options={breed}
                        onChange={Breeding}
                      />
                    </Grid> : null}
                    <Grid item width={209}>
                      <CustomSelectPicker
                        placeholder={"Select Age"}
                        width={180}
                        value={ageValue && ageValue?.name}
                        options={age}
                        onChange={Aging}
                      />
                    </Grid>
                  {(tab.title=="Cow" || tab.title=="Buffalo" || tab.title=="Heifer") ? <Grid item width={209}>
                    <CustomSelectPicker
                      placeholder={tab.title=="Heifer" ? "Expected Milk Yeild" : "Select Milk Yeild"}
                      width={180}
                      value={milkYeildValue && milkYeildValue.name}
                      options={milkYeild}
                      onChange={Milking}
                    />
                  </Grid> : (tab.title=="Meat - Cattle & Buffalo" || tab.title=="Meat - Sheep & Goat") ? <Grid item width={209}>
                    <CustomSelectPicker
                      placeholder={"Leather"}
                      width={180}
                      value={leatherValue && leatherValue.name}
                      options={leather}
                      onChange={Leathering}
                    />
                  </Grid> : null}
                  {(tab.title=="Meat - Cattle & Buffalo" || 
                    tab.title=="Meat - Sheep & Goat")
                    ? <Grid item width={209}>
                      </Grid> : null}
                <Grid item width={209} sx={{ cursor: "pointer" }}>
                  <CustomButton
                    title={"Clear All"}
                    handleButtonClick={() => {
                      setBreedValue();
                      setAgeValue();
                      setTransportationsValue();
                      setCalvingValue();
                      setMilkYeildValue();
                      setMilkValue();
                      setTotal(0);
                    }}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={209}
                    height={32}
                    textFontSize={14}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={"center"} gap={3} mt={3}>       
                {(tab.title=="Cow" || tab.title=="Buffalo") ? 
                <><Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Select Calving"}
                    width={180}
                    value={calvingValue && calvingValue.name}
                    options={calving}
                    onChange={Calv}
                  />
                </Grid>
                <Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Select Balance Milk"}
                    width={180}
                    value={milkValue && milkValue.name}
                    options={milk}
                    onChange={Balancing}
                  />
                </Grid></> : tab.title=="Heifer" ? <><Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Pregnant"}
                    width={180}
                    value={pregnancingValue && pregnancingValue?.name}
                    options={pregnancing}
                    onChange={Preg}
                  />
                </Grid>
                <Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Pregnancy Period"}
                    width={180}
                    value={pregnancingPeriodValue && pregnancingPeriodValue.name}
                    options={pregnancingPeriod}
                    onChange={PregPeriod}
                  />
                </Grid></> : (tab.title=="Meat - Cattle & Buffalo" || tab.title=="Meat - Sheep & Goat") ? <><Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Weight"}
                    width={180}
                    value={weightValue && weightValue?.name}
                    options={weights}
                    onChange={Weighting}
                  />
                </Grid>
                <Grid item width={209}>
                  <CustomSelectPicker
                    placeholder={"Gender"}
                    width={180}
                    value={genderValue && genderValue?.name}
                    options={gender}
                    onChange={Gendering}
                  />
                </Grid></> : null}

                <Grid item width={209}>
                  {/* <CustomInput placeholder={"Enter Meat Price"} /> */}
                  <CustomSelectPicker
                    placeholder={"Select Transportation"}
                    width={180}
                    value={transportationsValue && transportationsValue.name}
                    options={transportations}
                    onChange={Transporting}
                  />
                </Grid>
                <Grid item width={209} sx={{ cursor: "pointer" }}>
                  <CustomButton
                    title={"Calculate Price"}
                    handleButtonClick={() => {
                      // console.log("hii");
                      calculatePrice()
                    }}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={209}
                    height={32}
                    textFontSize={14}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
              >
                =
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={20}
              >
                {total ? 'Rs. ' + total : ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const breedFactors = (vals) => {
    var val = vals
    if(animal) {
      val = {
        title: vals.charAt(0).toUpperCase() + vals.slice(1)
      }
    }
    apiRequest({
      url: `animal/breedFactorDetails`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "breedFactorDetails")
      var filtering
      if(val)
      {
        filtering = val.title == 'Cow' ? 'Cattle' : val.title
      }
      else
      {
        filtering = 'Cattle'
      }
      
      var entries = []
      if(filtering=="Heifer" || filtering=="Meat - Cattle & Buffalo") {
        entries = res.data.filter((event) => {
          return (event.category_name == 'Cattle' || event.category_name == 'Buffalo')
        })
      }
      else {
        entries = res.data.filter((event) => {
          return event.category_name == filtering
        })
      }

      setBreed(entries.map(v => Object.assign(v, {value: v.name})));
      if(animal) {
        let values = entries.find(obj => obj.name === animal.breed.display_name)
        if(values) {
          setBreedValue(values)
        }
        else
        {
          setBreedValue(entries[0])
        }
      }
    })
  }

  const ages = () => {
    apiRequest({
      url: `animal/ages`,
      method: "GET",
    })
      .then((res) => {
        const filtered = res.data.filter(entry => !entry.hasOwnProperty('animals'));
        setAge(filtered.map(v => Object.assign(v, {value: v.age, name: v.age})));
      if(animal) {
        let values = filtered.find(obj => animal && animal.details && animal.details.current_age_in_months && obj.age === animal.details.current_age_in_months)
        if(values) {
          setAgeValue(values)
        }
        else
        {
          setAgeValue(filtered[filtered.length-1])
        }
      }
    })
  }

  const transportation = () => {
    apiRequest({
      url: `animal/transportation`,
      method: "GET",
    })
      .then((res) => {
        const filtered = res.data.filter(entry => !entry.hasOwnProperty('animals'));
        setTransportations(res.data.map(v => Object.assign(v, {value: v.transportation, name: v.transportation})));
    })
  }

  const ages1 = (val) => {
    apiRequest({
      url: `animal/ages`,
      method: "GET",
    })
      .then((res) => {
        if(val && val.title=="Meat - Cattle & Buffalo") {
          const filtered = res.data.filter(entry => entry.hasOwnProperty('animals') && entry.animals=="meat_big");
          setAge(filtered.map(v => Object.assign(v, {value: v.age, name: v.age})));
        }
        else if(val && val.title=="Meat - Sheep & Goat") {
          const filtered = res.data.filter(entry => entry.hasOwnProperty('animals') && entry.animals=="meat_small");
          setAge(filtered.map(v => Object.assign(v, {value: v.age, name: v.age})));
        }
      if(animal) {
        let values = res.data.find(obj => animal && animal.details && animal.details.current_age_in_months && obj.age === animal.details.current_age_in_months)
        if(values) {
          setAgeValue(values)
        }
        else
        {
          setAgeValue(res.data[res.data.length-1])
        }
      }
    })
  }

  const transportation1 = (val) => {
    apiRequest({
      url: `animal/transportation`,
      method: "GET",
    })
      .then((res) => {
        if(val && (val.title=="Meat - Cattle & Buffalo" || val.title=="Meat - Sheep & Goat")) {
          const filtered = res.data.filter(entry => entry.hasOwnProperty('animals') && entry.animals=="meat_big");
          setTransportations(filtered.map(v => Object.assign(v, {value: v.transportation, name: v.transportation})));
        }
    })
  }

  const pregnance = () => {
    apiRequest({
      url: `animal/pregnance`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "pregnances")
      setPregnancing(res.data.map(v => Object.assign(v, {value: v.pregnance, name: v.pregnance})));
    })
  }

  const pregnancePeriod = () => {
    apiRequest({
      url: `animal/pregnancePeriod`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "pregnancePeriod")
      setPregnancingPeriod(res.data.map(v => Object.assign(v, {value: v.pregnance_period, name: v.pregnance_period})));
    })
  }

  const calvings = () => {
    apiRequest({
      url: `animal/calvings`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "calvings")
      setCalving(res.data.map(v => Object.assign(v, {value: v.calving, name: v.calving})));
    })
  }

  const balanceMilk = () => {
    apiRequest({
      url: `animal/balanceMilk`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "balanceMilk")
      setMilk(res.data.map(v => Object.assign(v, {value: v.balance_milk_period, name: v.balance_milk_period})));
    })
  }

  const milkYeids = () => {
    apiRequest({
      url: `animal/milkYeids`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "milkYeids")
      setMilkYeild(res.data.map(v => Object.assign(v, {value: v.milk_yeild, name: v.milk_yeild})));
    })
  }

  const Weights = () => {
    apiRequest({
      url: `animal/weight`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "weight");
      const filtered = res.data.filter(entry => !entry.hasOwnProperty('animals'));
      setWeights(filtered.map(v => Object.assign(v, {value: v.weight, name: v.weight})));
    })
  }

  const Weights1 = (val) => {
    apiRequest({
      url: `animal/weight`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "weight")
      if(val && val.title=="Meat - Sheep & Goat") {
        const filtered = res.data.filter(entry => entry.hasOwnProperty('animals') && entry.animals=="meat_small");
        setWeights(filtered.map(v => Object.assign(v, {value: v.weight, name: v.weight})));
      }
    })
  }

  const Leather = () => {
    apiRequest({
      url: `animal/leather`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "leather")
      setLeather(res.data.map(v => Object.assign(v, {value: v.leather, name: v.leather})));
    })
  }

  const Gender = () => {
    apiRequest({
      url: `animal/gender`,
      method: "GET",
    })
      .then((res) => {
      console.log(res.data, "gender")
      setGender(res.data.map(v => Object.assign(v, {value: v.gender, name: v.gender})));
    })
  }

  return (
    <Box>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Animal Price
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters  Animal Price
          </Typography>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <AnimalCategoriesTab />
        </Card>
      </Box>

      <Box mt={2}>
        <Card>
          <PriceForm />
        </Card>
      </Box>
    </Box>
  );
};

export default AnimalPrices;

const styles = {
  dividerStyle: { backgroundColor: Colors.headerColor, padding: 0.05 },
  tabLink: { textDecorationLine: "none", cursor: "pointer" },
  iconColor: { color: Colors.headerColor },
};
