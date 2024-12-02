import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";

import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import { apiRequest } from "../../services/api-request";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ConvertMonthsToYearsMonthsDays } from "../../utilities/date-utility";
import AnimalFilters from "../Animals/animal-filters";

const AceAnimals = (props) => {
  const tableHeader = [
    {
      id: 1,
      title: "S.No",
    },
    {
      id: 1,
      title: "Animal ID",
    },
    {
      id: 3,
      title: "Animal Basic Info",
    },
    {
      id: 7,
      title: "Location",
    },
    {
      id: 4,
      title: "Partner",
    },
    {
      id: 5,
      title: "Status",
    },
    {
      id: 7,
      title: "Certificate",
    },
  ];

  const { userId } = useParams();

  const navigate = useNavigate();

  const { user = {} } = useAppContext();

  const [filters, setFilters] = useState({
    searchText: "",
    selectedCategory: "",
    selectedBreed: "",
    selectMithunType: "",
    selectSubscription: "",
  });

  const [userAnimals, setUserAnimals] = useState({
    data: [],
    totalCount: "",
  });

  useEffect(() => {
    if (userId) {
      getUserAnimals(userId);
    }
  }, [userId, filters]);

  const getUserAnimals = (userId) => {
    const payload = {
      ace_id: userId,
      ...(filters?.searchText && {
        searchText: filters?.searchText,
      }),
      ...(filters?.selectedCategory && {
        category_ids: [
          filters?.selectedCategory && filters?.selectedCategory?.toString(),
        ],
      }),
      ...(filters?.selectedBreed && {
        breed_ids: [
          filters?.selectedBreed && filters?.selectedBreed?.toString(),
        ],
      }),
    };
    apiRequest({
      url: `animal/list`,
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
          location1: `${animal?.user_details?.village_name},${
            user?.role?.code === "admin"
              ? animal?.user_details?.hamlet_name
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
    return userAnimals.data?.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            fontSize={12}
          >
            {index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            fontSize={12}
            onClick={() => {
              navigate(`/animals/${row?.id}/details/basic`);
            }}
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
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
        <TableCell>
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
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {row.partner}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {row.role}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
          >
            {" "}
            {row.certificate}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box m={3}>
      <Grid container alignItems={"center"} gap={2}>
        <AnimalFilters setFilters={setFilters} filters={filters} />
      </Grid>
      <Box mt={2}>
        <CustomTable headerData={tableHeader} tableData={userAnimals}>
          <TableDataUi />
        </CustomTable>
      </Box>
    </Box>
  );
};

export default AceAnimals;
