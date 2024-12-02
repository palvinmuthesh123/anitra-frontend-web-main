import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomModal from "../../components/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Pagination";
import { ConvertMonthsToYearsMonthsDays } from "../../utilities/date-utility";
import AnimalFilters from "./animal-filters";
import { downloadFile } from "../../utilities/exportToCsv";
import CustomCircularProgress from "../../components/CircularProgress";
import styles from "./animal-list.module.css";
import { Capitalize } from "../../utilities/constants";
import CustomDialog from "../../components/ConfirmationModal";
import AddAnimal from "./add-animal";


const dashboardHeader = [
  {
    id: 1,
    title: "S.No",
  },
  {
    id: 2,
    title: "ID",
  },

  {
    id: 3,
    title: "Animal Basic Info",
  },
  {
    id: 4,
    title: "Animal Location",
  },
  {
    id: 5,
    title: "Partner",
  },
  // {
  //   id: 6,
  //   title: "VE",
  // },
  // {
  //   id: 7,
  //   title: "Status",
  // },
  // {
  //   id: 8,
  //   title: "Certified",
  // },
  // {
  //   id: 9,
  //   title: "Market Place",
  // },
  {
    id: 10,
    title: "Action",
  },
];

const mithunAnimalHeader = [
  {
    id: 1,
    title: "S.No",
  },
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Tag Type",
  },

  {
    id: 3,
    title: "Mithun Basic Info",
  },
  {
    id: 4,
    title: "Mithun Location",
  },
  {
    id: 5,
    title: "Partner",
  },
  {
    id: 9,
    title: "Subscription",
  },
];

const Muzzle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [openUserModal, setOpenUserModal] = useState({
    open: false,
    data: [],
  });
  const [data, setData] = useState([])
  const [ind, setInd] = useState(0)
  const { user = {} } = useAppContext();
  const [userAnimals, setUserAnimals] = useState({});
  const [currentAnitraUserState, setCurrentAnitraUserState] = useState({});
  const role = "Muzzle Animals"
  const roleSingular = "Muzzle Animals"
  const [openAceRequestModal, setOpenAceRequestModal] = useState({
    data: {},
    open: false,
  });
  const [filters, setFilters] = useState({
    searchText: "",
    selectedCategory: "",
    selectedBreed: "",
    selectMithunType: "",
    selectSubscription: "",
    selectAnimalType: [],
    calvings: "",
    milkingQuantity: [0, 99],
    state_id: "",
    district_id: "",
    mandal_id: "",
    village_id: "",
    hamlet_id: "",
  });

  const location = useLocation();

  const [userAnimalsCSV, setUserAnimalsCSV] = useState({
    data: [],
    loader: false,
  });

  const limit = 10;

  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getUserAnimals(filters);
  }, [filters, skip]);

  const getUserAnimals = (filters) => {
    
    const payload = {
      skip: skip,
      limit: limit,
      ...(filters?.searchText && {
        searchText: filters?.searchText,
      }),
      ...(user?.role?.code === "admin" &&
        filters?.selectedCategory && {
          category_id: filters?.selectedCategory && filters?.selectedCategory?.toString(),
        }),
      ...(filters.state_id && {
          state_id: filters.state_id,
        }),
      ...(filters.district_id && {
          district_id: filters.district_id,
        }),
      ...(filters.mandal_id && {
          mandal_id: filters.mandal_id,
        }),
      ...(filters?.village_id && {
          village_id: filters.village_id,
        }),
      ...(user?.role?.code === "admin" &&
        filters?.selectedBreed && {
          breed_id: filters?.selectedBreed && filters?.selectedBreed?.toString(),
        }),
      ...(user?.role?.code === "admin" &&
        filters?.selectAnimalType?.length && {
          type_ids:
            filters?.selectAnimalType &&
            filters?.selectAnimalType?.map((item) => item?.value),
        }),
      ...(user?.role?.code === "admin" &&
        filters?.calvings && {
          calvings: filters?.calvings && Number(filters?.calvings),
        }),

      ...(user?.role?.code === "mithunAdmin" &&
        filters?.selectMithunType?.length && {
          type_ids: [filters.selectMithunType],
        }),

      ...(user?.role?.code === "mithunAdmin" &&
        filters?.selectSubscription != null && {
          subscribed: filters.selectSubscription === "true" ? true : false,
        }),
    };

    const url = user?.role?.code === "admin" ? `animal/muzzle-list` : `madmin/animal/list`;

    console.log(payload, "PPPPPPPPPPPPPP")

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        console.log(res, "DDDDDDDDDDD")
        if(res && res?.data && res?.data?.length > 0) {
          setData(res?.data);
          const modifiedData = res?.data?.map((animal) => ({
            id: animal?.id ? animal?.id : animal?.flock_id,
            tagId: animal?.animal_data.tag_no ? animal?.animal_data.tag_no : "NA",
            tagType: animal?.animal_data.tag_type,
            animalInfo:
              user?.role?.code === "admin"
                ? `${animal?.animal_data.category?.display_name} | ${animal?.animal_data.breed?.display_name} | ${animal?.type?.display_name}`
                : "Mithun",
            animalInfo1: `${ConvertMonthsToYearsMonthsDays(
              animal?.animal_data.details?.age_in_months
            )} | ${animal?.animal_data.details?.weight} Kg | ${
              animal?.animal_data.details?.no_of_calvings
            } C | ${
              user?.role?.code === "admin"
                ? `${animal?.animal_data.details?.milking_quantity} Ltr`
                : `${animal?.animal_data.details?.socks} Socks`
            } `,
            location1: `${animal?.animal_data.user_details?.farmer_data?.village_name || ''}, ${
              user?.role?.code === "admin"
                ? Capitalize(animal?.animal_data.user_details?.farmer_data?.hamlet_name || '')
                : ""
            } ${animal?.animal_data.user_details?.farmer_data?.mandal_name || ''},`,
            location2: ` ${animal?.animal_data.user_details?.farmer_data?.district_name || ''}, ${
              animal?.animal_data.user_details?.farmer_data?.state_name || ''
            }, ${animal?.animal_data.user_details?.farmer_data?.pincode || ""}`,
            partner: animal?.animal_data.user_details?.farmer_data?.name || '',
            role: animal?.id?.includes("MZFR")
              ? "Farmer"
              : animal?.id?.includes("TR")
              ? "Trader"
              : "",
            userId: animal?.id,
            ve: "",
            status: animal?.animal_data.last_status,
            certificate: animal?.animal_data.certified === true ? "True" : "False",
            marketPlace: "Active",
            animal_data: animal?.animal_data
          }));
          setUserAnimals({ totalCount: res?.total_count, data: modifiedData });
        }
        else {
          setUserAnimals({ totalCount: 0, data: [] });
        }
      })
      .catch((err) => {
        alert(err);
        setUserAnimals({ totalCount: 0, data: [] });
      });
  };

  const handleEdit = useCallback((data) => {
    console.log(data, "MMMMMMMMMMMMMMMMMMM")
    setCurrentAnitraUserState(data);
    setOpenUserModal({ data: data, open: true });
  }, []);

  const TableDataUi = () => {
    return userAnimals?.data?.length ? (
    userAnimals?.data?.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {skip + index + 1}
          </Typography>
        </TableCell>
        <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            // sx={{ textDecoration: "underline", cursor: "pointer" }}
            fontSize={12}
            // onClick={() => {
            //   navigate(
            //     `/${
            //       location?.pathname?.includes("/mithun/animals")
            //         ? "mithun-animals"
            //         : "animals"
            //     }/${row?.id}/details/basic`
            //   );
            // }}
          >
            {row.id}
          </Typography>
        </TableCell>

        {user.role?.code === "mithunAdmin" && (
          <TableCell className={styles.cell}>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.headerColor}
              fontSize={12}
            >
              {row?.tagType}
            </Typography>
          </TableCell>
        )}
        <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.animalInfo}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.animalInfo1}
          </Typography>
        </TableCell>
        <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.location1}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.location2}
          </Typography>
        </TableCell>
        {/* <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={12}
            // sx={{ textDecoration: "underline", cursor: "pointer" }}
            // onClick={() => {
            //   navigate(
            //     `/user/${
            //       row?.role?.includes("Farmer") ? "farmers" : "traders"
            //     }/${row?.userId}/details/basic`
            //   );
            // }}
          >
            {" "}
            {row.partner}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={"green"}
            fontSize={12}
          >
            {" "}
            {row.role}
          </Typography>
        </TableCell> */}

        {user.role?.code === "admin" && (
          <>
            <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Medium"}
                // color={Colors.headerColor}
                fontSize={13}
                // sx={{ textDecoration: "underline", cursor: "pointer" }}
                // onClick={() => {
                //   navigate("/aceDetails");
                // }}
              >
                Name: {row?.animal_data?.user_details?.farmer_data?.name ? row.animal_data.user_details.farmer_data.name : "NA"}<br/>
                Email: {row?.animal_data?.user_details?.farmer_data?.email ? row.animal_data.user_details.farmer_data.email : "NA"}<br/>
                Mobile: {row?.animal_data?.user_details?.farmer_data?.mobile ? row.animal_data.user_details.farmer_data.mobile : "NA"}<br/>
                Gender: {row?.animal_data?.user_details?.farmer_data?.gender ? row.animal_data.user_details.farmer_data.gender : "NA"}<br/>
                Owner Type: {row?.animal_data?.user_details?.owner_type ? row.animal_data.user_details.owner_type : "NA"}<br/>
                Social Status: {row?.animal_data?.user_details?.social_status ? row?.animal_data.user_details.social_status : "NA"}<br/>
                Landholding: {row?.animal_data?.user_details?.landholding ? row?.animal_data.user_details.landholding : "NA"}
              </Typography>
            </TableCell>
            {/* <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {" "}
                {row.status}
              </Typography>
            </TableCell> */}
            {/* <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.headerColor}
                fontSize={12}
              >
                {" "}
                {row.certificate}
              </Typography>
            </TableCell> */}
            {/* <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.headerColor}
                fontSize={12}
              >
                {" "}
                {row.marketPlace}
              </Typography>
            </TableCell> */}

            <TableCell className={styles.cell}>
              <Box
                padding={"2px 8px"}
                textAlign={"center"}
                borderRadius={"12px"}
                border={"1px solid #B1040E"}
                bgcolor={"#B1040E"}
                onClick={() => {
                  console.log("EDIT..........")
                  setInd(index);
                  handleEdit(row);
                  // setOpenUserModal({ data: row, open: true });
                }}
              >
                <Typography
                  fontFamily={"Poppins-Regular"}
                  fontSize={"12px"}
                  color={"#fff"}
                  bgcolor={"#B1040E"}
                >
                  {"Edit"}
                </Typography>
              </Box>
              <Box
                padding={"2px 8px"}
                textAlign={"center"}
                borderRadius={"12px"}
                border={"1px solid #B1040E"}
                bgcolor={"#B1040E"}
                style={{marginTop: '10px'}}
                onClick={() => {
                  setOpenAceRequestModal({ data: row, open: true });
                }}
              >
                <Typography
                  fontFamily={"Poppins-Regular"}
                  fontSize={"12px"}
                  color={"#fff"}
                  bgcolor={"#B1040E"}
                >
                  {"Delete"}
                </Typography>
              </Box>
            </TableCell>
          </>
        )}
      </TableRow>
    ))
    )
    : (
      <>
        <TableRow
          key={"row.id"}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          rowS
        >
          <TableCell colSpan={8} align="center">
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography>No Data Available</Typography>
            </Box>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const onClickModalClose = () => {
    setIsModalOpen(false);
  };
  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  useEffect(() => {
    let headers = [
      "Id,Tag Type,Tag No,Animal Category,Animal Breed,Animal Type,Animal Age,Weight,Milking Quantity,No of Calvings,Other Details,Location,Images,Muzzle Images,Partner Name,Partner Mobile,Registration Organization,Registration Charges,Receipt Number,Ticket Number,Blood Level",
    ];
  
    let animalsCSV;
  
    if (user?.role?.code === "admin" && Array.isArray(userAnimalsCSV.data) && userAnimalsCSV.data.length > 0) {
      animalsCSV = userAnimalsCSV.data.reduce((acc, buyRequest) => {
        const {
          id = "NA",
          animal_data: {
            tag_no = "NA",
            tag_type = "NA",
            category = {},
            breed = {},
            type = {},
            details = {},
            other_details = {},
            images = {},
            muzzle_images = {},
            user_details = {},
          },
          registration_charges = "NA",
          receipt_number = "NA",
          ticket_number = "NA",
          blood_level = "NA",
          registration_organization = "NA",
        } = buyRequest;
  
        // Animal Details
        const animalCategory = category?.display_name || "NA";
        const animalBreed = breed?.display_name || "NA";
        const animalType = type?.display_name || "NA";
  
        // Animal Stats
        const ageInMonths = details?.age_in_months || "NA";
        const weight = details?.weight || "NA";
        const milkingQuantity = details?.milking_quantity || "NA";
        const noOfCalvings = details?.no_of_calvings || "NA";
  
        // Other Details
        const otherDetails = `Teeth: ${other_details?.teeth_count || "NA"} | Rings: ${other_details?.no_of_rings || "NA"}`;
  
        // User Details
        const userName = user_details?.farmer_data?.name || "NA";
        const userMobile = user_details?.farmer_data?.mobile || "NA";
        // const userLocation = [
        //   user_details?.farmer_data?.village_name || "NA",
        //   user_details?.farmer_data?.mandal_name || "NA",
        //   user_details?.farmer_data?.district_name || "NA",
        //   user_details?.farmer_data?.state_name || "NA",
        // ]
        //   .filter((part) => part !== "NA")
        //   .join(", ");
        const userLocation = `"${[
          user_details?.farmer_data?.village_name || "NA",
          user_details?.farmer_data?.mandal_name || "NA",
          user_details?.farmer_data?.district_name || "NA",
          user_details?.farmer_data?.state_name || "NA",
        ]
          .filter((part) => part !== "NA")
          .join(", ")}"`;
  
        // Images
        const animalImages = Object.values(images || {})
          .filter(Boolean)
          .join(" | ") || "NA";
        const muzzleImages = Object.values(muzzle_images || {})
          .filter(Boolean)
          .join(" | ") || "NA";
  
        // Append data row
        acc.push(
          [
            id,
            tag_type,
            tag_no,
            animalCategory,
            animalBreed,
            animalType,
            `Age: ${ageInMonths} months`,
            `Weight: ${weight} kg`,
            `${milkingQuantity} L milk`,
            `${noOfCalvings} calvings`,
            otherDetails,
            userLocation,
            animalImages,
            muzzleImages,
            userName,
            userMobile,
            registration_organization,
            registration_charges,
            receipt_number,
            ticket_number,
            blood_level,
          ].join(",")
        );
  
        return acc;
      }, []);
  
      // Download CSV
      downloadFile({
        data: [...headers, ...animalsCSV].join("\n"),
        fileName: "MuzzleAnimalsDetailed.csv",
        fileType: "text/csv",
      });
    }
  }, [userAnimalsCSV]);  

  const exportCSV = () => {
    setUserAnimalsCSV({ data: [], loader: true });
    const payload = {
      skip: skip,
      limit: 1000000000,
    };

    const url = "animal/muzzle-list";
      // user?.role?.code === "admin" ? `animal/list` : `madmin/animal/list`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setUserAnimalsCSV({ data: res?.data, loader: false });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const acceptAnimal = () => {
    // console.log(`animal/delete-muzzle/${openAceRequestModal.data.id}`, "AAAAAAAAAAAAAAAAAAA.....................")
    apiRequest({
      url: `animal/delete-muzzle/${openAceRequestModal.data.id}`,
      method: "DELETE",
    })
      .then((res) => {
        setOpenAceRequestModal({ open: false })
        alert("Success");
        getUserAnimals(filters);
        setOpenAceRequestModal({
          data: {},
          open: false,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      <CustomModal
        openModal={openUserModal.open}
        width={"500px"}
        // style={styles.custModel}
        handleModalClose={()=>setOpenUserModal({ open: false })}
        title={"Edit Animals"}
      >
        <AddAnimal
          onCancel={() => setOpenUserModal({ open: false })}
          roleSingular={roleSingular}
          currentState={data[ind]}
          isEdit={true}
          getUserAnimals={() =>
            getUserAnimals(filters)
          }
        />
      </CustomModal>
      <CustomDialog
        open={
          openAceRequestModal.open
        }
        onClose={() => 
          setOpenAceRequestModal({ open: false })
        }
        width={"450px"}
        title={"Delete Animal"}
      >
        <Box>
          <Typography fontSize={"14px"} fontFamily={"poppins"}>
            Are you sure you want to Delete this animal data ?
          </Typography>

          <Box
            display={"flex"}
            alignItems={"end"}
            justifyContent={"flex-end"}
            width={"100%"}
            mt={2}
            gap={"12px"}
          >
            <Box width={"25%"}>
              <CustomButton
                variant={"outlined"}
                title={`No`}
                handleButtonClick={() =>
                  setOpenAceRequestModal({ open: false })
                }
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
              />
            </Box>
            <Box width={"25%"}>
              <CustomButton
                title={`Yes`}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={acceptAnimal}
              />
            </Box>
          </Box>
        </Box>
      </CustomDialog>


      <Grid
        container
        alignItems={"center"}
        justifyContent={"space-between"}
        mr={0}
      >
        <Grid item xs={4}>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {user.role.code === "admin" ? `Animals List` : "Mithun's List"}
          </Typography>
        </Grid>
        <Grid container spacing={2} xs={8} justifyContent={"end"} gap={"20px"}>
          {userAnimalsCSV.loader ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"100px"}
            >
              <CustomCircularProgress size={"1rem"} />
            </Box>
          ) : (
            <Grid>
              {/* <CustomButton
                title={"Edit Animals"}
                padding={"4px 20px"}
                handleButtonClick={()=>{setIsModalOpen(true)}}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                textFontSize={14}
              /> */}
              <CustomButton
                title={"Export List"}
                padding={"4px 20px"}
                handleButtonClick={exportCSV}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                textFontSize={14}
              />
            </Grid>
          )}
          {/* {user?.role?.code === "mithunAdmin" && (
            <Grid>
              <CustomButton
                title={"Add Mithun"}
                padding={"4px 20px"}
                handleButtonClick={() => navigate(`/mithun/animals/add`)}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                textFontSize={14}
              />
            </Grid>
          )} */}
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <AnimalFilters setFilters={setFilters} filters={filters} />
          <Box mt={2}>
            <CustomTable
              headerData={
                user.role?.code === "admin"
                  ? dashboardHeader
                  : mithunAnimalHeader
              }
              tableData={userAnimals}
              className={styles.cell}
            >
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {userAnimals.totalCount > 10 && (
                <Pagination
                  totalCount={userAnimals.totalCount}
                  skip={skip}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Muzzle;