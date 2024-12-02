import React, { useEffect, useState } from "react";
import { HocLayout } from "../../components/Hoc";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelectPicker from "../../components/SelectPicker";
import { apiRequest } from "../../services/api-request";
import { BUY_STATUS } from "../../utilities/constants";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination";
import {
  EpochFormatDate,
  UTCformatOnlyDate,
} from "../../utilities/date-utility";
import { downloadFile } from "../../utilities/exportToCsv";


const dashboardHeader = [
  {
    id: 1,
    title: "SN.O",
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
    title: "Buy Request Details",
  },
  {
    id: 4,
    title: "Buying Price",
  },
  {
    id: 4,
    title: "No of Sell Requests",
  },
  {
    id: 5,
    title: "Status",
  },
  // {
  //   id: 6,
  //   title: "Action",
  // },
];

const BuyRequests = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  const { orderType, requestId } = useParams();

  const [data, setData] = useState([])

  const navigate = useNavigate();

  const [buyRequestList, setBuyRequestList] = useState({
    data: [],
    totalCount: "",
  });

  const [animalBreeds, setAnimalBreeds] = useState({
    data: [],
    totalCount: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    animalCategory: "",
    animalBreed: "",
  });

  const [buyRequestCSVList, setBuyRequestCSVList] = useState([]);

  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getBuyRequests(filters);
  }, [skip, filters]);

  const getBuyRequests = (filters) => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "BUY",
      ...(filters.status && {
        status: filters.status,
      }),
      ...(filters.animalCategory && {
        animal_category: filters.animalCategory,
      }),
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setData(res?.data);
        const modifiedData = res?.data?.map((buyRequest) => {
          const categoryDisplayName =
            buyRequest?.details?.category_details?.display_name || "";
          const animalBreeds =
            buyRequest?.details?.breeds
              ?.map((item) => item?.display_name)
              .filter(Boolean) || [];
          const animalTypes =
            buyRequest?.details?.types
              ?.map((item) => item?.display_name)
              .filter(Boolean) || [];

          let orderDetails = categoryDisplayName;

          if (animalBreeds?.length > 0) {
            orderDetails += ` | ${animalBreeds.join(", ")}`;
          }

          if (animalTypes?.length > 0) {
            orderDetails += ` | ${animalTypes.join(", ")}`;
          }

          let ageTo;
          if (buyRequest?.details?.age_to === 10000) {
            ageTo = 144;
          } else {
            ageTo = buyRequest?.details?.age_to;
          }
          let ageFrom = buyRequest?.details?.age_from;
          const lifeSpan = ageTo - ageFrom;
          const years = Math.floor(lifeSpan / 12);

          const remainingMonths = lifeSpan % 12;
          const yearsLabel = years === 1 ? "year" : "years";
          const monthsLabel = remainingMonths === 1 ? "month" : "months";

          let weightOfAnAnimalFrom = buyRequest?.details?.weight_from;
          let weightOfAnimalTo = buyRequest?.details?.weight_to;

          const weightOfAnimal = `${weightOfAnAnimalFrom} Kg${
            weightOfAnimalTo ? ` - ${weightOfAnimalTo} Kg` : ""
          }`;

          const rings =
            buyRequest?.details?.category_details?.fields
              .filter((item) => item?.display_name === "No of Rings")
              .map((item) => item?.max) || [];

          let noOfRings = "";
          if (rings?.length > 0) {
            noOfRings = ` | ${rings.join(", ")} Rings`;
          }

          const lifeS = buyRequest?.age - 0;
          const yearss = Math.floor(lifeS / 12);

          const remainingMonthss = lifeS % 12;
          const yearsLabels = yearss === 1 ? "year" : "years";
          const monthsLabels = remainingMonthss === 1 ? "month" : "months";

          const animalPriceFrom = buyRequest?.details?.price_from;
          const animalPriceTo = buyRequest?.details?.price_to;
          const buyingPrice = `${animalPriceFrom}  - ${animalPriceTo} Rs`;
          const ages = 
          buyRequest && buyRequest?.age ? 
          // (buyRequest?.age + " Years") 
          `${yearss} ${yearsLabels} ${remainingMonthss} ${monthsLabels}`
          : `${years} ${yearsLabel} ${remainingMonths} ${monthsLabel}`
          const weights = buyRequest && buyRequest?.weight ? (buyRequest?.weight + " Kgs") : weightOfAnimal
          const milks = buyRequest && buyRequest?.details && buyRequest?.details?.milk_qty_to && buyRequest?.details?.milk_qty_to!=10000 ? ( ' | ' + buyRequest?.details?.milk_qty_to + " Ltrs") : ""
          console.log(buyRequest, "BBBBBBBBBBBBBb")
          const data = {
            id: buyRequest?.id,
            reqOn: buyRequest?.created_on,
            reqByName: buyRequest?.partner_details?.name,
            reqByUserId: buyRequest?.partner_id,
            reqByRole: buyRequest?.partner_details?.type,
            reqName: buyRequest?.details?.display_name,
            orderDetails: orderDetails,
            orderDetails1: ` | ${ages} | ${weights} ${milks}`,
            buyingPrice: buyingPrice,
            buyPrice: buyRequest?.buyer_price,
            noOfSellRequests: 0,
            age: buyRequest && buyRequest?.age ? buyRequest?.age : "",      
            weight: buyRequest && buyRequest?.weight ? buyRequest?.weight : "",
            status: buyRequest?.status,
            animal_id: buyRequest?.animal_id
          };
          return data;
        });
        setBuyRequestList({
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

  const TableDataUi = () => {
    return buyRequestList.data?.map((row, index) => (
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
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/request/buy/${row?.id}/details`, {state: data[index]})
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
            onClick={() =>
              navigate(`/user/traders/${row.reqByUserId}/details/basic`)
            }
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
          {row.animal_id && row.animal_id!="" ? <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              // navigate(`/user/traders/${row.animal_id}/details/basic`)
              // `/${
              //   location?.pathname?.includes("/mithun/animals")
              //     ? "mithun-animals"
              //     : "animals"
              // }/${row?.animal_id}/details/basic`
              navigate(`/${
                "animals"
              }/${row?.animal_id}/details/basic`)
            }
          >
            {row?.animal_id}
          </Typography> : null}
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails + " " + row.orderDetails1}
          </Typography>
          {/* <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.orderDetails1}
          </Typography> */}
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.buyPrice!=0 ? row.buyPrice + " Rs" : row.buyingPrice}
          </Typography>
        </TableCell>
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
          <Typography
            textAlign={"center"}
            sx={{ cursor: "pointer" }}
            fontFamily={"Poppins-Regular"}
            color={"#B1040E"}
            padding={"5px 15px"}
            borderRadius={"4px"}
            border={"1px solid #B1040E"}
            fontSize={12}
            onClick={() => {
              navigate(`/request/buy/${row?.id}/details`);
            }}
          >
            View
          </Typography>
        </TableCell> */}
      </TableRow>
    ));
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

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const handleChangeCategory = (e) => {
    setFilters({
      animalCategory: e.target.value,
    });
  };

  const handleChangeBreed = (e) => {
    setFilters({
      animalBreed: e.target.value,
    });
  };

  useEffect(() => {
    let headers = [
      "Request Id,Date,Partner Name,Partner Type, Buy Request Details,Buying Price,No of Sell Requests, Status",
    ];
    let orderCsv;
    if (Array.isArray(buyRequestCSVList) && buyRequestCSVList.length > 0) {
      orderCsv = buyRequestCSVList?.reduce((acc, buyRequest, index) => {
        const {
          id,
          created_on,
          partner_details,
          details,
          noOfSellRequests = 0,
          status,
        } = buyRequest;

        const categoryDisplayName =
          details?.category_details?.display_name || "";
        const animalBreeds =
          details?.breeds?.map((item) => item?.display_name).filter(Boolean) ||
          [];
        const animalTypes =
          details?.types?.map((item) => item?.display_name).filter(Boolean) ||
          [];

        let orderDetails = categoryDisplayName;

        if (animalBreeds?.length > 0) {
          orderDetails += ` | ${animalBreeds.join(", ")}`;
        }

        if (animalTypes?.length > 0) {
          orderDetails += ` | ${animalTypes.join(", ")}`;
        }

        let ageTo;
        if (buyRequest?.details?.age_to === 10000) {
          ageTo = 144;
        } else {
          ageTo = buyRequest?.details?.age_to;
        }
        let ageFrom = buyRequest?.details?.age_from;
        const lifeSpan = ageTo - ageFrom;
        const years = Math.floor(lifeSpan / 12);

        const remainingMonths = lifeSpan % 12;
        const yearsLabel = years === 1 ? "year" : "years";
        const monthsLabel = remainingMonths === 1 ? "month" : "months";

        let weightOfAnAnimalFrom = buyRequest?.details?.weight_from;
        let weightOfAnimalTo = buyRequest?.details?.weight_to;

        const weightOfAnimal = `${weightOfAnAnimalFrom} Kg${
          weightOfAnimalTo ? ` - ${weightOfAnimalTo} Kg` : ""
        }`;

        const rings =
          buyRequest?.details?.category_details?.fields
            .filter((item) => item?.display_name === "No of Rings")
            .map((item) => item?.max) || [];

        let noOfRings = "";
        if (rings?.length > 0) {
          noOfRings = `${rings.join(", ")} Rings |`;
        }

        const animalPriceFrom = details?.price_from;
        const animalPriceTo = details?.price_to;
        const buyingPrice = `${animalPriceFrom}  - ${animalPriceTo} Rs`;

        const aceId = id;
        const date = UTCformatOnlyDate(created_on);
        const formatedDate = date.replace(/\W/g, " ");
        const requestedName = partner_details?.name;
        const reqByRole = partner_details?.type ?? "NA";
        const buyRequestDetails = `${orderDetails} ${years} ${yearsLabel} ${remainingMonths} ${monthsLabel} | ${weightOfAnimal} | ${noOfRings} ${buyRequest?.details?.milk_qty_to} Ltr`;
        const farmerBuyingPrice = buyingPrice;
        const farmerSellRequest = noOfSellRequests;
        const buyStatus = status;
        acc.push(
          [
            aceId,
            formatedDate,
            requestedName,
            reqByRole,
            buyRequestDetails,
            farmerBuyingPrice,
            farmerSellRequest,
            buyStatus,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...orderCsv].join("\n"),
        fileName: "Buy Request.csv",
        fileType: "text/csv",
      });
    }
  }, [buyRequestCSVList]);

  const exportCSV = () => {
    const payload = {
      skip: skip,
      limit: limit,
      type: "BUY",
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setBuyRequestCSVList(res?.data);
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
            {"Buy Requests"}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Requests > Buy`}
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
                    value={filters.animalCategory}
                    options={categories}
                    onChange={handleChangeCategory}
                  />
                </Grid>
                <Grid item md={2}>
                  <CustomSelectPicker
                    placeholder={"Animal Breed"}
                    width={180}
                    value={filters.animalBreed}
                    options={animalBreeds.data}
                    onChange={handleChangeBreed}
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

            <Grid item>
              {orderType == "sell" && (
                <CustomButton
                  title={`Mark for Anitra`}
                  handleButtonClick={() => {
                    navigate("/buy");
                  }}
                  backgroundColor={Colors.white}
                  textColor={Colors.headerColor}
                  width={130}
                  height={32}
                  borderColor={Colors.headerColor}
                  textFontSize={14}
                />
              )}
            </Grid>
          </Grid>

          <Box mt={2}>
            <CustomTable headerData={dashboardHeader}>
              <TableDataUi />
            </CustomTable>
          </Box>
          <Box mt={2} display={"flex"} justifyContent={"right"}>
            {buyRequestList?.totalCount > 10 && (
              <Pagination
                totalCount={Number(buyRequestList?.totalCount)}
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

export default BuyRequests;
