import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { apiRequest } from "../../services/api-request";

import { EpochFormatDate } from "../../utilities/date-utility";
import { useAppContext } from "../../context/AppContext";
import "moment-timezone";
import SelectPicker from "../../components/SelectPicker";
import CustomButton from "../../components/Button";
import Pagination from "../../components/Pagination";
const UserAnimals = (props) => {
  const { animalId, userAnimalDetails } = props;
  const [animalBreeds, setAnimalBreeds] = useState({
    data: [],
    totalCount: "",
  });
  const [animalCategories, setAnimalCategories] = useState({
    data: [],
    totalCount: "",
  });
  const { userId, userType } = props;
  const [userAnimals, setUserAnimals] = useState({
    data: [],
    totalCount: "",
    loader: false,
  });
  const { user = {} } = useAppContext();
  const currentRole = user?.role?.code || null;
  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    if (userId) {
      getUserAnimals(userId, filters);
    }
  }, [userId]);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    breed: "",
  });

  const getUserAnimals = (userId, filters) => {
    const payload = {
      [userType === "farmers" || currentRole === "mithunAdmin"
        ? "farmer_id"
        : "trader_id"]: userId,
      skip: skip,
      limit: limit,
      ...(filters.search && {
        searchText: filters.search,
      }),
      ...(filters.category && {
        category_ids: [filters.category],
      }),
      ...(filters.breed && {
        breed_ids: [filters.breed],
      }),
    };
    apiRequest({
      url: currentRole === "mithunAdmin" ? `madmin/animal/list` : `animal/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
      
        const modifiedData = res?.data?.map((animal) => ({
          id: animal?.id ?? animal?.flock_id,
          tagId: animal?.tag?.length ? animal?.tag : "NA",

          info1:
            currentRole === "admin"
              ? `${animal?.category?.display_name} | ${animal?.breed?.display_name} | ${animal?.type?.display_name}`
              : "Mithun",
          info2: `${animal?.details?.age_in_months} Months | ${
            animal?.details?.weight
          } Kg | ${animal?.details?.no_of_calvings} | ${
            currentRole === "admin"
              ? `${animal?.details?.milking_quantity} Ltr`
              : `${animal?.details?.socks} Socks`
          } `,
          location1: `${animal?.user_details?.village_name},${
            currentRole === "admin" ? animal?.user_details?.hamlet_name : ""
          } ${animal?.user_details?.mandal_name},`,
          location2: ` ${animal?.user_details?.district_name}, ${
            animal?.user_details?.state_name
          }, ${animal?.user_details?.pincode ?? ""}`,

          createdDate: EpochFormatDate(animal?.created_on),
          updatedAt: EpochFormatDate(animal?.updated_on),
          status: animal?.status,
          subscribed: animal?.subscribed,
          verifiedAt: animal?.verification_details?.verified_on,
          certificate: "",
          categoryValue: animal?.user_details?.category_ids,
          last_status: animal?.last_status,
          certified: animal?.certified === false ? "False" : "True",
        }));
      
        setUserAnimals({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const tableHeader = [
    {
      id: 1,
      title: "Animal ID",
    },
    {
      id: 2,
      title: "Tag ID",
    },
    {
      id: 3,
      title: "Animal Basic Info",
    },

    ...(currentRole === "admin"
      ? [
          {
            id: 4,
            title: "Created On",
          },
          {
            id: 5,
            title: "Updated On",
          },

          {
            id: 7,
            title: "Status",
          },
          {
            id: 8,
            title: "Certificate",
          },
        ]
      : [
          {
            id: 10,
            title: "Address",
          },
          {
            id: 11,
            title: "Status",
          },
          {
            id: 12,
            title: "Requests",
          },
          {
            id: 12,
            title: "Subscribed",
          },
        ]),
  ];

  useEffect(() => {
    if (user?.role?.code === "admin") {
      getBreeds({ skip, searchText: "" });
    }
  }, [skip]);

  useEffect(() => {
    if (user?.role?.code === "admin") {
      getCategories();
    }
  }, []);

  const getBreeds = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    apiRequest({
      url: `master/breeds`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((categories) => ({
          value: categories?.id,
          name: categories?.name,
          breedName: categories?.display_name,
          localName: categories?.local_name,
          categoryId: categories?.category_id,
          categoryName: categories?.category_name,
        }));
        setAnimalBreeds({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getCategories = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    apiRequest({
      url: `master/categories`,
      data: payload,
      method: "GET",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((categories) => ({
          value: categories?.id,
          name: categories?.name,
          breedName: categories?.display_name,
          localName: categories?.local_name,
          categoryId: categories?.category_id,
          categoryName: categories?.category_name,
        }));
        setAnimalCategories({
          data: modifiedData,
          totalCount: res?.total_count,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    if (filters.category) {
      getUserAnimals(userId, filters);
    }
  }, [filters.category]);
  useEffect(() => {
    if (filters.breed) {
      getUserAnimals(userId, filters);
    }
  }, [filters.breed]);
  useEffect(() => {
    if (filters.search) {
      getUserAnimals(userId, filters);
    }
  }, [filters.search]);

  const handleSearchTextChange = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: selectedValue,
    }));
  };
  const selectCategory = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      category: selectedValue,
    }));
  };

  const selectBreed = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      breed: selectedValue,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      breed: "",
    });
    getUserAnimals(userId, {
      search: "",
      category: "",
      breed: "",
    });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return userAnimals?.data?.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.tagId}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.info1}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.info2}
          </Typography>
        </TableCell>

        {currentRole === "mithunAdmin" ? (
          <>
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
                {row?.location2}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row?.last_status}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.requests ?? '-'}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row?.subscribed ?? '-'}
              </Typography>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.createdDate}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.updatedAt}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={13}
              >
                {row?.last_status}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={13}
              >
                {row?.certified}
              </Typography>
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  return (
    <Box m={3}>
      <Grid
        container
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Grid item md={3}>
          <CustomInput
            placeholder={"Search with Animal Id"}
            padding={"12px 12px 12px 0px"}
            value={filters.search}
            onChange={(e) => handleSearchTextChange(e)}
            leftIcon={
              <SearchOutlinedIcon style={{ color: Colors.greyColor }} />
            }
          />
        </Grid>
        {user?.role?.code === "admin" && (
          <>
            <Grid item md={3}>
              <SelectPicker
                options={animalCategories.data}
                value={filters.category}
                type={"text"}
                onChange={selectCategory}
                placeholder={"Select Category"}
              />
            </Grid>
            <Grid item md={3}>
              <Box>
                <SelectPicker
                  options={animalBreeds.data}
                  value={filters.breed}
                  labelText={""}
                  type={"text"}
                  onChange={selectBreed}
                  placeholder={"Select Breed"}
                />
              </Box>
            </Grid>
          </>
        )}
        <Grid item md={2}>
          <Box>
            <CustomButton
              handleButtonClick={clearFilters}
              backgroundColor={"#B1040E"}
              textColor={"#fff"}
              title={"Clear"}
              padding={"5px 15px"}
            />
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}>
        <CustomTable headerData={tableHeader} tableData={userAnimals}>
          <TableDataUi />
        </CustomTable>
        <Box mt={2} display={"flex"} justifyContent={"right"}>
          {userAnimals.totalCount > 1 && (
            <Pagination
              totalCount={userAnimals.totalCount}
              skip={skip}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserAnimals;
