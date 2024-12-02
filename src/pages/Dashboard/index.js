import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TableRow, TableCell } from "@mui/material";
import Card from "../../components/Card";
import { Colors } from "../../constants/Colors";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import { Chart } from "react-google-charts";
import CustomSelectPicker from "../../components/SelectPicker";
import { useAppContext } from "../../context/AppContext";
import { apiRequest } from "../../services/api-request";
import Pagination from "../../components/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import {
  ConvertToEpoch,
  ConvertToEpochAndAddOneDay,
  FormatDatePickerSelect,
} from "../../utilities/date-utility";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./dateStyles.css";
import { useNavigate } from "react-router-dom";

export const data = [
  ["Year", "Sales", "Expenses"],
  ["2004", 1000, 400],
  ["2005", 1170, 460],
  ["2006", 660, 1120],
  ["2007", 1030, 540],
];

export const options = {
  curveType: "function",
  legend: { position: "bottom" },
};

const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Name",
  },
  {
    id: 3,
    title: "Mobile No",
  },
  {
    id: 4,
    title: "Village",
  },
];

const mithunDashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Name",
  },
  {
    id: 3,
    title: "Mobile No",
  },
  {
    id: 4,
    title: "District",
  },
  {
    id: 6,
    title: "Actions",
  },
];

const Dashboard = () => {
  const { user = {} } = useAppContext();
  const { role } = user || {};
  const currentRole = role?.code || "{}";

  const [counterDetails, setCounterDetails] = useState({});

  const [aceList, setAceList] = useState({
    data: [],
    totalCount: "",
  });
  const limit = 10;
  const [skip, setSkip] = useState(0);

  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([null, null]);

  const [startDate, endDate] = dateRange;

  const getDashboardCounters = (fromDate, toDate) => {
    const payload = {
      start_date: fromDate ? fromDate : ConvertToEpochAndAddOneDay(fromDate),
      end_date: toDate ? toDate : ConvertToEpochAndAddOneDay(toDate),
    };
    apiRequest({
      url:
        currentRole === "mithunAdmin"
          ? `madmin/dashboard/counts`
          : `admin/dashboard`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        console.log(res.data, "DDDDDDDDDDDDDDDD")
        setCounterDetails(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getDashboardCounters();
  }, []);

  const ActionButtons = () => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        <Grid item>
          <CustomButton
            title={"Reject"}
            backgroundColor={Colors.screenBg}
            textColor={Colors.textColor}
            width={52}
            height={22}
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Accept"}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={52}
            height={22}
          />
        </Grid>
      </Grid>
    );
  };

  const dashboardsTableData = [
    {
      id: "402563",
      name: "Vijay",
      mobile: "9999999999",
      village: "Hyderabad",
      existingVe: "05",
      district: "Telangana",
      actions: <ActionButtons />,
    },
    {
      id: "402562",
      name: "Vijay",
      mobile: "9999999999",
      village: "Hyderabad",
      existingVe: "05",
      district: "Telangana",
      actions: <ActionButtons />,
    },
    {
      id: "402565",
      name: "Vijay",
      mobile: "9999999999",
      village: "Hyderabad",
      existingVe: "05",
      district: "Telangana",
      actions: <ActionButtons />,
    },
    {
      id: "402566",
      name: "Vijay",
      mobile: "9999999999",
      village: "Hyderabad",
      existingVe: "05",
      district: "Telangana",
      actions: <ActionButtons />,
    },
  ];

  useEffect(() => {
    if (user?.role?.code === "admin") {
      getACEList({ skip, searchText: "" });
    }
  }, [skip]);

  const getACEList = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      sort_field: "_id",
      sort_order: "desc",
      search_fields: ["name", "mobile", "user_id"],
      ...(searchText && {
        searchText: searchText,
      }),
    };
    apiRequest({
      url: `ace/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const aceResponse = res?.data?.map((ace) => ({
          id: ace?.user_id,
          name: ace?.name,
          mobile: ace?.mobile,
          svName: "NA",
          svMobile: "NA",
          farmer: ace?.user_count?.farmers ?? 0,
          trader: ace?.user_count?.traders ?? 0,
          animals:
            ace?.animal_count?.individual + ace?.animal_count?.flock_animals,
          state: ace?.state_name,
          district: ace?.district_name,
          mandal: ace?.mandal_name,
          village: ace?.village_name,
          locationDetails: `${ace?.mandal_name ? ace.mandal_name + "," : ""}${
            ace?.district_name ? ace.district_name + "," : ""
          }${ace?.state_name || ""}`,
          location1: `${ace?.village_name ? ace.village_name + "," : ""}${
            ace?.hamlet_name ? ace.hamlet_name + "," : ""
          }${ace?.mandal_name ? ace.mandal_name + "," : ""}`,
          location2: `${ace?.district_name ? ace.district_name + "," : ""}${
            ace?.state_name ? ace.state_name + "," : ""
          }${ace?.pincode || ""}`,
          actions: <ActionButtons />,
        }));
        setAceList({ data: aceResponse, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const TableDataUi = () => {
    return aceList.data?.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
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
            {row?.mobile}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.village}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={11}
          >
            {row?.locationDetails}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  const renderADCTable = () => {
    return dashboardsTableData.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
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
            {row.name}
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
            {row.district}
          </Typography>
        </TableCell>
        <TableCell>
          <Grid
            container
            alignItems={"center"}
            gap={2}
            display={"flex"}
            justifyContent={"flex-start"}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={12}
              >
                View
              </Typography>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
    ));
  };

  const DashboardCards = (props) => {
    const { title, image, cardValue, incrementValue, totalOrders } = props;
    return (
      <Card>
        <Grid container onClick={props.onClick} justifyContent={"center"} alignItems={"center"} gap={4}>
          <Grid item>
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={13}
              color={Colors.textColor}
            >
              {title}
            </Typography>
            {totalOrders ? (
              <>
                <Box
                  mt={"10px"}
                  mb={2}
                  display={"flex"}
                  gap={"15px"}
                  alignItems={"center"}
                >
                  <Typography
                    onClick={() => navigate(`/request/buy`)}
                    fontFamily={"Poppins-Medium"}
                    fontSize={14}
                    color={Colors.textColor}
                    sx={{ cursor: "pointer" }}
                  >
                    <b>Sell :</b> {props.sellValue}
                  </Typography>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/request/sell")}
                    fontFamily={"Poppins-Medium"}
                    fontSize={14}
                    color={Colors.textColor}
                  >
                    <b>Buy :</b> {props.buyValue}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography
                fontFamily={"Poppins-Medium"}
                fontSize={18}
                color={Colors.textColor}
                mt={1}
                mb={2}
              >
                {cardValue}
              </Typography>
            )}

            <Grid
              container
              justifyContent={"center"}
              alignItems={"center"}
              gap={0.5}
            >
              <Grid item>
                <Box
                  width={41}
                  height={14}
                  backgroundColor={Colors.lightGreen}
                  borderRadius={1}
                >
                  <Typography
                    fontFamily={"Poppins-Regular"}
                    fontSize={9}
                    color={Colors.lightGreen1}
                    textAlign={"center"}
                  >
                    + {incrementValue}
                  </Typography>
                </Box>
              </Grid>
              {/* {Boolean(incrementValue) && ( */}
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Regular"}
                  fontSize={9}
                  color={Colors.textColor}
                >
                  Since Last week
                </Typography>
              </Grid>
              {/* )} */}
            </Grid>
          </Grid>
          <Grid item onClick={props.onClick} sx={{ cursor: "pointer" }}>
            <Box
              width={50}
              height={50}
              borderRadius={25}
              border={2}
              borderColor={Colors.headerColor}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <img src={image} style={styles.dashboardImage} alt="bug" />
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const RegisteredAnimalsLineGraph = (props) => {
    const { title } = props;
    return (
      <Card width={500}>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <Grid item>
            <Typography
              fontFamily={"Poppins-Medium"}
              fontSize={15}
              color={Colors.textColor}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container gap={1}>
              <Grid item>
                <CustomButton
                  title={"Year"}
                  backgroundColor={Colors.lightRed}
                  textColor={Colors.headerColor}
                  width={52}
                  height={20}
                />
              </Grid>
              <Grid item>
                <CustomButton
                  title={"Week"}
                  backgroundColor={Colors.screenBg}
                  textColor={Colors.textColor}
                  width={52}
                  height={20}
                />
              </Grid>
              <Grid item>
                <CustomButton
                  title={"Month"}
                  backgroundColor={Colors.screenBg}
                  textColor={Colors.textColor}
                  width={52}
                  height={20}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={3}
          gap={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item>
            <CustomSelectPicker placeholder={"Category"} width={140} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Breed"} width={140} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"State"} width={140} />
          </Grid>
        </Grid>
        <Grid
          container
          mt={1}
          gap={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item>
            <CustomSelectPicker placeholder={"District"} width={140} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Mandal"} width={140} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Village"} width={140} />
          </Grid>
        </Grid>
        <Grid container mt={1} gap={2} ml={4}>
          <Grid item>
            <CustomSelectPicker placeholder={"Gender"} width={140} />
          </Grid>
          <Grid item>
            <CustomSelectPicker placeholder={"Age"} width={140} />
          </Grid>
          <Grid item></Grid>
        </Grid>
        <Grid container mt={2}>
          <Grid item>
            <Chart
              chartType="LineChart"
              height="300px"
              data={data}
              options={options}
            />
          </Grid>
        </Grid>
      </Card>
    );
  };

  const searchText = (e) => {
    const searchText = e.target.value;
    getACEList({ searchText });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const renderMithunDashboard = () => (
    <>
      {/* Mithun admin Cards starts here */}
      <Grid container mt={2} justifyContent={"center"} alignItems={"center"}>
        <Grid item md={3}>
          <DashboardCards
            title={"Total Farmers"}
            image={require("../../assets/farmer.png")}
            cardValue={counterDetails?.total?.farmers_total}
            incrementValue={counterDetails?.last_week?.farmer}
            onClick={() => navigate(`/user/mithun-farmers`)}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Total Mithun's"}
            image={require("../../assets/broker.png")}
            cardValue={counterDetails?.total?.animals_total}
            incrementValue={counterDetails?.last_week?.animals}
            onClick={() => navigate(`/animals`)}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Total Buyers"}
            image={require("../../assets/farmer.png")}
            cardValue={counterDetails?.total?.buyers_total}
            incrementValue={counterDetails?.last_week?.buyers}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Total ADC's"}
            image={require("../../assets/broker.png")}
            cardValue={"0"}
            incrementValue={0}
          />
        </Grid>

        <Grid item md={3}>
          <DashboardCards
            title={"Total Sell Requests"}
            image={require("../../assets/doctor.png")}
            cardValue={counterDetails?.total?.sell_req_total}
            incrementValue={counterDetails?.last_week?.sell_req}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Health Service Requests"}
            image={require("../../assets/behaviour.png")}
            cardValue={counterDetails?.total?.health_req_total}
            incrementValue={counterDetails?.last_week?.health_req}
            onClick={() => navigate(`/master/health-services`)}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Nutrition Requests"}
            image={require("../../assets/doctor.png")}
            cardValue={counterDetails?.total?.nutrition_req_total}
            incrementValue={counterDetails?.last_week?.nutrition}
            onClick={() => navigate(`/master/feed-nutrition`)}
          />
        </Grid>
        <Grid item md={3}>
          <DashboardCards
            title={"Total Subscribed Requests"}
            image={require("../../assets/behaviour.png")}
            cardValue={counterDetails?.total?.subscribed_animals_total}
            incrementValue={counterDetails?.last_week?.subscribed_animals}
          />
        </Grid>
      </Grid>

      {/* Mithun admin Cards starts here */}
      {/* <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={14}
              >
                Anitra District Co-ordination's
              </Typography>
            </Grid>
            <Grid item>
              <CustomInput
                onChange={(e) => searchText(e)}
                placeholder={"Search"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={mithunDashboardHeader} tableData={[]}>
              {false ? (
                renderADCTable()
              ) : (
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
              )}
            </CustomTable>
          </Box>
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CustomButton
              title={"View more"}
              backgroundColor={Colors.headerColor}
              textColor={Colors.white}
              width={174}
              height={28}
            />
          </Box>
        </Card>
      </Box> */}
    </>
  );

  const handleChange = (update) => {
    if (update?.length) {
      setDateRange(update);
      const [startDate, endDate] = update;
      const startDateLocal = new Date(startDate);
      const endDateLocal = new Date(endDate);
      const startDateString = FormatDatePickerSelect(startDateLocal);
      const endDateString = FormatDatePickerSelect(endDateLocal);
      const fromDate = ConvertToEpoch(startDateString);
      const toDate = ConvertToEpochAndAddOneDay(endDateString);

      if (fromDate && toDate) {
        getDashboardCounters(fromDate, toDate);
      } else {
        getDashboardCounters();
      }
    }
  };

  const lastWeek =
    counterDetails?.last_week?.buy_requests +
    counterDetails?.last_week?.sell_requests;

  return (
    <Box>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Grid container gap={1} alignItems={"center"}>
            <Grid item>
              <DatePicker
                onChange={handleChange}
                selectsRange={true}
                isClearable={true}
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select Date Range"
                className="datePickerReactPackage"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {role?.code === "admin" ? (
        <>
          <Grid
            container
            mt={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item md={3}>
              <DashboardCards
                title={"Total Farmers"}
                image={require("../../assets/farmer.png")}
                cardValue={counterDetails?.total?.farmers_total}
                incrementValue={counterDetails?.last_week?.farmers}
                onClick={() => navigate(`/user/farmers`)}
              />
            </Grid>
            {/* <Grid item md={3}>
              <DashboardCards
                title={"Total Traders"}
                image={require("../../assets/broker.png")}
                cardValue={counterDetails?.total?.traders_total}
                incrementValue={counterDetails?.last_week?.traders}
                onClick={() => navigate(`/user/traders`)}
              />
            </Grid> */}
            <Grid item md={3}>
              <DashboardCards
                title={"Health Service Requests"}
                image={require("../../assets/doctor.png")}
                cardValue={counterDetails?.total?.health_requests_total}
                incrementValue={counterDetails?.last_week?.health_requests}
                onClick={() => navigate(`/request/health-services`)}
              />
            </Grid>
            <Grid item md={3}>
              <DashboardCards
                title={"Total ACE"}
                image={require("../../assets/farmer.png")}
                cardValue={counterDetails?.total?.aces_total}
                incrementValue={counterDetails?.last_week?.aces}
                onClick={() => navigate(`/user/ace`)}
              />
            </Grid>
            <Grid item md={3}>
              <DashboardCards
                title={"Total Livestock"}
                image={require("../../assets/broker.png")}
                cardValue={counterDetails?.total?.animals_total}
                incrementValue={counterDetails?.last_week?.animals}
                onClick={() => navigate(`/animals`)}
              />
            </Grid>
          </Grid>
          <Grid
            container
            mt={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* <Grid item md={3}>
              <DashboardCards
                title={"Total Orders"}
                image={require("../../assets/doctor.png")}
                incrementValue={lastWeek}
                totalOrders={"orders"}
                sellValue={counterDetails?.total?.sell_requests_total}
                buyValue={counterDetails?.total?.buy_requests_total}
              />
            </Grid> */}
            <Grid item md={3}>
              <DashboardCards
                title={"Total Buy Orders"}
                image={require("../../assets/doctor.png")}
                cardValue={counterDetails?.total?.buy_requests_total}
                incrementValue={counterDetails?.last_week?.buy_requests}
                onClick={() => navigate(`/request/buy`)}
              />
            </Grid>
            <Grid item md={3}>
              <DashboardCards
                title={"Total Sell Orders"}
                image={require("../../assets/doctor.png")}
                cardValue={counterDetails?.total?.sell_requests_total}
                incrementValue={counterDetails?.last_week?.sell_requests}
                onClick={() => navigate(`/request/sell`)}
              />
            </Grid>
            <Grid item md={3}>
              <DashboardCards
                title={"Request Feed & Nutrition"}
                image={require("../../assets/behaviour.png")}
                cardValue={counterDetails?.total?.feed_requests_total}
                incrementValue={counterDetails?.last_week?.feed_requests}
                onClick={() => navigate(`/request/feed-nutrition`)}
              />
            </Grid>
            {/* <Grid item md={3}>
              <DashboardCards
                title={"Anitra Animals"}
                image={require("../../assets/behaviour.png")}
                cardValue={counterDetails?.total?.anitra_animals_total}
                incrementValue={counterDetails?.last_week?.anitra_animals}
                onClick={() => navigate(`/animals`)}
              />
            </Grid> */}
            {/* <Grid item md={3}>
              <DashboardCards
                title={"Health Service Requests"}
                image={require("../../assets/doctor.png")}
                cardValue={counterDetails?.total?.health_requests_total}
                incrementValue={counterDetails?.last_week?.health_requests}
                onClick={() => navigate(`/request/health-services`)}
              />
            </Grid> */}
            <Grid item md={3}>
              <DashboardCards
                title={"Logistics Requests"}
                image={require("../../assets/behaviour.png")}
                cardValue={counterDetails?.total?.logistics_requests}
                incrementValue={counterDetails?.last_week?.logistics_requests}
                onClick={() => {alert("Coming Soon....")}}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Card>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item>
                  <Typography
                    fontFamily={"Poppins-Medium"}
                    color={Colors.textColor}
                    fontSize={14}
                  >
                    Anitra Cluster Entrepreneur's
                  </Typography>
                </Grid>
                <Grid item>
                  <CustomInput
                    onChange={(e) => searchText(e)}
                    placeholder={"Search with Name"}
                    leftIcon={
                      <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                    }
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <CustomTable headerData={dashboardHeader}>
                  <TableDataUi />
                </CustomTable>
                <Box mt={2} display={"flex"} justifyContent={"right"}>
                  {aceList?.totalCount > 5 && (
                    <Pagination
                      totalCount={Number(aceList?.totalCount)}
                      skip={skip}
                      limit={limit}
                      onPageChange={handlePageChange}
                    />
                  )}
                </Box>
              </Box>
              <Box
                mt={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {/* <CustomButton
                  title={"View more"}
                  backgroundColor={Colors.headerColor}
                  textColor={Colors.white}
                  width={174}
                  height={28}
                /> */}
              </Box>
            </Card>
          </Box>
        </>
      ) : (
        <>{renderMithunDashboard()}</>
      )}
      {/* <Box mt={2}>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <Grid item>
            <RegisteredAnimalsLineGraph title={"Total animals registered"} />
          </Grid>
          <Grid item>
            <RegisteredAnimalsLineGraph title={"Total animals sold"} />
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
};

export default Dashboard;

const styles = {
  dashboardImage: {
    width: 30,
    height: 30,
  },
};
