import React, { useEffect, useState } from "react";
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
  {
    id: 6,
    title: "VE",
  },
  {
    id: 7,
    title: "Status",
  },
  {
    id: 8,
    title: "Certified",
  },
  {
    id: 9,
    title: "Market Place",
  },
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

const Animals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user = {} } = useAppContext();
  const [userAnimals, setUserAnimals] = useState([]);
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
          category_ids: [
            filters?.selectedCategory && filters?.selectedCategory?.toString(),
          ],
        }),
      ...(user?.role?.code === "admin" &&
        filters?.milkingQuantity && {
          milk_qty_from: filters?.milkingQuantity[0],
          milk_qty_to: filters?.milkingQuantity[1],
        }),
      ...(user?.role?.code === "admin" &&
        filters?.selectedBreed && {
          breed_ids: [
            filters?.selectedBreed && filters?.selectedBreed?.toString(),
          ],
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

    const url =
      user?.role?.code === "admin" ? `animal/list` : `madmin/animal/list`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animal) => ({
          id: animal?.id ? animal?.id : animal?.flock_id,
          tagId: animal?.tag_no ? animal?.tag_no : "NA",
          tagType: animal?.tag_type,
          animalInfo:
            user?.role?.code === "admin"
              ? `${animal?.category?.display_name} | ${animal?.breed?.display_name} | ${animal?.type?.display_name}`
              : "Mithun",
          animalInfo1: `${ConvertMonthsToYearsMonthsDays(
            animal?.details?.age_in_months
          )} | ${animal?.details?.weight} Kg | ${
            animal?.details?.no_of_calvings
          } C | ${
            user?.role?.code === "admin"
              ? `${animal?.details?.milking_quantity} Ltr`
              : `${animal?.details?.socks} Socks`
          } `,
          location1: `${animal?.user_details?.village_name}, ${
            user?.role?.code === "admin"
              ? Capitalize(animal?.user_details?.hamlet_name)
              : ""
          } ${animal?.user_details?.mandal_name},`,
          location2: ` ${animal?.user_details?.district_name}, ${
            animal?.user_details?.state_name
          }, ${animal?.user_details?.pincode ?? ""}`,
          partner: animal?.user_details?.name,
          role: animal?.user_id?.includes("FR")
            ? "Farmer"
            : animal?.user_id?.includes("TR")
            ? "Trader"
            : "",
          userId: animal?.user_id,
          ve: animal?.ace_details?.name,
          status: animal?.last_status,
          certificate: animal?.certified === true ? "True" : "False",
          marketPlace: "Active",
        }));
        setUserAnimals({ totalCount: res?.total_count, data: modifiedData });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const TableDataUi = () => {
    return userAnimals?.data?.map((row, index) => (
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
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            fontSize={12}
            onClick={() => {
              navigate(
                `/${
                  location?.pathname?.includes("/mithun/animals")
                    ? "mithun-animals"
                    : "animals"
                }/${row?.id}/details/basic`
              );
            }}
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
        <TableCell className={styles.cell}>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={12}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(
                `/user/${
                  row?.role?.includes("Farmer") ? "farmers" : "traders"
                }/${row?.userId}/details/basic`
              );
            }}
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
        </TableCell>
        {user.role?.code !== "admin" && (
          <TableCell className={styles.cell}>
            <Typography
              fontFamily={"Poppins-Regular"}
              // color={Colors.headerColor}
              fontSize={12}
            >
              {row?.subscribed === true ? "Un Subscribe" : "Subscribe"}
            </Typography>
          </TableCell>
        )}

        {user.role?.code === "admin" && (
          <>
            <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={13}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => {
                  navigate("/aceDetails");
                }}
              >
                {" "}
                {row.ve}
              </Typography>
            </TableCell>
            <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {" "}
                {row.status}
              </Typography>
            </TableCell>
            <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.headerColor}
                fontSize={12}
              >
                {" "}
                {row.certificate}
              </Typography>
            </TableCell>
            <TableCell className={styles.cell}>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.headerColor}
                fontSize={12}
              >
                {" "}
                {row.marketPlace}
              </Typography>
            </TableCell>

            <TableCell className={styles.cell}>
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
    ));
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
      "Id,Tag Type,Animal Basic Info,Animal Location,Partner Name,Partner Mobile,Partner Type, Ve,Status, Certified, Market Place",
    ];

    let mithunHeaders = [
      "Id,Tag Type,Mithun Basic Info,Mithun Location,Partner,Subscription",
    ];

    let animalsCSV;

    let mithunAnimalsCSV;

    if (user?.role?.code === "admin") {
      if (
        Array.isArray(userAnimalsCSV.data) &&
        userAnimalsCSV.data.length > 0
      ) {
        animalsCSV = userAnimalsCSV.data?.reduce((acc, buyRequest, index) => {
          const {
            id,
            tag_type,
            ace_details,
            details,
            breed,
            category,
            type,
            user_details,
            last_status,
            certified,
            other_details,
            flock_id,
          } = buyRequest;

          const categoryDisplayName = category?.display_name || "";
          const animalBreeds = breed?.display_name || "";
          const animalTypes = type?.display_name || "";

          let orderDetails = categoryDisplayName;

          if (animalBreeds?.length > 0) {
            orderDetails += ` | ${animalBreeds}`;
          }

          if (animalTypes?.length > 0) {
            orderDetails += ` | ${animalTypes}`;
          }

          const lifeSpan = details?.age_in_months;
          const years = Math.floor(lifeSpan / 12);

          const remainingMonths = lifeSpan % 12;
          const yearsLabel = years === 1 ? "year" : "years";
          const monthsLabel = remainingMonths === 1 ? "month" : "months";

          let weightOfAnAnimal = details?.weight;

          const weightOfAnimal = `${weightOfAnAnimal} Kg`;

          const rings = other_details?.no_of_calvings;

          const aceId = id ? id : flock_id ?? "NA";
          const animalTagNo = tag_type ? tag_type : "NA";
          const requestedName = user_details?.name;
          const reqByRole = "Farmer";
          const buyRequestDetails = `${orderDetails} ${years} ${yearsLabel} ${remainingMonths} ${monthsLabel} | ${weightOfAnimal} | ${rings} | ${buyRequest?.details?.no_of_calvings} C | ${buyRequest?.details?.milking_quantity} Ltr`;
          const animalLocation = `${user_details && user_details?.state_name ? user_details?.state_name : ""}-${
            user_details && user_details?.district_name ? user_details?.district_name : ""
          }-${user_details && user_details?.mandal_name ? user_details?.mandal_name : ""}-${
            user_details && user_details?.village_name ? user_details?.village_name : ""
          }-${user_details && user_details?.address ? user_details?.address.replace(/[\r\n]+/g, " ") : ""}`;
          const veDetails = ace_details?.name ?? "NA";
          const veMobile = ace_details?.mobile ?? "NA";
          const buyStatus = last_status ?? "NA";
          const certificate = certified ?? "NA";
          const marketPlace = "Active";
          acc.push(
            [
              aceId,
              animalTagNo,
              buyRequestDetails,
              animalLocation,
              requestedName,
              veMobile,
              reqByRole,
              veDetails,
              buyStatus,
              certificate,
              marketPlace,
            ].join(",")
          );
          return acc;
        }, []);

        downloadFile({
          data: [...headers, ...animalsCSV].join("\n"),
          fileName: "Animals.csv",
          fileType: "text/csv",
        });
      }
    } else {
      if (
        Array.isArray(userAnimalsCSV.data) &&
        userAnimalsCSV.data.length > 0
      ) {
        mithunAnimalsCSV = userAnimalsCSV.data?.reduce(
          (acc, buyRequest, index) => {
            const { id, tag_type } = buyRequest;

            const aceId = id ? id : "NA";
            const animalTagNo = tag_type ? tag_type : "NA";

            const animalType = "Mithun";
            const animalAge = `${ConvertMonthsToYearsMonthsDays(
              buyRequest?.details?.age_in_months
            )}`;

            const weight = buyRequest?.details?.weight;

            const calvings = buyRequest?.details?.no_of_calvings;

            const socks = buyRequest?.details?.socks;

            const animalDetails = `${animalType} | ${animalAge} | ${weight}Kg | ${calvings}C | ${socks}`;

            const mithunLocation = `${buyRequest?.user_details?.village_name} | ${buyRequest?.user_details?.mandal_name} | ${buyRequest?.user_details?.district_name} | ${buyRequest?.user_details?.state_name}`;

            const partnerName = buyRequest?.user_details?.name;

            const partnerMobile = buyRequest?.user_details?.mobile;

            const subscribed = buyRequest?.subscribed;

            acc.push(
              [
                aceId,
                animalTagNo,
                animalDetails,
                mithunLocation,
                partnerName,
                partnerMobile,
                subscribed,
              ].join(",")
            );
            return acc;
          },
          []
        );
        downloadFile({
          data: [...mithunHeaders, ...mithunAnimalsCSV].join("\n"),
          fileName: "MithunAnimals.csv",
          fileType: "text/csv",
        });
      }
    }
  }, [userAnimalsCSV]);

  const exportCSV = () => {
    setUserAnimalsCSV({ data: [], loader: true });
    const payload = {
      skip: skip,
      limit: 1000000000,
    };

    const url =
      user?.role?.code === "admin" ? `animal/list` : `madmin/animal/list`;

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
    // console.log(`animal/delete/${openAceRequestModal.data.id}`, "AAAAAAAAAAAAAAAAAAA.....................")
    apiRequest({
      url: `animal/delete/${openAceRequestModal.data.id}`,
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
        openModal={isModalOpen}
        handleModalClose={onClickModalClose}
        title={"Add Animal"}
      >
        {/* <Add /> */}
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
          {user?.role?.code === "mithunAdmin" && (
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
          )}
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

export default Animals;