import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import { useNavigate, useParams } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { apiRequest } from "../../services/api-request";
import AddEditUser from "./add-edit-employees";
import { useForm, Controller } from "react-hook-form";
import SelectPicker from "../../components/SelectPicker";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import { useAppContext } from "../../context/AppContext";
import MithunFarmerFilter from "./mithun-farmer-filter";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { debounce } from "lodash";
import { downloadFile } from "../../utilities/exportToCsv";

const dashboardHeader = [
  {
    id: 1,
    title: "S.No",
  },
  {
    id: 1,
    title: "User ID",
  },
  {
    id: 2,
    title: "User Name",
  },
  {
    id: 3,
    title: "User Contact",
  },
  {
    id: 4,
    title: "User Email",
  },
  // {
  //   id: 5,
  //   title: "User Email",
  // },
  {
    id: 6,
    title: "Actions",
  }
];

const users = [
  {
    name: "Super Admin",
    value: "SUPER_ADMIN",
  },
  {
    name: "State Admin",
    value: "STATE_ADMIN",
  },
  {
    name: "District Admin",
    value: "DISTRICT_ADMIN",
  },
  {
    name: "Supervisor",
    value: "SUPERVISOR",
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
    title: "Anitra User Location",
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

const MuzzleUsers = () => {
  const { user = {} } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { userType } = useParams();
  const [openAceRequestModal, setOpenAceRequestModal] = useState({
    data: {},
    open: false,
  });
  const role = "Muzzle Users"
  const roleSingular = "Muzzle Users"

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
    setLoading(true);
    if (!searchQuery && searchQuery.trim() === "") {
      setLoading(false);
      return;
    }
    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    const payload = {
      skip: 0,
      searchText: searchQuery,
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
    };
    try {
      const response = await apiRequest({
        url: url,
        method: "POST",
        data: payload,
      });
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
          tile: village?.Block,
          value: village?.Block,
        }));
        setLoading(false);
        setVillageSearchQuery({ data: modifiedMandalList });
      }
    } catch (error) {}
    setLoading(false);
  };

  const debouncedOptions = debounce(fetchVillages, 300);

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

      const url = `user/get-company-users`;

      const mithunFilters = {
        ...(filters?.state_name && {
          state_name: filters?.state_name && filters?.state_name?.toString(),
        }),
        ...(filters?.district_name && {
          district_name:
            filters?.district_name && filters?.district_name?.toString(),
        }),
        ...(filters?.mandal_name && {
          mandal_name: filters?.mandal_name && filters?.mandal_name?.toString(),
        }),
        ...(filters?.village_name && {
          village_name:
            filters?.village_name && filters?.village_name?.toString(),
        }),
        ...(filters?.hamlet_name && {
          hamlet_name: filters?.hamlet_name && filters?.hamlet_name?.toString(),
        }),
        ...(filters?.searchText && {
          searchText: filters?.searchText,
        }),
      };

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
        ...(selectedValue?.value && {
          village_id: Number(selectedValue?.value),
        }),
        ...(selectedHamletValue?.value && {
          hamlet_id: Number(selectedHamletValue?.value),
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
              // sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {skip + index + 1}
            </Typography>
          </TableCell>

          <TableCell>
            <Typography
              fontFamily={"Poppins-Medium"}
              color={Colors.headerColor}
              fontSize={13}
              // sx={{ textDecoration: "underline", cursor: "pointer" }}
              // onClick={() => {
              //   navigate(`/user/${userType}/${row?.id}/details/basic`);
              // }}
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
          <TableCell>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.email!="" ? row.email : "NA"}
              </Typography>
          </TableCell>

          {/* <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.email!="" ? row.email : "NA"}
            </Typography>
          </TableCell> */}

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
              color={"#fff"}
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
              color={"#fff"}
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

  const onClickModalClose = () => {
    setIsModalOpen(false);
    setCurrentAnitraUserState({});
  };

  const handleMithunFilterChange = (filters) => {
    getUsersByType("Mithun", filters, skip);
  };

  const handleSelectHamlet = (e, value) => {
    if (value) {
      setSelectedHamletValue(value);
    } else if (value === null) {
      setSelectedHamletValue({ data: [] });
    }
  };
  const handleSelectVillage = (e, value) => {
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
      "Id,Name,Mobile,Email",
    ];

    let partnersCSV;
    if (Array.isArray(userAnimalsCSV.data) && userAnimalsCSV.data.length > 0) {
      partnersCSV = userAnimalsCSV.data?.reduce((acc, user, index) => {
        const {
          user_id,
          // name,
          email,
          // mobile
        } = user;

        const aceId = user_id ?? "NA";

        const requestedName = user?.name;
        const mobile = user?.mobile;

        // const userLocation = `${user?.state_name}-${user?.district_name}-${
        //   user?.mandal_name
        // }-${user?.village_name}-${user?.address.replace(/[\r\n]+/g, " ")}-${
        //   user?.pincode
        // }`;
        // const veDetails = ace_details?.name ?? "NA";

        // const requestCount =
        //   request_count?.buy +
        //   request_count?.sell +
        //   request_count?.health +
        //   request_count?.nutrition;

        // const animalCount =
        //   animal_count?.flock_animals +
        //   animal_count?.flocks +
        //   animal_count?.individual;

        // const orderCount =
        //   order_count?.buy +
        //   order_count?.sell +
        //   order_count?.nutrition +
        //   order_count?.sell;

        acc.push(
          [
            aceId,
            requestedName,
            mobile,
            email,
            // userLocation,
            // veDetails,
            // animalCount,
            // requestCount,
            // orderCount,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...partnersCSV].join("\n"),
        fileName: "Muzzle User List.csv",
        fileType: "text/csv",
      });
    }
  }, [userAnimalsCSV]);

  const exportToCsv = (userType) => {
    let requestUrl = "user/get-company-users";
    apiRequest({
      url: requestUrl,
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
      url: `user/deletecompanyuser/${openAceRequestModal.data.user_id}`,
      method: "DELETE",
    })
      .then((res) => {
        setOpenAceRequestModal({ open: false })
        alert("Success");
        getUsersByType(roleSingular, filters, skip, selectedValue)
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
        title={"Add Users"}
      >
        <AddEditUser
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
        title={"Delete User"}
      >
        <Box>
          <Typography fontSize={"14px"} fontFamily={"poppins"}>
            Are you sure you want to Delete this User ?
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
              <CustomButton
                title={`Add Users`}
                handleButtonClick={() => {setCurrentAnitraUserState({}); setOpenUserModal({ data: null, open: true })}}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={'auto'}
                height={34}
                textFontSize={14}
              />
            </Box>
            <Box>
              <CustomButton
                title={`Export List`}
                handleButtonClick={() => exportToCsv(userType)}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={130}
                height={34}
                textFontSize={14}
              />
            </Box>
            <Box>
              {user?.role?.code === "mithunAdmin" && (
                <CustomButton
                  title={`Add Anitra User`}
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

                {/* <Grid item md={3}>
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
                </Grid> */}

                {/* <Grid item md={3}>
                  <Box>
                    <Controller
                      name="userType"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={users}
                          {...field}
                          labelText={""}
                          onChange={selectMandal}
                          value={filters.user_type}
                          type={"text"}
                          placeholder={"Select User Type"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
                </Grid> */}

                {/* <Grid item md={8.5}>
                  
                </Grid> */}

                {/* <Grid item md={3}>
                 
                </Grid> */}

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

          {currentRole === "mithunAdmin" && (
            <MithunFarmerFilter onFilterChange={handleMithunFilterChange} />
          )}

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

export default MuzzleUsers;