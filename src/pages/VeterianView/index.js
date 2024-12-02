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
import { AvatarView } from "../../pages/UserView";
import { Checkbox } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomTab } from "../../components/CustomTabs";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";

const label = { inputProps: { "aria-label": "switch" } };


const VeterianDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(location.state);
  const [statesList, setStatesList] = useState();
  const [districtList, setDistrictList] = useState();
  const [mandalList, setMandalList] = useState()
  const [villageList, setVillageList] = useState()
  const [reqList, setReqList] = useState([])
  const { user } = useAppContext();
  const tabs = [
    {
      id: 1,
      title: "Basic Info",
    },
    {
      id: 2,
      title: `Requests`,
    },
    // {
    //   id: 3,
    //   title: `Service Villages`,
    // },
  ];
  const [tab, setTab] = useState(tabs[0]);

  useEffect(()=>{
    console.log(details, "DDDDDDDDDDDDDDDDD")
    getStates();
    getReqList();
    // getDistricts();
    // getMandalList();
    // getVillageList();
  },[])

  const getStates = () => {
    const URL = `master/states`
    const method = "GET"
  
    console.log(URL,method)

    apiRequest({
      url: URL,
      method: method,
    })
    .then((res) => {
      console.log(res, res.data.length, "OOOOOOOOOOOOOOOOOOOOO");

      const getStatesList = res?.data?.filter((item) => 
        item?.id == details?.state
      )
      .map((item) => item?.display_name)
      .join('');

      console.log(getStatesList, "LIST...............");
      setStatesList(getStatesList);
      getDistricts();
    })
    .catch((err) => {
      alert(err?.response?.data?.message, "error");
    });
  };

  const getDistricts = (stateName) => {
    const URL =
      user?.role?.code === "admin"
        ? `master/districts`
        : `madmin/master/districts`;
    const payload = {
      state_id: Number(statesList),
      limit: 5000,
    };
    const mithunPayload = {
      state_name: stateName,
      limit: 5000,
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          // const getDistricts = res?.data?.map((district) => ({
          //   name: district?.name,
          //   value: district?.id,
          // }));

          const getDistricts = res?.data?.filter((item) => 
            item?.id == details?.district
          )
          .map((item) => item?.display_name)
          .join('');

          setDistrictList(getDistricts);
          getMandalList();
        } else {
          const getDistricts = res?.data?.filter((item) => 
            item?._id == details?.district
          )
          .map((item) => item?.display_name)
          .join('');

          setDistrictList(getDistricts);
          getMandalList();
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getMandalList = (districtId) => {
    console.log(districtId, "hi");
    const payload = {
      district_id: districtList,
      limit: 1000,
    };
    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        // const getMandalList = res?.data?.map((mandal) => ({
        //   name: mandal?.name,
        //   value: mandal?.id,
        // }));
        const getMandalList = res?.data?.filter((item) => 
          item?.id == details?.mandal
        )
        .map((item) => item?.display_name)
        .join('');

        setMandalList(getMandalList);
        getVillageList();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVillageList = (mandalId) => {
    const payload = {
      mandal_id: mandalList,
      limit: 1000,
    };
    apiRequest({
      url: `master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        // const getVillageList = res?.data?.map((village) => ({
        //   name: village?.name,
        //   value: village?.id,
        // }));

        const getVillageList = res?.data?.filter((item) => 
          item?.id == details?.village
        )
        .map((item) => item?.display_name)
        .join('');

        setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getReqList = () => {
    const payload = {
      type: "HEALTH",
      limit: 1000,
      status: "IN_PROCESS"
    };
    apiRequest({
      url: `request/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getReqList = res?.data?.filter((item) => 
          item?.vet_id == details?.user_id
        )
        setReqList(getReqList)
        // .map((item) => item?.display_name)

        console.log(getReqList, "RRRRRRRRRRR")
        // .join('');

        // setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const BasicInfo = () => {
    return (
      <Box m={3}>
        <Typography
          fontFamily={"Poppins-Medium"}
          fontSize={13}
          color={Colors.textColor}
        >
          Basic Details
        </Typography>
        <Box m={2}>
          <Grid container justifyContent={"space-around"} alignItems={"center"}>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"ID"}
                value={details?.user_id}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Name"}
                value={details?.name}
                disabled={true}
                blackDisabled={true}
                bgColor={Colors.white}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Mobile Number"}
                value={details?.mobile}
                disabled={true}
                blackDisabled={true}
                bgColor={Colors.white}
              />
            </Grid>
          </Grid>
          <Grid
            container
            mt={4}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Email"}
                disabled={true}
                blackDisabled={true}
                value={details?.email}
                bgColor={Colors.white}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Id Type"}
                value={details?.work_exp + " Years"}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Id Number"}
                value={details?.reg_no}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
          </Grid>
          <Grid
            container
            mt={4}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Address Line"}
                value={details?.role}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Village"}
                value={villageList}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Mandal"}
                value={mandalList}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
          </Grid>
          <Grid
            container
            mt={4}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"District"}
                value={districtList}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"State"}
                value={statesList}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
            <Grid item width={250}>
              <CustomInput
                placeholder={""}
                label={"Pincode"}
                value={details?.pincode}
                bgColor={Colors.white}
                disabled={true}
                blackDisabled={true}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const VillageEnterpre = () => {
    return (
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid item md={6}>
          <Card>
            <Box margin={2}>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item>
                  <Typography
                    fontFamily={"Poppins-Medium"}
                    fontSize={13}
                    color={Colors.textColor}
                  >
                    Health Services
                  </Typography>
                </Grid>
              </Grid>

              <Box m={2}>
                <Grid container flexDirection={"column"} gap={1}>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      1. General Visit Doctor
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      2. Distocia
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      3. Surgical Suturing's
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item md={6}>
          <Card>
            <Box margin={2}>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item>
                  <Typography
                    fontFamily={"Poppins-Medium"}
                    fontSize={13}
                    color={Colors.textColor}
                  >
                    Health Services Areas
                  </Typography>
                </Grid>
                <Grid item>
                  <CustomButton
                    title={"+ Add Village"}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={96}
                    height={22}
                  />
                </Grid>
              </Grid>

              <Box m={2}>
                <Grid container flexDirection={"column"} gap={1}>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      1. Alimpur, Mandal, Jungoun, Telangana
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      2. Alimpur, Mandal, Jungoun, Telangana
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Regular"}
                      color={Colors.textColor}
                      fontSize={13}
                    >
                      3. Alimpur, Mandal, Jungoun, Telangana
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const Requests = () => {
    const tableHeader = [
      {
        id: 1,
        title: "Req id",
      },
      {
        id: 2,
        title: "Req by",
      },
      {
        id: 3,
        title: "Req on",
      },
      {
        id: 4,
        title: "Req name",
      },
      {
        id: 5,
        title: "Livestock",
      },
      {
        id: 6,
        title: "Location",
      },
      {
        id: 7,
        title: "Status",
      },
    ];

    const tableData = [
      {
        id: "402563",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402564",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402565",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402566",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402567",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402568",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
      {
        id: "402569",
        reqOn: "22 Aug 2022",
        reqByName: "Sujith S",
        reqByRole: "Farmer",
        reqName: "General Visit Doctor",
        liveStock: "Buffalo",
        reqToRole: "Farmer",
        reqToName: "Dr. Manish Kushwah",
        location: "Lalapeta",
        status: "Accepted",
      },
    ];

    const TableDataUi = () => {
      return reqList.map((row, index) => (
        <TableRow
          key={row.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={12}
              sx={{ textDecorationLine: "underline", cursor: "pointer" }}
              onClick={() =>
                navigate(`/request/health-service/${row?.id}/details`, {state: reqList[index]})
              }
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
              {details?.name}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.black}
              fontSize={13}
              // sx={{ textDecorationLine: "underline", cursor: "pointer" }}
              // onClick={() => {
              //   navigate("/UserView/farmers");
              // }}
            >
              {row.updated_on}
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={13}
            >
              {row.reqByRole}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row?.details?.display_name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.vet_animal}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row?.partner_details?.hamlet_name + ', ' + row?.partner_details?.village_name + ', ' + row?.partner_details?.mandal_name + ', ' + row?.partner_details?.district_name + ', ' + row?.partner_details?.state_name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
            >
              {row.status}
            </Typography>
          </TableCell>
        </TableRow>
      ));
    };
    return (
      <Box m={3}>
        <Box mt={2}>
          <CustomTable headerData={tableHeader} tableData={tableData}>
            <TableDataUi />
          </CustomTable>
        </Box>
      </Box>
    );
  };

  const AceVillages = () => {
    return (
      <Box m={2}>
        <Grid
          container
          mt={4}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item width={250}>
            <CustomInput
              placeholder={""}
              label={"State"}
              disable={true}
              value={"Telengana"}
            />
          </Grid>
          <Grid item width={250}>
            <CustomInput
              placeholder={""}
              label={"District"}
              disable={true}
              value={"Alimpuram"}
            />
          </Grid>
          <Grid item width={250}>
            <CustomInput
              placeholder={""}
              label={"Mandal"}
              disable={true}
              value={"Junguon"}
            />
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Grid item width={250}>
            <CustomInput
              placeholder={"Search"}
              leftIcon={
                <SearchOutlinedIcon style={{ color: Colors.textColor }} />
              }
            />
          </Grid>
        </Grid>
        <Box mt={1}>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={13}
            color={Colors.textColor}
          >
            Animals
          </Typography>
        </Box>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems={"center"}>
              <Grid item>
                <Checkbox
                  {...label}
                  size={"small"}
                  sx={{
                    color: Colors.textColor,
                    "&.Mui-checked": {
                      color: Colors.headerColor,
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={13}
                >
                  Village1
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
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
            Veterinarians View
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Partners  Veterinarians  View
          </Typography>
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
              <AvatarView
                name={details?.name}
                designation={`Veterinarian : ${details?.qualification}`}
                nameColor={Colors.textColor}
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
          <CustomTab data={tabs} tab={tab} setTab={setTab} />
          {tab.id === 1 && <BasicInfo />}
          {tab.id === 2 && <Requests />}
          {tab.id === 3 && <AceVillages />}
        </Card>
        {/* {tab.id === 1 && <VillageEnterpre />} */}
      </Box>
    </Box>
  );
};

export default VeterianDetails;
