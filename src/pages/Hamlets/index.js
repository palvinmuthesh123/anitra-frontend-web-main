import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


import CustomSelectPicker from "../../components/SelectPicker";
import AddHamlets from "./add-hamlet";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";
import CustomDialog from "../../components/ConfirmationModal";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { debounce } from "lodash";
import Pagination from "../../components/Pagination";
import { downloadFile } from "../../utilities/exportToCsv";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Hamlet",
  },
  {
    id: 2,
    title: "Village",
  },
  // {
  //   id: 3,
  //   title: "Mandal",
  // },
  // {
  //   id: 4,
  //   title: "District",
  // },
  // {
  //   id: 5,
  //   title: "State",
  // },
  {
    id: 6,
    title: "Active",
  },
  {
    id: 7,
    title: "Actions",
  },
];

const Hamlets = () => {
  const [openCurrentModal, setOpenCurrentModal] = useState({
    open: false,
    data: {},
    type: "",
  });

  const [hamletList, setHamletList] = useState({
    data: [],
    count: "",
  });

  const { user } = useAppContext();

  const [deleteHamlet, setDeleteHamlet] = useState({
    data: {},
    open: false,
  });
  const [updateHamletStatus, setUpdateHamletStatus] = useState({
    open: false,
    data: {},
  });

  const [filters, setFilters] = useState({
    search: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

  const [loading, setLoading] = useState(false);

  const [villageSearchQuery, setVillageSearchQuery] = useState({
    data: [],
  });

  const [openVillageList, setOpenVillageList] = useState(false);

  const [selectedValue, setSelectedValue] = useState({});

  const [statesList, setStatesList] = useState([]);

  const [districtList, setDistrictList] = useState([]);

  const [mandalList, setMandalList] = useState([]);

  const [hamletListCSV, setHamletListCSV] = useState({
    data: [],
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getHamletList(filters);
  }, [skip, filters, selectedValue]);

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (filters.state) {
      getDistricts();
    }
  }, [filters.state]);

  useEffect(() => {
    if (filters.district) {
      getMandalsList();
    }
  }, [filters.district]);

  const getHamletList = (filters) => {
    const payload = {
      limit: 10,
      skip: skip,
      ...(filters.search && {
        searchText: filters.search,
      }),
      ...(filters.state && {
        state_id: filters.state,
      }),
      ...(filters.district && {
        district_id: filters.district,
      }),
      ...(filters.mandal && {
        mandal_id: filters.mandal,
      }),
      ...(selectedValue?.value && {
        village_id: selectedValue?.value,
      }),
    };

    apiRequest({
      url: `master/hamlets`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setHamletList({ data: res, count: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getStates = () => {
    const URL =
      user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    apiRequest({
      url: URL,
      method: user?.role?.code === "admin" ? "GET" : "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getStatesList = res?.data?.map((state) => ({
            name: state?.name,
            value: state?.id,
          }));
          setStatesList(getStatesList);
        } else {
          const getStatesList = res?.data?.map((state) => ({
            name: state?.State,
            value: state?._id,
          }));
          setStatesList(getStatesList);
        }
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

    const mithunPayload = {
      state_name: stateName,
      limit: 5000,
    };

    const payload = {
      state_id: filters.state,
      limit: 5000,
    };

    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.name,
            value: district?.id,
          }));
          setDistrictList(getDistricts);
        } else {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.District,
            value: district?._id,
          }));
          setDistrictList(getDistricts);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getMandalsList = (districtName) => {
    const URL =
      user?.role?.code === "admin" ? `master/mandals` : `madmin/master/mandals`;

    const payload = {
      district_id: filters.district,
      limit: 5000,
    };
    const mithunPayload = {
      district_name: districtName,
      limit: 5000,
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const modifiedMandalList = res?.data?.map((mandal) => ({
            name: mandal?.name,
            value: mandal?.id,
          }));
          setMandalList(modifiedMandalList);
        } else {
          const modifiedMandalList = res?.data?.map((mandal) => ({
            name: mandal?.Block,
            value: mandal?.Block,
          }));
          setMandalList(modifiedMandalList);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
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
      ...(filters.state && {
        state_id: filters.state,
      }),
      ...(filters.district && {
        district_id: filters.district,
      }),
      ...(filters.mandal && {
        mandal_id: filters.mandal,
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

  const ActionButtons = (row, props) => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        <Grid item>
          <CustomButton
            title={"Delete"}
            width={52}
            height={22}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            handleButtonClick={() =>
              setDeleteHamlet({
                open: true,
                data: row,
              })
            }
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Edit"}
            backgroundColor={Colors.screenBg}
            textColor={Colors.textColor}
            width={52}
            height={22}
            handleButtonClick={() =>
              setOpenCurrentModal({
                data: row,
                open: true,
                type: "edit",
              })
            }
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return hamletList.data?.data?.map((row) => {
      return (
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
              {row.display_name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.village_name}
            </Typography>
          </TableCell>
          {/* <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.mandal_name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.district_name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.state}
          </Typography>
        </TableCell> */}
          <TableCell>
            <Switch
              {...label}
              defaultChecked
              color={"error"}
              checked={row?.active === true ? true : false}
              onChange={(e) => {
                if (e?.target) {
                  setUpdateHamletStatus({
                    ...updateHamletStatus,
                    open: true,
                    data: {
                      ...row,
                      status: e?.target?.checked ? true : false,
                    },
                    isChecked: e?.target?.checked,
                  });
                }
              }}
            />
          </TableCell>
          <TableCell>
            {/* {row.actions} */} <ActionButtons row={row} />
          </TableCell>
        </TableRow>
      );
    });
  };

  const updateHamlet = () => {
    apiRequest({
      url: `master/toggle-hamlet/${updateHamletStatus?.data.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateHamletStatus({
          open: false,
          data: {},
        });
        getHamletList({ searchText: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteHamlet = () => {
    apiRequest({
      url: `master/delete-tribe/${updateHamletStatus?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteHamlet({
          open: false,
          data: {},
        });
        getHamletList({ searchString: "" });
      })
      .catch((err) => {});
  };

  const handleSearchTextChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleSelectState = (e) => {
    setFilters((prev) => ({
      ...prev,
      state: e.target.value,
    }));
  };
  const handleSelectDistrict = (e) => {
    setFilters((prev) => ({
      ...prev,
      district: e.target.value,
    }));
  };
  const handleSelectMandal = (e) => {
    setFilters((prev) => ({
      ...prev,
      mandal: e.target.value,
    }));
  };

  const handleSelectVillage = (e, value) => {
    console.log(value, "hi");
    if (value) {
      setSelectedValue(value);
    } else if (value === null) {
      setSelectedValue({});
      setVillageSearchQuery({ data: [] });
    }
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      state: "",
      mandal: "",
      district: "",
    });
    setSelectedValue({});
    setVillageSearchQuery({ data: [] });
  };

  useEffect(() => {
    let headers = ["Id,Hamlet Name,Village Name,Status"];

    let hamlets;
    if (Array.isArray(hamletListCSV.data) && hamletListCSV.data.length > 0) {
      hamlets = hamletListCSV.data?.reduce((acc, hamlet, index) => {
        const { active, display_name, id, village_name } = hamlet;

        acc.push([id, display_name, village_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...hamlets].join("\n"),
        fileName: "Hamlets List.csv",
        fileType: "text/csv",
      });
    }
  }, [hamletListCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };

    apiRequest({
      url: `master/hamlets`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setHamletListCSV({
          data: res?.data,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      <CustomDialog
        open={openCurrentModal.open}
        width={"450px"}
        onClose={() => setOpenCurrentModal({ open: false })}
        title={"Add Hamlet"}
      >
        <AddHamlets
          onClose={() => setOpenCurrentModal({ open: false })}
          getHamletList={() => getHamletList(filters)}
          isEdit={openCurrentModal.type === "edit" ? true : false}
          openCurrentModal={openCurrentModal}
        />
      </CustomDialog>

      {updateHamletStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateHamletStatus.open}
          onClose={() => {
            setUpdateHamletStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateHamletStatus.data.active == true ? "In-Active" : "Active"}{" "}
            Hamlet
          </Typography>

          <Grid
            container
            alignItems={"center"}
            justifyContent={"flex-end"}
            mt={"24px"}
            gap={"12px"}
          >
            <Grid item>
              <CustomButton
                variant={"outlined"}
                title={`No`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={() => setUpdateHamletStatus({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => updateHamlet(updateHamletStatus.open)}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                type={"submit"}
              />
            </Grid>
          </Grid>
        </CustomDialog>
      )}

      {deleteHamlet.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteHamlet.open}
          onClose={() => {
            setDeleteHamlet({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteHamlet.data?.animalCategory}{" "}
            Hamlet
          </Typography>

          <Grid
            container
            alignItems={"center"}
            justifyContent={"flex-end"}
            mt={"24px"}
            gap={"12px"}
          >
            <Grid item>
              <CustomButton
                variant={"outlined"}
                title={`No`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={() => setDeleteHamlet({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteHamlet(deleteHamlet.open)}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                type={"submit"}
              />
            </Grid>
          </Grid>
        </CustomDialog>
      )}
      <Grid container justifyContent={"end"}>
        <CustomButton
          title={"Export List"}
          handleButtonClick={() => exportToCsv()}
          backgroundColor={Colors.headerColor}
          textColor={Colors.white}
          textFontSize={14}
          padding={"5px 10px"}
        />
      </Grid>
      <Grid
        container
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={2}
      >
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Hamlets
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters Hamlets
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Hamlet"}
            handleButtonClick={() =>
              setOpenCurrentModal({
                open: true,
                type: "add",
              })
            }
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={130}
            height={34}
            textFontSize={14}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid container alignItems={"center"} gap={2}>
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                padding={"12px 12px 12px 0px"}
                onChange={(e) => handleSearchTextChange(e)}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                placeholder={"Select state"}
                onChange={handleSelectState}
                value={filters.state}
                options={statesList}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                value={filters.district}
                placeholder={"Select District"}
                onChange={handleSelectDistrict}
                options={districtList}
                width={"100%"}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                placeholder={"Select Mandal"}
                options={mandalList}
                onChange={handleSelectMandal}
                value={filters.mandal}
                width={"100%"}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomAutoComplete
                options={villageSearchQuery.data ? villageSearchQuery.data : []}
                borderColor={"black"}
                value={selectedValue}
                borderRadius={"5px"}
                width={"150px"}
                handleChange={handleSelectVillage}
                placeholder={"Search & Select Village"}
                open={openVillageList}
                onInputChange={(event, value) => {
                  debouncedOptions(value);
                }}
                onOpen={() => {
                  setOpenVillageList(true);
                }}
                onClose={() => {
                  setOpenVillageList(false);
                }}
                loading={loading}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomButton
                handleButtonClick={clearFilters}
                backgroundColor={"#B1040E"}
                textColor={"#fff"}
                title={"Clear"}
                padding={"5px 15px"}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={hamletList.data}
            >
              <TableDataUi />
            </CustomTable>
          </Box>
          <Box mt={2} display={"flex"} justifyContent={"right"}>
            {hamletList.count > 10 && (
              <Pagination
                totalCount={hamletList.count}
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

export default Hamlets;
