import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { apiRequest } from "../../services/api-request";
// import AddEditUser from "./add-edit-employees";
import AddEditVeteran from "./add-edit-veteran";
import { useForm, Controller } from "react-hook-form";
import SelectPicker from "../../components/SelectPicker";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import { useAppContext } from "../../context/AppContext";
import MithunFarmerFilter from "./mithun-farmer-filter";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { debounce } from "lodash";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { downloadFile } from "../../utilities/exportToCsv";

const dashboardHeader = [
  {
    id: 1,
    title: "S.No",
  },
  {
    id: 1,
    title: "Veterinarian ID",
  },
  {
    id: 2,
    title: "Veterinarian Name",
  },
  {
    id: 3,
    title: "Veterinarian Contact",
  },
  {
    id: 4,
    title: "Veterinarian Role",
  },
  {
    id: 5,
    title: "Veterinarian Email",
  },
  {
    id: 6,
    title: "Actions",
  }
];

const users = [
  {
    name: "Veteinarian",
    value: "VETEINARIAN",
  },
  {
    name: "Para VET",
    value: "PARA_VET",
  }
];

const mithunAnitraUserHeaders = [
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
    title: "Name",
  },
  {
    id: 3,
    title: "Veterinarian Location",
  },
  {
    id: 4,
    title: "On Boarded",
  },
  {
    id: 5,
    title: "Tribe",
  },
  {
    id: 6,
    title: "Mithun's",
  },
  {
    id: 7,
    title: "Total Requests",
  },
  // {
  //   id: 8,
  //   title: "Actions",
  // },
];

const Veteran = () => {
  const { user = {} } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useParams();
  const [openAceRequestModal, setOpenAceRequestModal] = useState({
    data: {},
    open: false,
  });
  const role =
    userType === "farmers"
      ? "Farmers"
      : userType === "traders"
      ? "Traders"
      : "Anitra Users";
  const roleSingular =
    userType === "farmers"
      ? "Farmer"
      : userType === "traders"
      ? "Trader"
      : "Anitra Users";

  const [userList, setUserList] = useState({});
  const [currentAnitraUserState, setCurrentAnitraUserState] = useState({});

  const { handleSubmit, control } = useForm({
    defaultValues: {
      selectState: "",
      district: "",
      userType: "",
      selectVillage: "",
      hamlet: "",
    },
  });

  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [mandalList, setMandalList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [aceList, setAceList] = useState([]);
  const [selectedHamletValue, setSelectedHamletValue] = useState({});
  const [openVillageList, setOpenVillageList] = useState(false);
  const [openHamletList, setOpenHamletList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hamletLoading, setHamletLoading] = useState(false);
  const [villageSearchQuery, setVillageSearchQuery] = useState({
    data: [],
  });

  const [hamletSearchQuery, setHamletSearchQuery] = useState({
    data: [],
  });

  const [userAnimalsCSV, setUserAnimalsCSV] = useState({
    data: [],
    loader: false,
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    state_id: "",
    district_id: "",
    mandal_id: "",
    village_id: "",
    hamlet_id: "",
  });

  const currentRole = user?.role?.code || null;

  const [openUserModal, setOpenUserModal] = useState({
    open: false,
    data: [],
  });

  useEffect(() => {
    if (currentRole === "admin") {
      getStates();
    }
  }, []);

  useEffect(() => {
    if (filters.state_id) {
      getDistrictList();
    }
  }, [filters.state_id]);

  useEffect(() => {
    if (filters.district_id) {
      getMandalList();
    }
  }, [filters.district_id]);

  useEffect(() => {
    if (filters.mandal_id) {
      getVillageList();
    }
  }, [filters.mandal_id]);

  const handleSearchTextChange = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: selectedValue,
    }));
  };
  
  const selectState = (e) => {
    const selectedValue = e.target.value.toString();
    setFilters((prev) => ({
      ...prev,
      state_id: selectedValue,
    }));
  };

  const selectDistrict = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      district_id: selectedValue,
    }));
  };

  const selectMandal = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      user_type: selectedValue,
    }));
  };

  const selectMandals = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      mandal_id: selectedValue,
    }));
  };

  const getStates = () => {
    apiRequest({
      url: `master/states`,
      method: "GET",
    })
      .then((res) => {
        const getStatesList = res?.data?.map((state) => ({
          name: state?.name,
          value: state?.id,
        }));
        setStatesList(getStatesList);
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getDistrictList = (stateId) => {
    const payload = {
      state_id: stateId,
      limit: 100,
    };
    apiRequest({
      url: `master/districts`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getDistrictList = res?.data?.map((district) => ({
          name: district?.name,
          value: district?.id,
        }));
        setDistrictList(getDistrictList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getMandalList = (districtId) => {
    console.log(districtId, "hi");
    const payload = {
      district_id: districtId,
      limit: 1000,
    };
    apiRequest({
      url: `master/mandals`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getMandalList = res?.data?.map((mandal) => ({
          name: mandal?.name,
          value: mandal?.id,
        }));
        setMandalList(getMandalList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getVillageList = (mandalId) => {
    const payload = {
      mandal_id: mandalId,
      limit: 1000,
    };
    apiRequest({
      url: `master/villages`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const getVillageList = res?.data?.map((village) => ({
          name: village?.name,
          value: village?.id,
        }));
        setVillageList(getVillageList);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const fetchVillages = async (searchQuery) => {
    
    console.log(searchQuery, "VVVVVVVVVVVVVVVVV")
    
    setLoading(true);
    
    if (!searchQuery && searchQuery.trim() === "") {
      setLoading(false);
      return;
    }

    const url = `master/villages`

    const payload = {
      skip: 0,
      searchText: searchQuery,
      limit: 100,
      ...(filters.state_id && {
        state_id: filters.state_id,
      }),
      ...(filters.district_id && {
        district_id: filters.district_id,
      }),
      ...(filters.mandal_id && {
        mandal_id: filters.mandal_id,
      })
    };

    try {

      const response = await apiRequest({
        url: url,
        method: "POST",
        data: payload,
      });

      console.log(response, "VIllage Response")
      
      if (user?.role?.code === "admin") {
        
        const modifiedMandalList = response?.data?.map((village) => ({
          title: village?.name,
          value: village?.id,
        }));
        
        setLoading(false);

        setVillageSearchQuery({
          data: modifiedMandalList ? modifiedMandalList : [],
        });

      } else {

        const modifiedMandalList = response?.data?.map((village) => ({
          title: village?.Block,
          value: village?.Block,
        }));
        
        setLoading(false);
        
        setVillageSearchQuery({ data: modifiedMandalList });

      }
    } catch (error) {
      console.log(error, "EEEEEEEEEEEEEEE")
    }
    
    setLoading(false);

  };

  // const debouncedOptions = debounce(fetchVillages, 300);

  const fetchHamlets = async (hamletSearchQuery) => {
    setHamletLoading(true);
    if (!hamletSearchQuery && hamletSearchQuery.trim() === "") {
      setHamletLoading(false);
      return;
    }
    const url =
      user?.role?.code === "admin" ? `master/hamlets` : `madmin/master/hamlets`;

    const payload = {
      skip: 0,
      searchText: hamletSearchQuery,
      limit: 100,
      ...(filters.search && {
        searchText: filters.search,
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
      ...(filters.village_id && {
        village_id: filters.village_id,
      }),
    };
    try {
      const response = await apiRequest({
        url: url,
        method: "POST",
        data: payload,
      });
      if (user?.role?.code === "admin") {
        const modifiedVillageList = response?.data?.map((hamlet) => ({
          title: hamlet?.name,
          value: hamlet?.id,
        }));
        setHamletLoading(false);

        setHamletSearchQuery({
          data: modifiedVillageList ? modifiedVillageList : [],
        });
      } else {
        const modifiedVillageList = response?.data?.map((hamlet) => ({
          tile: hamlet?.Block,
          value: hamlet?.Block,
        }));
        setHamletLoading(false);
        setHamletSearchQuery({ data: modifiedVillageList });
      }
    } catch (error) {}
    setHamletLoading(false);
  };

  const hamletDebouncedOptions = debounce(fetchHamlets, 300);

  const onSubmit = (data) => {
    console.log("data", data);
  };

  useEffect(() => {
    getUsersByType(
      roleSingular,
      filters,
      skip,
      selectedValue,
      selectedHamletValue
    );
  }, [roleSingular, filters, skip, selectedValue, selectedHamletValue]);

  const getUsersByType = useCallback(
    (userType, filters, skip, selectedValue, selectedHamletValue) => {

      const url = `user/get-veteran`;

      const payload = {
        ...(filters.search && {
          searchText: filters?.search,
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
        ...(filters.user_type && {
          role: filters.user_type,
        }),
        ...(selectedValue?.value && {
          village_id: Number(selectedValue?.value),
        }),
        limit: limit,
        skip: skip,
        sort_field: "_id",
        sort_order: "desc",
        search_fields: ["name", "mobile", "user_id"],
      };

      console.log(payload, url, currentRole, "LKJKLKJKJKKJL")

      apiRequest({
        url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res.data, "RRR")
          if (res) {
            setUserList(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    []
  );

  const handleEdit = useCallback((data) => {
    console.log(data, "MMMMMMMMMMMMMMMMMMM")
    setCurrentAnitraUserState(data);
    setOpenUserModal({ data: data, open: true });
  }, []);

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return userList?.data?.length ? (
      userList?.data?.map((row, index) => (
        <TableRow
          key={row.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {skip + index + 1}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                // navigate(`/user/${userType}/${row?.id}/details/basic`);
                navigate(`/veterianView`, {state: row});
              }}
            >
              {row.user_id}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.name!="" ? row.name : "NA"}
            </Typography>
            {/* <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.mobile}
            </Typography> */}
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {`${row.mobile}`}
            </Typography>
          </TableCell>

          {currentRole !== "admin" && (
            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={13}
              >
                {row?.isOnBoarded}
              </Typography>
            </TableCell>
          )}
          {currentRole !== "admin" && (
            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.headerColor}
                fontSize={13}
              >
                {row?.tribe_name}
              </Typography>
            </TableCell>
          )}

          {currentRole === "admin" && (
            <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {/* {row.user_type.replace('_'," ")} */}
                {row.role}
              </Typography>
            </TableCell>
          )}

          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.email!="" ? row.email : "NA"}
            </Typography>
          </TableCell>

          <TableCell
            sx={{ cursor: "pointer" }}
          >
          <Box
            padding={"2px 8px"}
            textAlign={"center"}
            borderRadius={"12px"}
            border={"1px solid #B1040E"}
            bgcolor={"#B1040E"}
            onClick={() => {
              console.log("EDIT..........")
              handleEdit(row);
              // setOpenUserModal({ data: row, open: true });
            }}
          >
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={"12px"}
              color={row?.status === "ACCEPTED" ? "#fff" : "#B1040E"}
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
              color={row?.status === "ACCEPTED" ? "#fff" : "#B1040E"}
              bgcolor={"#B1040E"}
            >
              {"Delete"}
            </Typography>
          </Box>
        </TableCell>

        </TableRow>
      ))
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
    );
  };

  const handleMithunFilterChange = (filters) => {
    getUsersByType("Mithun", filters, skip);
  };

  const handleSelectHamlet = (e, value) => {
    console.log(e, value, "QQQQQQQQQQQQQQ");
    if (value) {
      setSelectedHamletValue(value);
    } else if (value === null) {
      setSelectedHamletValue({ data: [] });
    }
  };

  const handleSelectVillage = (e, value) => {
    console.log(e, value, "VVVVVVVVVVVVVVVVV")
    if (value) {
      setSelectedValue(value);
    } else if (value === null) {
      setSelectedValue({ data: [] });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      state_id: "",
      district_id: "",
      mandal_id: "",
      village_id: "",
      hamlet_id: "",
    });
    setSelectedValue({});
    setVillageSearchQuery({ data: [] });
    setSelectedHamletValue({});
    setHamletSearchQuery({ data: [] });
  };

  useEffect(() => {
    let headers = [
      "Id,Name,Mobile,Anitra User Location,Ace Name,Animals,Total Requests,Total Orders",
    ];

    let partnersCSV;
    if (Array.isArray(userAnimalsCSV.data) && userAnimalsCSV.data.length > 0) {
      partnersCSV = userAnimalsCSV.data?.reduce((acc, user, index) => {
        const {
          user_id,
          ace_details,
          request_count,
          animal_count,
          order_count,
        } = user;

        const aceId = user_id ?? "NA";

        const requestedName = user?.name;
        const mobile = user?.mobile;

        const userLocation = `${user?.state_name}-${user?.district_name}-${
          user?.mandal_name
        }-${user?.village_name}-${user?.address.replace(/[\r\n]+/g, " ")}-${
          user?.pincode
        }`;
        const veDetails = ace_details?.name ?? "NA";

        const requestCount =
          request_count?.buy +
          request_count?.sell +
          request_count?.health +
          request_count?.nutrition;

        const animalCount =
          animal_count?.flock_animals +
          animal_count?.flocks +
          animal_count?.individual;

        const orderCount =
          order_count?.buy +
          order_count?.sell +
          order_count?.nutrition +
          order_count?.sell;

        acc.push(
          [
            aceId,
            requestedName,
            mobile,
            userLocation,
            veDetails,
            animalCount,
            requestCount,
            orderCount,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...partnersCSV].join("\n"),
        fileName: "Anitra User List.csv",
        fileType: "text/csv",
      });
    }
  }, [userAnimalsCSV]);

  const exportToCsv = (userType) => {
    apiRequest({
      url: `user/get-veteran`,
      method: "POST",
      data: { skip: 0, limit: 10000000, sort_field: "_id", sort_order: "desc" },
    })
      .then((res) => {
        setUserAnimalsCSV({ data: res?.data, loader: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const acceptAceRequest = () => {
    apiRequest({
      url: `user/deleteveteran/${openAceRequestModal.data.user_id}`,
      method: "DELETE",
    })
      .then((res) => {
        setOpenAceRequestModal({ open: false })
        alert("Success");
        getUsersByType();
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
      <CustomDialog
        open={openUserModal.open}
        width={"500px"}
        onClose={() => setOpenUserModal({ open: false })}
        title={"Edit Veterinarian"}
      >
        <AddEditVeteran
          onCancel={() => setOpenUserModal({ open: false })}
          roleSingular={roleSingular}
          currentState={currentAnitraUserState}
          isEdit={Boolean(currentAnitraUserState?.user_id)}
          getUsersByType={() =>
            getUsersByType(roleSingular, filters, skip, selectedValue)
          }
        />
      </CustomDialog>

      <CustomDialog
        open={openAceRequestModal.open}
        onClose={() => setOpenAceRequestModal({ open: false })}
        width={"450px"}
        title={"Delete Veterinarian"}
      >
        <Box>
          <Typography fontSize={"14px"} fontFamily={"poppins"}>
            Are you sure you want to Delete this Veterinarian ?
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
                handleButtonClick={acceptAceRequest}
              />
            </Box>
          </Box>
        </Box>
      </CustomDialog>

      <Grid
        container
        alignItems={"center"}
        gap={"10px"}
        justifyContent={"space-between"}
      >
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {currentRole === "mithunAdmin" ? "Farmer" : role} List
          </Typography>
          {currentRole !== "mithunAdmin" && (
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={13}
              color={Colors.textColor}
            >
              {`${role} > ${role} List`}
            </Typography>
          )}
        </Grid>
        <Grid item spacing={2}>
          <Box display={"flex"} gap={"10px"}>
            <Box>
              {/* <CustomButton
                title={`Add Veteran`}
                handleButtonClick={() => {setCurrentAnitraUserState({}); setOpenUserModal({ data: null, open: true })}}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={'auto'}
                height={34}
                textFontSize={14}
              /> */}
            </Box>
            <Box>
              {/* <CustomButton
                title={`Export List`}
                handleButtonClick={() => exportToCsv(userType)}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={130}
                height={34}
                textFontSize={14}
              /> */}
            </Box>
            <Box>
              {user?.role?.code === "mithunAdmin" && (
                <CustomButton
                  title={`Add Veterinarians`}
                  handleButtonClick={() => setOpenUserModal({ open: true })}
                  backgroundColor={Colors.headerColor}
                  textColor={Colors.white}
                  width={130}
                  height={34}
                  textFontSize={14}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          {currentRole === "admin" && (
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Grid container gap={2}>
                <Grid item md={3}>
                  <CustomInput
                    placeholder={`Search ${roleSingular} name or Mobile or ID`}
                    padding={"12px 12px 12px 0px"}
                    value={filters.search}
                    onChange={(e) => handleSearchTextChange(e)}
                    leftIcon={
                      <SearchOutlinedIcon style={{ color: Colors.greyColor }} />
                    }
                  />
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <Controller
                      name="selectState"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={statesList}
                          {...field}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select State"}
                          onChange={selectState}
                          value={filters.state_id}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <Controller
                      name="district"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={districtList}
                          {...field}
                          defaultOption={"Select State to get Districts"}
                          labelText={""}
                          type={"text"}
                          placeholder={"Select District"}
                          value={filters.district_id}
                          error={!!error}
                          onChange={selectDistrict}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <Controller
                      name="mandal"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={mandalList}
                          {...field}
                          // defaultOption={"Select User Type"}
                          labelText={""}
                          onChange={selectMandals}
                          value={filters.mandal_id}
                          type={"text"}
                          placeholder={"Select Mandal"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <Controller
                      name="userType"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={users}
                          {...field}
                          // defaultOption={"Select User Type"}
                          labelText={""}
                          onChange={selectMandal}
                          value={filters.user_type}
                          type={"text"}
                          placeholder={"Select Veterinarian's Role"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <CustomAutoComplete
                      options={
                        villageSearchQuery.data ? villageSearchQuery.data : []
                      }
                      borderColor={"black"}
                      value={selectedValue ? selectedValue : {}}
                      borderRadius={"5px"}
                      handleChange={handleSelectVillage}
                      placeholder={"Search & Select Village"}
                      open={openVillageList}
                      onInputChange={(event, value) => {
                        // debouncedOptions(value);
                        fetchVillages(value);
                      }}
                      onOpen={() => {
                        setOpenVillageList(true);
                      }}
                      onClose={() => {
                        setOpenVillageList(false);
                      }}
                      loading={loading}
                    />
                  </Box>
                </Grid>

                <Grid item md={3}>
                  <Box>
                    <CustomAutoComplete
                      options={
                        hamletSearchQuery.data ? hamletSearchQuery.data : []
                      }
                      borderColor={"black"}
                      value={selectedHamletValue ? selectedHamletValue : {}}
                      borderRadius={"5px"}
                      handleChange={handleSelectHamlet}
                      placeholder={"Search & Select Hamlet"}
                      open={openHamletList}
                      onInputChange={(event, hamletValue) => {
                        hamletDebouncedOptions(hamletValue);
                      }}
                      onOpen={() => {
                        setOpenHamletList(true);
                      }}
                      onClose={() => {
                        setOpenHamletList(false);
                      }}
                      loading={hamletLoading}
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
            </form>
          )}

          {currentRole === "mithunAdmin" && 
            (
              <MithunFarmerFilter onFilterChange={handleMithunFilterChange} />
            )
          }

          <Box mt={2}>
            <CustomTable
              headerData={
                currentRole === "admin" ? dashboardHeader : mithunAnitraUserHeaders
              }
              tableData={[]}
            >
              <TableDataUi setOpenUserModal={setOpenUserModal} />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {userList?.totalCount > 1 && (
                <Pagination
                  totalCount={Number(userList?.totalCount)}
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

export default Veteran;