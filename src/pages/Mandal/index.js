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
import AddMandal from "./add-edit-mandal";
import { apiRequest } from "../../services/api-request";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Pagination";
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
    title: "Mandal",
  },
  {
    id: 3,
    title: "District",
  },
  {
    id: 4,
    title: "State",
  },
  {
    id: 5,
    title: "Active",
  },
  {
    id: 6,
    title: "Actions",
  },
];

const Mandal = () => {
  const [mandalList, setMandalList] = useState({
    data: [],
    totalCount: "",
  });

  const limit = 10;

  const [skip, setSkip] = useState(0);

  const { user } = useAppContext();

  const [openMandalDialog, setOpenMandalDialog] = useState({
    open: false,
    data: {},
    type: "",
  });

  const [statesList, setStatesList] = useState({
    data: [],
  });

  const [districtList, setUserDistricts] = useState({
    data: [],
    totalCount: "",
    loader: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    state: "",
    district: "",
    mandal: "",
  });

  const [updateMandalStatus, setUpdateMandalStatus] = useState({
    open: false,
    data: {},
  });

  const [deleteMandal, setDeleteMandal] = useState({
    data: {},
    open: false,
  });





  const [mandalListCSV, setMandalListCSV] = useState({
    data: [],
  });

  useEffect(() => {
    getUserMandals();
  }, [skip, filters]);

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    if (filters.state) {
      getUserDistricts();
    } else {
    }
  }, [filters.state]);

  // useEffect(() => {
  //   if (filters.district) {
  //     getUserMandals();
  //   }
  // }, [filters.district]);

  const getUserMandals = () => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(filters.search && {
        searchText: filters.search,
      }),
      ...(filters.district && {
        district_id: filters.district,
      }),
      ...(filters.mandal && {
        mandal_id: filters.mandal,
      }),
      ...(filters.state && {
        state_id: filters.state,
      }),
    };

    const url =
      user?.role?.code === "admin" ? `master/mandals` : `madmin/master/mandals`;

    apiRequest({
      url: url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setMandalList({
          totalCount: res.total_count ?? res.current_count,
          data:
            user?.role?.code === "admin"
              ? res.data?.map((mandal, index) => ({
                  name: mandal?.name,
                  value: mandal?.id,
                  district_name: mandal?.district_name,
                  districtID: mandal?.district_id,
                  active: mandal?.active,
                }))
              : res?.data?.map((block, index) => ({
                  id: index + 1,
                  name: block.Block,
                  district_name: block.District,
                  state_id: block.State,
                })),
        });
      })
      .catch((err) => {
        // if (user?.role?.code === "mithunAdmin") {
        //   setUserMandal({ data: mithunMandals });
        // }
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
          const statesList = res?.data?.map((state) => ({
            name: state?.name,
            value: state?.id,
          }));
          setStatesList({ data: statesList });
        } else {
          const statesList = res?.data?.map((state) => ({
            name: state?.State,
            value: state?._id,
          }));
          setStatesList({ data: statesList });
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getUserDistricts = () => {
    setUserDistricts({ loader: true });
    const payload = {
      limit: 100,
      ...(filters.state && {
        state_id: filters.state,
      }),
    };
    const url =
      user?.role?.code === "admin"
        ? `master/districts`
        : `madmin/master/districts`;

    apiRequest({
      url: url,
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
        <Grid item>
          <CustomButton
            title={"Delete"}
            width={52}
            height={22}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            handleButtonClick={() =>
              setDeleteMandal({
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
            handleButtonClick={() => {
              setOpenMandalDialog({
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
    return mandalList.data?.map((row, index) => {
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
              {row.district_name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.state_id}
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
                  setUpdateMandalStatus({
                    ...updateMandalStatus,
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
            {row.actions}
            <ActionButtons row={row} />
          </TableCell>
        </TableRow>
      );
    });
  };

  const handleMandalDialogClose = () => {
    setOpenMandalDialog(false);
  };

  const handleAddButtonClick = () => {
    setOpenMandalDialog({
      open: true,
      data: {},
      type: "add",
    });
  };

  const handleSearchTextChange = (e) => {
    const searchString = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: searchString,
    }));
  };

  const handleSelectState = (e) => {
    const selectedState = e.target.value;
    setFilters((prev) => ({
      ...prev,
      state: selectedState,
    }));
  };

  const handleSelectDistrict = (e) => {
    setFilters((prev) => ({
      ...prev,
      district: e.target.value,
    }));
  };
  const handleMandalSelect = (e, value) => {
    setFilters((prev) => ({
      ...prev,
      mandal: e.target.value,
    }));
    if (value) {
      
    } else {
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      state: "",
      mandal: "",
      district: "",
    });
  

  };

  const updateMandal = () => {
    apiRequest({
      url: `master/toggle-mandal/${updateMandalStatus?.data.value}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateMandalStatus({
          open: false,
          data: {},
        });
        getUserMandals({ skip, searchText: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteMandal = () => {
    apiRequest({
      url: `master/delete-mandal/${updateMandalStatus?.data?.value}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteMandal({
          open: false,
          data: {},
        });
        getUserMandals({ searchString: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,Mandal Name,District Name,State Name,Status"];

    let mandals;
    if (Array.isArray(mandalListCSV.data) && mandalListCSV.data.length > 0) {
      mandals = mandalListCSV.data?.reduce((acc, mandal, index) => {
        const { active, display_name, id, state_name, district_name } = mandal;

        acc.push(
          [id, display_name, district_name, state_name, active].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...mandals].join("\n"),
        fileName: "Mandal List.csv",
        fileType: "text/csv",
      });
    }
  }, [mandalListCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
      user?.role?.code === "admin" ? `master/mandals` : `madmin/master/mandals`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setMandalListCSV({
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
        width={"450px"}
        open={openMandalDialog.open}
        onClose={handleMandalDialogClose}
        title={openMandalDialog?.type === "add" ? "Add Mandal" : "Edit Mandal"}
      >
        <AddMandal
          onClose={handleMandalDialogClose}
          getUserMandals={() => getUserMandals()}
          currentMandal={openMandalDialog.data}
          isEdit={openMandalDialog?.type === "add" ? false : true}
        />
      </CustomDialog>

      {updateMandalStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateMandalStatus.open}
          onClose={() => {
            setUpdateMandalStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateMandalStatus.data.active == true ? "In-Active" : "Active"}{" "}
            Mandal
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
                handleButtonClick={() => setUpdateMandalStatus({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => updateMandal(updateMandalStatus.open)}
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

      {deleteMandal.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteMandal.open}
          onClose={() => {
            setDeleteMandal({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteMandal.data?.animalCategory}{" "}
            Mandal
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
                handleButtonClick={() => setDeleteMandal({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteMandal(deleteMandal.open)}
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
            Mandals
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters Mandals
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Mandal"}
            handleButtonClick={handleAddButtonClick}
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
            <Grid item xs={3}>
              <CustomInput
                placeholder={"Search"}
                padding={"12px 12px 12px 0px"}
                onChange={(e) => handleSearchTextChange(e)}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelectPicker
                placeholder={"Select state"}
                value={filters.state}
                width={200}
                options={statesList.data}
                onChange={handleSelectState}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelectPicker
                placeholder={"Select District"}
                value={filters.district}
                width={200}
                options={districtList.data}
                onChange={handleSelectDistrict}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelectPicker
                placeholder={"Select Mandal"}
                value={filters.mandal}
                width={200}
                onChange={handleMandalSelect}
                options={mandalList.data}
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
              {mandalList.totalCount > 10 && (
                <Pagination
                  totalCount={mandalList.totalCount}
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

export default Mandal;
