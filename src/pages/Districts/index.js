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
import AddDistrict from "./Add-District";
import { apiRequest } from "../../services/api-request";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import CustomDialog from "../../components/ConfirmationModal";
import { downloadFile } from "../../utilities/exportToCsv";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "District",
  },
  {
    id: 3,
    title: "State",
  },
  {
    id: 4,
    title: "Active",
  },
  {
    id: 5,
    title: "Actions",
  },
];

const Districts = () => {
  const [districtList, setUserDistricts] = useState({
    data: [],
    totalCount: "",
    loader: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    state: "",
    district: "",
  });

  const { user } = useAppContext();

  const [openEditDistrictModal, setOpenEditDistrictModal] = useState({
    open: false,
    data: [],
  });

  const limit = 10;

  const [skip, setSkip] = useState(0);

  const [deleteDistrict, setDeleteDistrict] = useState({
    data: {},
    open: false,
  });

  const [updateDistrictStatus, setUpdateDistrictStatus] = useState({
    open: false,
    data: {},
  });

  const [statesList, setStatesList] = useState([]);

  const [districtsCSV, setDistrictsCSV] = useState({
    data: [],
  });

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (filters.state) {
      getUserDistricts();
    }
  }, [filters.state]);
  useEffect(() => {
    if (filters.district) {
      getUserDistricts();
    }
  }, [filters.district]);
  useEffect(() => {
    if (filters.search) {
      getUserDistricts();
    }
  }, [filters.search]);

  useEffect(() => {
    getUserDistricts();
  }, [skip]);

  const getUserDistricts = () => {
    setUserDistricts({ loader: true });
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
    };
    const url =
      user?.role?.code === "admin"
        ? `master/districts`
        : `madmin/master/districts`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          setUserDistricts({
            totalCount: res?.total_count,
            data: res?.data?.map((district, index) => ({
              name: district?.display_name,
              value: district?.id,
              stateValue: district?.state_id,
              state_name: district?.state_name,
              loader: false,
              active: district.active,
            })),
          });
        } else {
          setUserDistricts({
            totalCount: res?.total_count,
            data: res?.data?.map((district, index) => ({
              id: index + 1,
              name: district?.District,
              state_name: district?.State,
              loader: false,
            })),
          });
        }
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const ActionButtons = (props) => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"Delete"}
            width={52}
            height={22}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            handleButtonClick={() =>
              setDeleteDistrict({
                open: true,
                data: props.row,
              })
            }
          />
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"Edit"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            width={52}
            height={22}
            fontSize={"12px"}
            handleButtonClick={() => {
              setOpenEditDistrictModal({
                open: true,
                data: props.row,
                mode: "edit",
              });
            }}
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return districtList?.data?.map((row, index) => {
      const adjustedIndex = index + skip + 1;
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
              {adjustedIndex}
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
              {row.state_name}
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
                  setUpdateDistrictStatus({
                    ...updateDistrictStatus,
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
          {/* <TableCell>
          {row.actions}
        </TableCell> */}
          <TableCell>
            <ActionButtons row={row} />
          </TableCell>
        </TableRow>
      );
    });
  };

  const onClickModalClose = () => {
    setOpenEditDistrictModal({ open: false });
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

  const handleSearchTextChange = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: selectedValue,
    }));
  };
  const selectState = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      state: selectedValue,
    }));
  };

  const selectDistrict = (e) => {
    const selectedValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      district: selectedValue,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      state: "",
      district: "",
    });
  };

  const updateDistrict = () => {
    apiRequest({
      url: `master/toggle-district/${updateDistrictStatus?.data.value}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateDistrictStatus({
          open: false,
          data: {},
        });
        getUserDistricts({ skip, searchText: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteDistrict = () => {
    apiRequest({
      url: `master/delete-district/${updateDistrictStatus?.data?.value}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteDistrict({
          open: false,
          data: {},
        });
        getUserDistricts({ searchString: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,District,State Name,Status"];

    let districts;
    if (Array.isArray(districtsCSV.data) && districtsCSV.data.length > 0) {
      districts = districtsCSV.data?.reduce((acc, district, index) => {
        const { active, display_name, id, state_name } = district;

        acc.push([id, display_name, state_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...districts].join("\n"),
        fileName: "Districts List.csv",
        fileType: "text/csv",
      });
    }
  }, [districtsCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
    user?.role?.code === "admin"
      ? `master/districts`
      : `madmin/master/districts`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setDistrictsCSV({
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
        open={openEditDistrictModal.open}
        onClose={onClickModalClose}
        title={
          openEditDistrictModal?.mode === "add"
            ? "Add District"
            : "Edit District"
        }
      >
        <AddDistrict
          onClose={onClickModalClose}
          getUserDistricts={() => getUserDistricts()}
          isEdit={openEditDistrictModal?.mode === "edit"}
          currentDistrict={openEditDistrictModal}
        />
      </CustomDialog>

      {updateDistrictStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateDistrictStatus.open}
          onClose={() => {
            setUpdateDistrictStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateDistrictStatus.data.active == true ? "In-Active" : "Active"}{" "}
            District
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
                  setUpdateDistrictStatus({ open: false })
                }
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  updateDistrict(updateDistrictStatus.open)
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

      {deleteDistrict.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteDistrict.open}
          onClose={() => {
            setDeleteDistrict({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete{" "}
            {deleteDistrict.data?.animalCategory} District
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
                handleButtonClick={() => setDeleteDistrict({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  handleDeleteDistrict(deleteDistrict.open)
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
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Districts
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters Districts
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add District"}
            handleButtonClick={() => {
              setOpenEditDistrictModal({ open: true, mode: "add" });
            }}
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
          <Box display={"flex"} gap={"20px"} justifyContent={"space-between"}>
            <Box display={"flex"} gap={"20px"}>
              <Box width={"250px"}>
                <CustomInput
                  placeholder={"Search"}
                  padding={"12px 12px 12px 0px"}
                  value={filters.search}
                  onChange={(e) => handleSearchTextChange(e)}
                  leftIcon={
                    <SearchOutlinedIcon style={{ color: Colors.greyColor }} />
                  }
                />
              </Box>
              <Box width={"180px"}>
                <CustomSelectPicker
                  placeholder={"Select state"}
                  options={statesList}
                  onChange={selectState}
                  value={filters.state}
                />
              </Box>
              <Box width={"180px"}>
                <CustomSelectPicker
                  value={filters.district}
                  placeholder={"Select District"}
                  options={districtList?.data}
                  onChange={selectDistrict}
                />
              </Box>
            </Box>
            <Box>
              <CustomButton
                handleButtonClick={clearFilters}
                backgroundColor={"#B1040E"}
                textColor={"#fff"}
                title={"Clear"}
                padding={"5px 15px"}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={[]}>
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {districtList.totalCount > 10 && (
                <Pagination
                  totalCount={districtList.totalCount}
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

export default Districts;
