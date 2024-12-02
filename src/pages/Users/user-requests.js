import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";
import moment from "moment";
import "moment-timezone";
import SelectPicker from "../../components/SelectPicker";
import Pagination from "../../components/Pagination";

const UserRequests = (props) => {
  const { userId } = props;
  const { user = {} } = useAppContext();
  const currentRole = user?.role?.code || null;
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const tableHeader = [
    {
      id: 1,
      title: "Request ID",
    },
    {
      id: 2,
      title: "Requested On",
    },
    {
      id: 3,
      title: "Request Type",
    },
    {
      id: 4,
      title: "Request Details",
    },

    ...(currentRole === "admin"
      ? [
          {
            id: 5,
            title: "Status",
          },
          // {
          //   id: 6,
          //   title: "Action",
          // },
        ]
      : []),
  ];

  const [userAnimals, setUserAnimals] = useState({
    data: [],
    totalCount: "",
    loader: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    if (userId) {
      getUserRequests(userId, filters);
    }
  }, [userId, filters]);

  const getUserRequests = (userId, filters) => {
    const payload = {
      partner_id: userId,
      skip: skip,
      limit: limit,
      ...(filters.search && {
        searchText: filters.search,
      }),
      ...(filters.type && {
        type: filters.type,
      }),
      ...(filters.status && {
        status: filters.status,
      }),
    };
    apiRequest({
      url: currentRole === "mithunAdmin" ? `madmin/req/list` : `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((request) => {
          let requestDetails = "";
          if (request?.details?.category_details?.display_name) {
            requestDetails += ` ${request?.details?.category_details?.display_name}`;
          }

          if (request?.details?.breed_details?.name) {
            requestDetails += ` | ${request?.details?.breed_details?.name}`;
          }

          if (request?.details?.type_details?.display_name) {
            requestDetails += ` | ${request?.details?.type_details?.display_name}`;
          }
    

          const data = {
            id: request?.id,
            requestedOn: request?.created_on,
            requestType: request?.type,
            requestDetails: `${
              request?.details?.display_name
                ? request?.details?.display_name
                : ""
            } ${requestDetails}`,
            status: request?.status,
            action: "",
          };

          return data;
        });
        setUserAnimals({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleSearchTextChange = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: selectedValue,
    }));
  };
  const selectRequestTypeOptions = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      type: selectedValue,
    }));
  };

  const selectStatusOptions = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      status: selectedValue,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      requestTypeOptions: "",
      statusOptions: "",
    });
    getUserRequests(userId, {
      search: "",
      requestTypeOptions: "",
      statusOptions: "",
    });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return userAnimals?.data?.map((row) => {
      const requestedDate = row?.requestedOn;
      const utcDate = new Date(requestedDate);
      const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");
      const istRequestedDate = moment(istDateTimeEndsAt, "YYYY-MM-DD");
      const istEndsTime = istRequestedDate.format("HH:mm")

      return (
        <>
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
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
              >
                {istRequestedDate.format("DD MMM YYYY")}
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
              >
                {istEndsTime}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.requestType}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.requestDetails}
              </Typography>
            </TableCell>

            {currentRole === "admin" && (
              <>
                <TableCell>
                  <Typography
                    fontFamily={"Poppins-Regular"}
                    color={Colors.textColor}
                    fontSize={12}
                  >
                    {row.status}
                  </Typography>
                </TableCell>
                {/* <TableCell>
                  <CustomButton
                    title={`View`}
                    handleButtonClick={() => {
                      console.log("hiii");
                    }}
                    backgroundColor={Colors.white}
                    textColor={Colors.headerColor}
                    width={110}
                    height={32}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                  />
                </TableCell> */}
              </>
            )}
          </TableRow>
        </>
      );
    });
  };

  const statusOptions = [
    { name: "Closed", value: "CLOSED" },
    { name: "Completed", value: "COMPLETED" },
    { name: "OPEN", value: "OPEN" },
    { name: "In-Process", value: "IN_PROCESS" },
    { name: "Cancelled", value: "CANCELLED " },
  ];
  const requestTypeOptions = [
    { name: "Health", value: "HEALTH" },
    { name: "Logistics", value: "LOGISTICS" },
    { name: "Feed", value: "FEED" },
    { name: "Buy", value: "BUY" },
    { name: "Sell", value: "SELL" },
  ];

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
            placeholder={"Search"}
            padding={"12px 12px 12px 0px"}
            value={filters.search}
            onChange={(e) => handleSearchTextChange(e)}
            leftIcon={
              <SearchOutlinedIcon style={{ color: Colors.greyColor }} />
            }
          />
        </Grid>
        <Grid item md={3}>
          <SelectPicker
            options={requestTypeOptions}
            value={filters.requestTypeOptions}
            type={"text"}
            onChange={selectRequestTypeOptions}
            placeholder={"Select Request Type"}
          />
        </Grid>
        <Grid item md={3}>
          <Box>
            <SelectPicker
              options={statusOptions}
              value={filters.status}
              onChange={selectStatusOptions}
              type={"text"}
              placeholder={"Status"}
            />
          </Box>
        </Grid>
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

export default UserRequests;
