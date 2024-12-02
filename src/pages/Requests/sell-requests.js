import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TableCell,
  TableRow,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import CustomSelectPicker from "../../components/SelectPicker";
import { apiRequest } from "../../services/api-request";
import { BUY_STATUS } from "../../utilities/constants";
import Pagination from "../../components/Pagination";
import {
  EpochFormatDate,
  UTCformatOnlyDate,
} from "../../utilities/date-utility";
import { downloadFile } from "../../utilities/exportToCsv";

const dashboardHeader = [
  {
    id: 1,
    title: "SN.o",
  },
  {
    id: 1,
    title: "Request ID",
  },
  {
    id: 2,
    title: "Date",
  },
  {
    id: 3,
    title: "Partner",
  },
  {
    id: 4,
    title: "Sell Request Details",
  },

  {
    id: 6,
    title: "No of Buy Requests",
  },
  {
    id: 7,
    title: "Status",
  },
  // {
  //   id: 8,
  //   title: "Action",
  // },
];

const SellRequests = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([])
  const [animalBreeds, setAnimalBreeds] = useState({
    data: [],
    totalCount: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    animalCategory: "",
    animalBreed: "",
  });

  const [sellRequestCsv, setSellRequestCsv] = useState([]);

  const navigate = useNavigate();

  const [sellRequestList, setSellRequestList] = useState({
    data: [],
    totalCount: "",
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getSellRequests(filters);
  }, [skip, filters]);

  const getSellRequests = (filters) => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "SELL",
      ...(filters.status && {
        status: filters.status,
      }),
      ...(filters.animalCategory && {
        animal_category:filters.animalCategory
      })
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setData(res?.data);
        const modifiedData = res?.data?.map((sellRequest) => {
          const data = {
            id: sellRequest?.id,
            reqOn: sellRequest?.created_on,
            reqByName: sellRequest?.partner_details?.name,
            reqByUserId: sellRequest?.partner_details?.user_id,
            reqByRole: sellRequest?.partner_details?.type,
            reqName: sellRequest?.details?.display_name,
            orderDetails: `${sellRequest?.details?.category_details?.display_name} | ${sellRequest?.details?.breed_details?.display_name} | ${sellRequest?.details?.type_details?.display_name}`,
            // orderDetails1: `${sellRequest?.details?.age_in_months} Months | ${sellRequest?.details?.details?.weight} Kg | ${sellRequest?.details?.details?.no_of_calvings} | ${sellRequest?.details?.details?.milking_quantity} Ltr`,
            sellingPrice: sellRequest?.seller_price,
            noOfSellRequests: 0,
            status: sellRequest?.status,
          };
          return data;
        });
        setSellRequestList({
          data: modifiedData,
          totalCount: res?.total_count,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getBreeds();
  }, []);

  const getCategories = () => {
    apiRequest({
      url: `master/categories`,
      method: "GET",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animal) => ({
          name: animal?.display_name,
          value: animal?.id,
        }));
        setCategories(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

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
          name: categories?.display_name,
        }));
        setAnimalBreeds({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleChangeStatus = (e) => {
    const searchStatus = e.target.value;
    setFilters({
      status: searchStatus,
    });
  };

  const handleClearClick = () => {
    setFilters({
      status: "",
    });
  };

  const TableDataUi = () => {
    return sellRequestList?.data?.map((row, index) => (
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
            {skip + index +1 }
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/request/sell/${row?.id}/details`, {state: data[index]})
            }
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
            {EpochFormatDate(row.reqOn)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() => {
              const role = row?.reqByRole === "TRADER" ? "traders" : "farmers";
              navigate(`/user/${role}/${row?.reqByUserId}/details/basic`);
            }}
          >
            {row?.reqByName}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={13}
          >
            {row?.reqByRole}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails1}
          </Typography>
        </TableCell>
        {/* <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.sellingPrice}
          </Typography>
        </TableCell> */}
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.noOfSellRequests}
          </Typography>
        </TableCell>
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
              navigate(`/request/sell/${row?.id}/details`);
            }}
            backgroundColor={Colors.white}
            textColor={Colors.headerColor}
            width={110}
            height={30}
            borderColor={Colors.headerColor}
            textFontSize={14}
          />
        </TableCell> */}
      </TableRow>
    ));
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const handleChangeBreed = (e) => {
    setFilters({
      animalBreed: e.target.value,
    });
  };

  const handleChangeCategory = (e) => {
    setFilters({
      animalCategory: e.target.value,
    });
  };

  useEffect(() => {
    let headers = [
      "Request Id,Date,Partner Name,Partner Type, Sell Request Details,No of Sell Requests, Status",
    ];
    let orderCsv;
    if (Array.isArray(sellRequestCsv) && sellRequestCsv.length > 0) {
      orderCsv = sellRequestCsv?.reduce((acc, sellRequest, index) => {
        const {
          id,
          created_on,
          partner_details,
          details,
          noOfSellRequests = 0,
          status,
        } = sellRequest;

        const requestID = id;
        const date = UTCformatOnlyDate(created_on);
        const formatedDate = date.replace(/\W/g, " ");
        const requestedName = partner_details?.name;
        const reqByRole = partner_details?.type ?? "NA";
        const sellRequestDetails = `${details?.category_details?.display_name} | ${details?.breed_details?.display_name} | ${details?.type_details?.display_name}`;
        const farmerSellRequest = noOfSellRequests;
        const buyStatus = status;
        acc.push(
          [
            requestID,
            formatedDate,
            requestedName,
            reqByRole,
            sellRequestDetails,
            farmerSellRequest,
            buyStatus,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...orderCsv].join("\n"),
        fileName: "Sell Request.csv",
        fileType: "text/csv",
      });
    }
  }, [sellRequestCsv]);

  const exportCSV = () => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "SELL",
      ...(filters.status && {
        status: filters.status,
      }),
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setSellRequestCsv(res?.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {"Sell Requests"}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Requests > Sell`}
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"Export List"}
            handleButtonClick={exportCSV}
            padding={"4px 20px"}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            textFontSize={14}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <Grid
            width={"100%"}
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item width={"100%"}>
              <Grid container gap={2} alignItems={"center"} width={"100%"}>
                <Grid item md={3}>
                  <CustomInput
                    placeholder={"Search"}
                    leftIcon={
                      <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                    }
                  />
                </Grid>
                <Grid item md={2}>
                  <CustomSelectPicker
                    placeholder={"Animal Category"}
                    width={180}
                    onChange={handleChangeCategory}
                    options={categories}
                    value={filters.animalCategory}
                  />
                </Grid>
                <Grid item md={2}>
                  <CustomSelectPicker
                    placeholder={"Animal Breed"}
                    width={180}
                    options={animalBreeds.data}
                    onChange={handleChangeBreed}
                    value={filters.status}
                  />
                </Grid>
                <Grid item md={2}>
                  <CustomSelectPicker
                    placeholder={"Select status"}
                    width={180}
                    options={BUY_STATUS}
                    value={filters.status}
                    onChange={(e) => handleChangeStatus(e)}
                  />
                </Grid>
                <Grid item width={"8%"}>
                  <Box
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
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader}>
              <TableDataUi />
            </CustomTable>
          </Box>
          <Box mt={2} display={"flex"} justifyContent={"right"}>
            {sellRequestList?.totalCount > 10 && (
              <Pagination
                totalCount={Number(sellRequestList?.totalCount)}
                skip={skip}
                limit={limit}
                onPageChange={handlePageChange}
              />
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SellRequests;
