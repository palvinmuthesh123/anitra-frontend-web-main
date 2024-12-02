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
import { debounce } from "lodash";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomSelectPicker from "../../components/SelectPicker";
import AddVillages from "./add-villages";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import CustomAutoComplete from "../../components/AutoComplete/auto-complete";
import { downloadFile } from "../../utilities/exportToCsv";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Village",
  },
  {
    id: 3,
    title: "Mandal",
  },
  {
    id: 4,
    title: "District",
  },
  {
    id: 5,
    title: "State",
  },
  {
    id: 6,
    title: "Active",
  },
  {
    id: 7,
    title: "Actions",
  },
];

const Villages = () => {
  const [villagesList, setVillagesList] = useState({
    data: [],
    totalCount: "",
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  const { user } = useAppContext();

  const [openVillageDialog, setOpenVillageDialog] = useState({
    open: false,
    data: {},
    type: "",
  });

  const [updateVillageStatus, setUpdateVillageStatus] = useState({
    open: false,
    data: {},
  });
  const [deleteVillage, setDeleteVillage] = useState({
    data: {},
    open: false,
  });

  const [statesList, setStatesList] = useState([]);

  const [villageListCSV, setVillageListCSV] = useState({
    data: [],
  });

  const [districtList, setDistrictList] = useState([]);

  const [mandalList, setMandalList] = useState([]);

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
  useEffect(() => {
    if (filters.mandal) {
      getVillagesList();
    }
  }, [filters.mandal]);

  useEffect(() => {
    getVillagesList();
  }, [skip, filters, selectedValue]);

  const getVillagesList = () => {
    const payload = {
      skip: skip,
      limit: limit,
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
    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    apiRequest({
      url: url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setVillagesList({
          totalCount: res.total_count,
          data:
            user?.role?.code === "admin"
              ? res.data
              : res.data.map((village, index) => ({
                  id: index + 1,
                  name: village.Village,
                  display_name: village.Village,
                  district_name: village.District,
                  mandal_name: village?.Block,
                  state_name: village.State,
                  active: village?.active,
                })),
        });
      })
      .catch((err) => {
        if (user?.role?.code === "mithunAdmin") {
          // setVillagesList({ data: mithunVillages });
        }
      });
  };

  const handleAddEditButtonClick = (type, row) => {
    setOpenVillageDialog({
      open: true,
      data: row,
      type: type,
    });
  };

  const ActionButtons = (props) => {
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
              setDeleteVillage({
                open: true,
                data: props.row,
              })
            }
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Edit"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
            width={52}
            height={22}
            handleButtonClick={() =>
              handleAddEditButtonClick("edit", props.row)
            }
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return villagesList?.data?.map((row) => (
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
            {row.state_name ?? row.state}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch
            {...label}
            defaultChecked
            color={"error"}
            checked={row?.active === true ? true : false}
            onChange={(e) => {
              if (e?.target) {
                setUpdateVillageStatus({
                  ...updateVillageStatus,
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
          <ActionButtons row={row} />
        </TableCell>
      </TableRow>
    ));
  };

  const onClickModalClose = () => {
    setOpenVillageDialog({
      open: false,
      data: {},
      type: "",
    });
  };

  const onAddButtonPress = () => {
    setOpenVillageDialog({
      open: true,
      data: {},
      type: "add",
    });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
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
    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    const payload = {
      skip: skip,
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
      ...(filters.village && {
        village_id: filters.village,
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
    if (value) {
      setSelectedValue(value);
    } else {
    }
  };

  const updateVillage = () => {
    apiRequest({
      url: `master/toggle-village/${updateVillageStatus?.data.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateVillageStatus({
          open: false,
          data: {},
        });
        getVillagesList({ skip, searchText: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteVillage = () => {
    apiRequest({
      url: `master/delete-village/${updateVillageStatus?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteVillage({
          open: false,
          data: {},
        });
        getVillagesList({ searchString: "" });
      })
      .catch((err) => {});
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
    let headers = [
      "Id,Village Name,Mandal Name,District Name,State Name,Status",
    ];

    let villages;
    if (Array.isArray(villageListCSV.data) && villageListCSV.data.length > 0) {
      villages = villageListCSV.data?.reduce((acc, vill, index) => {
        const { active, display_name, id, state_name, district_name, mandal_name } = vill;

        acc.push(
          [
            id,
            display_name,
            mandal_name,
            district_name,
            state_name,
            active,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...villages].join("\n"),
        fileName: "Villages List.csv",
        fileType: "text/csv",
      });
    }
  }, [villageListCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
      user?.role?.code === "admin"
        ? `master/villages`
        : `madmin/master/villages`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setVillageListCSV({
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
        open={openVillageDialog.open}
        width={"500px"}
        onClose={onClickModalClose}
        title={
          openVillageDialog?.type === "add" ? "Add Village" : "Edit Village"
        }
      >
        <AddVillages
          onClose={onClickModalClose}
          getVillagesList={() => getVillagesList()}
          currentVillage={openVillageDialog.data}
          isEdit={Boolean(openVillageDialog.data?.id)}
        />
      </CustomDialog>

      {updateVillageStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateVillageStatus.open}
          onClose={() => {
            setUpdateVillageStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateVillageStatus.data.active === true ? "In-Active" : "Active"}{" "}
            Village
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
                handleButtonClick={() =>
                  setUpdateVillageStatus({ open: false })
                }
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  updateVillage(updateVillageStatus.open)
                }
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

      {deleteVillage.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteVillage.open}
          onClose={() => {
            setDeleteVillage({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteVillage.data?.animalCategory}{" "}
            Village
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
                handleButtonClick={() => setDeleteVillage({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  handleDeleteVillage(deleteVillage.open)
                }
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
            Villages
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters Villages
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Village"}
            handleButtonClick={onAddButtonPress}
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
                value={filters.state}
                onChange={handleSelectState}
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
                value={filters.mandal}
                options={mandalList}
                onChange={handleSelectMandal}
                width={"100%"}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomAutoComplete
                options={villageSearchQuery.data ? villageSearchQuery.data : []}
                borderColor={"black"}
                borderRadius={"5px"}
                width={"150px"}
                handleChange={handleSelectVillage}
                placeholder={"Select Village"}
                open={openVillageList}
                value={selectedValue}
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
            <CustomTable headerData={dashboardHeader} tableData={[]}>
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {villagesList.totalCount > 10 && (
                <Pagination
                  totalCount={villagesList.totalCount}
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

export default Villages;
