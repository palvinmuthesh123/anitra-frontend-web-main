import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import SelectPicker from "../../components/SelectPicker";

import { apiRequest } from "../../services/api-request";
import Pagination from "../../components/Pagination";
import CustomCircularProgress from "../../components/CircularProgress";

const AceFarmersAndTraders = (props) => {
  const { userId, currentTab, userDetails } = props;

  const [userList, setUserList] = useState({
    data: [],
    totalCount: "",
    loader: true,
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [filters, setFilters] = useState({
    village_id: "",
  });

  const selectVillage = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      village_id: selectedValue,
    }));
  };

  useEffect(() => {
    if (userId && currentTab) {
      getUserDetails(userId);
    }
  }, [skip, userId, currentTab]);

  useEffect(() => {
    if (filters.village_id) {
      getUserDetails(filters);
    }
  }, [skip, filters]);

  const getUserDetails = (filters) => {
    let requestUrl = "";
    if (currentTab === "farmers") {
      requestUrl = `farmer/list`;
    } else if (currentTab === "traders") {
      requestUrl = `trader/list`;
    } else {
      return;
    }
    apiRequest({
      url: requestUrl,
      data: {
        skip: skip,
        limit: limit,
        sort_field: "_id",
        sort_order: "desc",
        search_fields: ["name", "mobile", "user_id"],
        ace_id: userId,
        ...(filters.village_id && {
          village_id: filters.village_id,
        }),
      },
      method: "POST",
    })
      .then((res) => {
        const modifiedUserList = res?.data?.map((user) => {
          let userAddress;

          if (user) {
            userAddress = `${user?.state_name}, ${user?.district_name}, ${user?.mandal_name}, ${user?.village_name},${user?.address} `;
          }

          const data = {
            id: user?.user_id ? user?.user_id : "FR1686389701188",
            name: user?.name,
            mobile: user?.mobile,
            address: userAddress ?? "NA",
            pincode: user?.pincode,
            aceName: "ACE Name",
            stateId: user?.state_id,
            districtId: user?.district_id,
            mandalId: user?.mandal_id,
            villageId: user?.village_id,
            hamletId: user?.hamlet_id,
            animals: user?.animal_count?.individual ?? 0,
            totalRequests:
              `${
                user?.request_count?.buy +
                user?.request_count?.sell +
                user?.request_count?.health +
                user?.request_count?.nutrition
              }` ?? 0,
            totalOrders: user?.totalOrders ?? 0,
          };
          return data;
        });

        setUserList({
          data: modifiedUserList,
          totalCount: res?.total_count,
          loader: false,
        });
      })
      .catch((err) => {
        console.log(err);
        // open(err?.response?.data?.message, "error");
      });
  };

  const tableHeader = [
    {
      id: 1,
      title: "S.No",
    },
    {
      id: 1,
      title: "Farmer Id",
    },
    {
      id: 2,
      title: "Name",
    },
    {
      id: 3,
      title: "Mobile no",
    },
    {
      id: 4,
      title: "Farmer Location",
    },
    {
      id: 5,
      title: "Animals",
    },
    {
      id: 6,
      title: "Total Requests",
    },
  ];

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return userList?.data?.map((row, index) => (
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
            {skip + index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row?.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.mobile}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.address}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.animals}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
          >
            {row.totalRequests}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  const farmerControllingVillages = userDetails?.controlling_villages?.map(
    (village) => ({
      name: village?.name,
      value: village?.id,
    })
  );

  const handleClearVillage = () => {
    setFilters({ village_id: "" });
    getUserDetails({ filters: {} });
  };

  return (
    <Box m={3}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item md={3}>
          <SelectPicker
            options={farmerControllingVillages}
            labelText={""}
            value={filters.village_id}
            onChange={selectVillage}
            type={"text"}
            placeholder={"Select Village"}
          />
        </Grid>
        <Grid item md={1}>
          <Box
            onClick={() => handleClearVillage()}
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
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}>
        <CustomTable headerData={tableHeader}>
          {userList.loader ? (
            <Box display={"flex"} justifyContent={"center"}>
              <CustomCircularProgress height={"200px"} />
            </Box>
          ) : (
            <TableDataUi />
          )}
        </CustomTable>
        <Box mt={2} display={"flex"} justifyContent={"right"}>
          {userList?.totalCount > 5 && (
            <Pagination
              totalCount={Number(userList?.totalCount)}
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

export default AceFarmersAndTraders;
