import React, { useEffect, useState } from "react";
import { HocLayout } from "../../components/Hoc";
import { Box, Typography, Grid } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import { AvatarView } from "../../pages/UserView";
import { CustomTab } from "../../components/CustomTabs";
import { useParams } from "react-router-dom";
import { apiRequest } from "../../services/api-request";
import BasicInfoForm from "./basic-info-form";
import AnimalActivity from "./animal-activity";
import AdditionalInfoForm from "./Forms/additional-info-form";
import BreedDetailsForm from "./Forms/breed-details-form";
import FamilyBreedAndGeneticsForm from "./Forms/family-breed-and-genetics-form";
import VaccinationForm from "./Forms/vaccination-form";
import DiseaseForm from "./Forms/disease-form";
import InsuranceForm from "./Forms/insurance-form";
import AnimalPhotos from "./AnimalPhotos";
import MuzzlePhotos from "./MuzzlePhotos";
import { useAppContext } from "../../context/AppContext";
import MithunBasicInfo from "./mithunDetails/mithun-basic-info";
import TransactionHistory from "./transaction-history";
import CircularProgress from "@mui/material/CircularProgress";
import CustomCircularProgress from "../../components/CircularProgress";
import AnimalPrices from "../AnimalPrices";

const tabs = [
  {
    id: "basic",
    title: "Animal Details",
  },
  {
    id: "updates",
    title: `Animal Other Details`,
  },
  {
    id: "transactions",
    title: `Transaction History`,
  },
  {
    id: "pricing",
    title: `Pricing`,
  },
];

const mithunTabs = [
  {
    id: "basic",
    title: "Mithun Details",
  },
  {
    id: "updates",
    title: `Recent Updates`,
  },
  {
    id: "transactions",
    title: `Transactions`,
  }
];

const AnimalDetails = (props) => {

  const [breed, setBreed] = useState([]);
  const [age, setAge] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [calving, setCalving] = useState([]);
  const [milkYeild, setMilkYeild] = useState([]);
  const [milk, setMilk] = useState([]);
  const [traVal, setTraVal] = useState()
  const [milVal, setMilVal] = useState()
  const [ageVal, setageVal] = useState(null)
  const [breedVal, setbreedVal] = useState(null)
  const [breedValue, setBreedValue] = useState();
  const [ageValue, setAgeValue] = useState();
  const [transportationsValue, setTransportationsValue] = useState();
  const [calvingValue, setCalvingValue] = useState();
  const [milkYeildValue, setMilkYeildValue] = useState();
  const [milkValue, setMilkValue] = useState();
  const { animalId, currentTab } = useParams();
  const [userAnimalDetails, setUserAnimalDetails] = useState({});
  const [loaderForUserAnimalDetails, setLoaderForUserAnimalDetails] = useState(false);
  const [tab, setTab] = useState(tabs[0]);

  const { user } = useAppContext();

  const subTabs = [
    {
      id: 1,
      title: "Additional Info",
    },
    {
      id: 2,
      title: `Breed Details`,
    },
    {
      id: 3,
      title: "Family Breed & Genetics",
    },
    {
      id: 4,
      title: `Vaccination`,
    },
    {
      id: 5,
      title: "Disease",
    },
    {
      id: 6,
      title: `Insurance`,
    },
    {
      id: 7,
      title: "Photos",
    },
    {
      id: 8,
      title: `Muzzle`,
    },
  ];

  const [subTab, setSubTab] = useState(subTabs[0]);

  useEffect(() => {
    if ((currentTab, animalId)) {
      const filteredTab = tabs?.find((tab) => tab?.id === currentTab);
      setTab(filteredTab);
      if (currentTab) {
        getAnimalDetails(animalId);
      }
    }
  }, [currentTab, animalId]);

  useEffect(() => {
    if (traVal && milVal) {
      transportation(traVal);
      balanceMilk(milVal);
    }
  }, [traVal, milVal])

  // useEffect(() => {
  //   if (ageVal) {
  //     var data = {
  //       data: {
  //         current_age_in_months: ageVal
  //       }
  //     }
  //     ages(data);
  //     setageVal(null);
  //   }
  // }, [ageVal])

  // useEffect(() => {
  //   if (breedVal) {
  //     ages(breedVal);
  //     setbreedVal(null)
  //   }
  // }, [breedVal])


  useEffect(() => {
    if(transportationsValue && milkValue) {

      let val = userAnimalDetails.breed.category_name == 'Buffalo' ? 10000 : 4500
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

      let mar = (tran) - (tran * margin)
      let tranmar = (mar) - (mar * tran_margin)
      let inte = (tranmar) - (tranmar * interest)
      let misss = (inte) - (inte * miss)

      let tots = misss * milkYeildValue.milk_yeild

      console.log(tots, "GRAND TOTAL...........................");

    }
  }, [transportationsValue, milkValue])

  const breedFactors = (val) => {
    apiRequest({
      url: `animal/breedFactorDetails`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data, "breedFactorDetails")
        for (var i = 0; i < res.data.length; i++) {
          if (val.breed.category_name == res.data[i].category_name && val.breed.display_name == res.data[i].name) {
            setBreedValue(res.data[i]);
          }
        }
        setBreed(res.data.map(v => Object.assign(v, { value: v.name })));
      })
  }

  const ages = (val) => {
    apiRequest({
      url: `animal/ages`,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data, val.details.current_age_in_months, val, "ages")
        for (var i = 0; i < res.data.length; i++) {
          if (val.details.current_age_in_months == res.data[i].age * 12) {
            setAgeValue(res.data[i]);
          }
        }
        if(val.details.current_age_in_months>12) {
          setAgeValue(res.data[res.data.length-1]);
        }
        setAge(res.data.map(v => Object.assign(v, { value: v.age, name: v.age })));
      })
  }

  const transportation = (val) => {
    apiRequest({
      url: `animal/transportation`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data, "transportation")
        if (val) {
          for (var i = 0; i < res.data.length; i++) {
            if (val == res.data[i].transportation) {
              setTransportationsValue(res.data[i]);
            }
          }
        }
        setTransportations(res.data.map(v => Object.assign(v, { value: v.transportation, name: v.transportation })));
      })
  }

  const calvings = (val) => {
    apiRequest({
      url: `animal/calvings`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data, "calvings")
        for (var i = 0; i < res.data.length; i++) {
          if (val.details.no_of_calvings == res.data[i].calving) {
            setCalvingValue(res.data[i]);
          }
        }
        setCalving(res.data.map(v => Object.assign(v, { value: v.calving, name: v.calving })));
      })
  }

  const balanceMilk = (val) => {
    apiRequest({
      url: `animal/balanceMilk`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data, "balanceMilk")
        if (val) {
          for (var i = 0; i < res.data.length; i++) {
            if (val == res.data[i].balance_milk_period) {
              setMilkValue(res.data[i]);
            }
          }
        }
        setMilk(res.data.map(v => Object.assign(v, { value: v.balance_milk_period, name: v.balance_milk_period })));
      })
  }

  const milkYeids = (val) => {
    apiRequest({
      url: `animal/milkYeids`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data, val.details.milking_quantity, "milkYeids")
        var ter = val.details.milking_quantity == 0 ? 1 : val.details.milking_quantity
        for (var i = 0; i < res.data.length; i++) {
          if (ter == res.data[i].milk_yeild) {
            setMilkYeildValue(res.data[i]);
            console.log(res.data[i], "GGGEEEEETTTTT DDAAAAATTTAAAAAA...........")
          }
        }
        setMilkYeild(res.data.map(v => Object.assign(v, { value: v.milk_yeild, name: v.milk_yeild })));
      })
  }

  const getAnimalDetails = (animalId) => {
    setLoaderForUserAnimalDetails(true);
    const URL =
      user?.role?.code === "admin"
        ? `animal/details/${animalId}`
        : `madmin/animal/details/${animalId}`;
    apiRequest({
      url: URL,
      method: "GET",
    })
      .then((res) => {
        setUserAnimalDetails(res?.data);
        breedFactors(res?.data);
        ages(res?.data);
        transportation();
        calvings(res?.data);
        balanceMilk();
        milkYeids(res?.data);
        console.log(res?.data, "LLLLLLLLLLLLLLLLLLL");
        setLoaderForUserAnimalDetails(false);
      })
      .catch((err) => {
        alert(err);
        setLoaderForUserAnimalDetails(false);
      });
  };

  const OtherDetails = () => {
    return (
      <Box mt={4}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"20px"}
          justifyContent={"flex-start"}
        >
          <CustomTab data={subTabs} tab={subTab} setTab={setSubTab} />
          {loaderForUserAnimalDetails ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={"small"} />
            </Box>
          ) : (
            <>
              {subTab.id === 1 && (
                <AdditionalInfoForm
                  currentState={{
                    bodyWeight: userAnimalDetails?.details?.weight,
                    teethCount: userAnimalDetails?.other_details?.teeth_count,
                    hornDistance:
                      userAnimalDetails?.other_details?.horn_distance,
                    noOfRings: userAnimalDetails?.other_details?.no_of_rings,
                  }}
                  isEdit={true}
                />
              )}
            </>
          )}
          {subTab.id === 2 && (
            <BreedDetailsForm
              currentState={{
                noOfBirths: userAnimalDetails?.details?.no_of_births,
                calvingOptions: userAnimalDetails?.details?.no_of_calvings,
                milking: userAnimalDetails?.type?.milking,
                milkingQuantity: userAnimalDetails?.details?.milking_quantity,
              }}
              isEdit={true}
            />
          )}
          {subTab.id === 3 && (
            <FamilyBreedAndGeneticsForm
              currentState={{
                thoutArtificialInseminated:
                  userAnimalDetails?.details?.artificial_insemination,
                fatheredBy: userAnimalDetails?.details?.farthered_by,
              }}
            />
          )}
          {subTab.id === 4 && (
            <VaccinationForm
              currentState={{
                vaccines: userAnimalDetails?.vaccines,
              }}
            />
          )}
          {subTab.id === 5 && (
            <DiseaseForm
              currentState={{
                diseases: userAnimalDetails?.diseases,
              }}
            />
          )}
          {subTab.id === 6 && (
            <InsuranceForm
              currentState={{
                animalInsurance:
                  userAnimalDetails?.is_insured === false ? "No" : "Yes",
                insuranceNo: userAnimalDetails?.number,
                insuranceValue: userAnimalDetails?.value,
                startDate: userAnimalDetails?.start_date,
                endDate: userAnimalDetails?.end_date,
                company: userAnimalDetails?.company_name,
                agentName: userAnimalDetails?.agent_name,
              }}
            />
          )}
          {subTab.id === 7 && (
            <AnimalPhotos
              currentState={{
                images: userAnimalDetails?.images,
              }}
            />
          )}
          {subTab.id === 8 && <MuzzlePhotos />}
        </Box>
      </Box>
    );
  };

  const handleValueChange = (newValue) => {
    // console.log(newValue);
    setTraVal(newValue);
  };

  const handleValueChange1 = (newValue) => {
    // console.log(newValue);
    setMilVal(newValue);
  };

  const ageChange = (newValue) => {
    // if(ageVal!=newValue) {
    //   var data = {
    //     data: {
    //       current_age_in_months: ageVal
    //     }
    //   }
    //   ages(data);
    //   // setageVal(newValue)
    // }
  }

  const breedChange = (newValue) => {
    console.log(newValue, "BREED")
    setbreedVal(newValue);
  }

  return (
    <Box bgcolor={"#F8F8F8"}>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {user?.role?.code === "admin" ? " Animal View" : "Mithun View"}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {user?.role?.code === "admin"
              ? `Animals > Details`
              : `Mithun > Details`}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid container gap={"60px"} alignItems={"center"}>
            <Grid item>
              <AvatarView
                name={
                  user?.role?.code === "admin"
                    ? userAnimalDetails?.type?.name
                    : "Mithun"
                }
                designation={
                  user?.role?.code === "admin"
                    ? "Type"
                    : userAnimalDetails?.type_name
                }
                nameColor={Colors.textColor}
              />
            </Grid>

            <Grid item>
              <AvatarView
                name={userAnimalDetails?.user_details?.name}
                designation={"Farmer"}
                nameColor={Colors.headerColor}
              />
            </Grid>
            <Grid item>
              <AvatarView
                name={userAnimalDetails?.ace_details?.name}
                designation={"ACE"}
                nameColor={Colors.headerColor}
              />
            </Grid>

            {/* <Grid item>
              <AvatarView
                name={""}
                designation={"Pricing"}
                nameColor={Colors.headerColor}
              />
            </Grid> */}

          </Grid>
        </Card>
      </Box>

      <Box mt={2}>
        <Card>
          <CustomTab
            data={user?.role?.code === "admin" ? tabs : mithunTabs}
            tab={tab}
            userType={"animals"}
            userId={animalId}
          />

          {user?.role?.code === "admin" && (
            <>
              {tab.id === "basic" && (
                <>
                  <Box m={3}>
                    <Typography
                      fontFamily={"Poppins-Medium"}
                      fontSize={13}
                      color={Colors.textColor}
                    >
                      Basic Details
                    </Typography>
                    <Box m={2}>
                      {loaderForUserAnimalDetails ? (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        </>
                      ) : (
                        <BasicInfoForm
                          animalId={animalId}
                          userAnimalDetails={userAnimalDetails}
                          transport={transportations}
                          milk={milk}
                          ageChange={ageChange}
                          breedChange={breedChange}
                          onValueChange={handleValueChange}
                          onValueChange1={handleValueChange1}
                        />
                      )}
                    </Box>

                    {OtherDetails()}
                  </Box>
                </>
              )}
            </>
          )}

          {user?.role?.code === "mithunAdmin" && (
            <>
              {loaderForUserAnimalDetails ? (
                <>{"loading"}</>
              ) : (
                <>
                  {tab.id === "basic" && (
                    <MithunBasicInfo userDetails={userAnimalDetails} />
                  )}
                </>
              )}
            </>
          )}

          {loaderForUserAnimalDetails ? (
            <CustomCircularProgress />
          ) : (
            <>
              {tab.id === "updates" && (
                <AnimalActivity
                  animalId={animalId}
                  userAnimalDetails={userAnimalDetails}
                />
              )}
            </>
          )}

          {tab.id === "transactions" && (
            <TransactionHistory animalId={animalId} />
          )}

          {tab.id === "pricing" && (
              <AnimalPrices animal={userAnimalDetails}/>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default AnimalDetails;
