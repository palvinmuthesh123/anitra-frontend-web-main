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
import { apiRequest } from "../../services/api-request";
import AddState from "./add-state";
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
    title: "State",
  },
  {
    id: 3,
    title: "Active",
  },
  {
    id: 4,
    title: "Actions",
  },
];

const States = () => {
  const { user } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateList, setStateList] = useState({
    result: [],
    totalCount: "",
    loader: false,
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [currentStateList, setCurrentStateList] = useState({});

  const [openDeleteModal, setOpenDeleteModal] = useState({
    open: false,
    data: [],
  });

  const [updateStateStatus, setUpdateStateStatus] = useState({
    open: false,
    data: {},
  });

  const [deleteState, setDeleteState] = useState({
    data: {},
    open: false,
  });

  const [statesListCSV, setStatesListCSV] = useState({
    data: [],
  });

  useEffect(() => {
    getStates({ skip, searchText: "" });
  }, [skip]);

  const getStates = ({ skip, searchText }) => {
    setStateList({ loader: true });
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        searchText: searchText,
      }),
    };

    const URL =
      user?.role?.code === "admin"
        ? `master/states${searchText ? `?search=${searchText}` : ""}`
        : `madmin/master/states`;

    apiRequest({
      url: URL,
      method: user?.role?.code === "admin" ? "GET" : "POST",
      data: payload,
    })
      .then((res) => {
        const mithunAdminResponse = res?.data?.map((item) => ({
          display_name: item?.State,
          active: item?.active,
        }));
        setStateList({
          loader: false,
          totalCount: res.total_count ? res.total_count : res.data.length,
          result: user?.role?.code === "admin" ? res.data : mithunAdminResponse,
        });
      })
      .catch((err) => {
        setStateList({ loader: false });
      });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return stateList?.result?.map((row, index) => (
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
            {row.id ? row.id : index + 1}
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
          <Switch
            {...label}
            defaultChecked
            color={"error"}
            checked={row?.active === true ? true : false}
            onChange={(e) => {
              if (e?.target) {
                setUpdateStateStatus({
                  ...updateStateStatus,
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
        {/* <TableCell>{row.actions}</TableCell> */}
        <TableCell>
          <Box display={"flex"} gap={"10px"}>
            <Grid>
              <CustomButton
                title={"Delete"}
                width={52}
                height={22}
                fontSize={"12px"}
                backgroundColor={"#E1E1E1"}
                textColor={"#111A45"}
                handleButtonClick={() =>
                  setDeleteState({
                    open: true,
                    data: row,
                  })
                }
              />
            </Grid>
            <Grid>
              <CustomButton
                title={"Edit"}
                backgroundColor={"#E1E1E1"}
                textColor={"#111A45"}
                width={52}
                height={22}
                fontSize={"12px"}
                handleButtonClick={() => {
                  setIsModalOpen(true);
                  setCurrentStateList({
                    ...row,
                    open: "edit",
                  });
                }}
              />
            </Grid>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  const onClickModalClose = (isStateFetchRequired) => {
    if (isStateFetchRequired) {
      getStates();
    }
    setIsModalOpen(false);
  };

  const handleSearchTextChange = (e) => {
    const searchText = e.target.value;
    getStates({ searchText });
  };

  const handleDeleteState = () => {
    apiRequest({
      url: `master/delete-state/${updateStateStatus?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteState({
          open: false,
          data: {},
        });
        getStates({ searchString: "" });
      })
      .catch((err) => {});
  };

  const updateState = () => {
    apiRequest({
      url: `master/toggle-state/${updateStateStatus?.data?.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateStateStatus({
          open: false,
          data: {},
        });
        getStates({ skip, searchText: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,State Name,Status"];

    let statesCsv;
    if (Array.isArray(statesListCSV.data) && statesListCSV.data.length > 0) {
      statesCsv = statesListCSV.data?.reduce((acc, state, index) => {
        const { active, display_name, id } = state;

        acc.push([id, display_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...statesCsv].join("\n"),
        fileName: "States List.csv",
        fileType: "text/csv",
      });
    }
  }, [statesListCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
      user?.role?.code === "admin"
        ? `master/states`
        : `madmin/master/states`;

    apiRequest({
      url,
      data: payload,
      method: "GET",
    })
      .then((res) => {
        setStatesListCSV({
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
        open={isModalOpen}
        onClose={() => onClickModalClose(false)}
        width={"450px"}
        title={currentStateList?.open === "edit" ? "Edit State" : "Add State"}
      >
        <AddState
          currentStateList={currentStateList}
          onClickModalClose={() => onClickModalClose(false)}
          isEdit={currentStateList?.display_name}
          loader={stateList?.loader}
          getStates={() => getStates({ skip, searchText: "" })}
        />
      </CustomDialog>

      <CustomDialog
        open={openDeleteModal.open}
        onClose={() => setOpenDeleteModal({ open: false })}
        width={"450px"}
        title={"Delete State"}
      >
        <Box>
          <Typography fontSize={"14px"} fontFamily={"poppins"}>
            Are you sure you want to Delete this state?
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
                handleButtonClick={() => setOpenDeleteModal({ open: false })}
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
                handleButtonClick={handleDeleteState}
              />
            </Box>
          </Box>
        </Box>
      </CustomDialog>

      {updateStateStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateStateStatus.open}
          onClose={() => {
            setUpdateStateStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateStateStatus.data.active == true ? "In-Active" : "Active"}{" "}
            State
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
                handleButtonClick={() => setUpdateStateStatus({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => updateState(updateStateStatus.open)}
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

      {deleteState.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteState.open}
          onClose={() => {
            setDeleteState({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteState.data?.animalCategory}{" "}
            State
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
                handleButtonClick={() => setDeleteState({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteState(deleteState.open)}
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
            States
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters States
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add state"}
            handleButtonClick={() => {
              setIsModalOpen(true);
              setCurrentStateList({ open: "add" });
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
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                onChange={(e) => handleSearchTextChange(e)}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={stateList.result}
            >
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {stateList.totalCount > 10 && (
                <Pagination
                  totalCount={stateList.totalCount}
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

export default States;
