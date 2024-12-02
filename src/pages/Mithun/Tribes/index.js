import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import { Colors } from "../../../constants/Colors";
import Card from "../../../components/Card";
import CustomTable from "../../../components/Table";
import CustomButton from "../../../components/Button";
import CustomInput from "../../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomModal from "../../../components/Modal";
import CustomSelectPicker from "../../../components/SelectPicker";
import { apiRequest } from "../../../services/api-request";
import { useAppContext } from "../../../context/AppContext";
import AddEditTribe from "./add-edit-tribe";
import CustomDialog from "../../../components/ConfirmationModal";
import Pagination from "../../../components/Pagination";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Tribe",
  },
  {
    id: 6,
    title: "State",
  },
  {
    id: 7,
    title: "Active",
  },
  {
    id: 8,
    title: "Actions",
  },
];

const MithunTribes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tribesList, setTribesList] = useState({
    data: [],
  });

  const [openTribeModal, setOpenTribeModal] = useState({
    open: false,
    data: [],
  });

  const { user } = useAppContext();

  const limit = 10;
  
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getTribesList({ skip, searchText: "" });
  }, [skip]);

  const getTribesList = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        searchText: searchText,
      }),
    };
    apiRequest({
      url: `madmin/master/tribe/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        console.log(res);
        setTribesList({
          totalCount: res.total_count,
          data:
            user?.role?.code === "admin"
              ? res.data
              : res.data.map((tribe, index) => ({
                  id: index + 1,
                  state: tribe.State,
                  name: tribe.Tribe,
                  tribe_id:tribe?._id
                })),
        });
      })
      .catch((err) => {});
  };

  const ActionButtons = (props) => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        {/* <Grid item>
          <CustomButton
            title={"Delete"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
            width={52}
            height={22}
          />
        </Grid> */}
        <Grid item>
          <CustomButton
            title={"Edit"}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            width={52}
            height={22}
            handleButtonClick={() => {
              setOpenTribeModal({
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
    return tribesList.data?.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}>
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}>
            {row.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}>
            {row.state}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch {...label} defaultChecked color={"error"} />
        </TableCell>
        <TableCell>
          {/* {row.actions} */} <ActionButtons row={row} />
        </TableCell>
      </TableRow>
    ));
  };

  const onClickModalClose = () => {
    setIsModalOpen(false);
  };

  const onAddButtonPress = () => {
    setIsModalOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const handleSearchTextChange = (e) => {
    const searchText = e.target.value;
    getTribesList({ searchText });
  };

  return (
    <Box>
      <CustomDialog
        open={openTribeModal.open}
        width={"500px"}
        onClose={() => setOpenTribeModal({ open: false })}
        title={openTribeModal?.mode === "add" ? "Add Tribe" : "Edit Tribe"}>
        <AddEditTribe
          onClose={() => setOpenTribeModal({ open: false })}
          getTribesList={() => getTribesList({ skip, searchText: "" })}
          isEdit={openTribeModal?.mode === "edit"}
          currentTribe={openTribeModal}
        />
      </CustomDialog>

      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}>
            Tribe
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}>
            Masters {">"} Tribes
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Tribe"}
            handleButtonClick={() =>
              setOpenTribeModal({ open: true, mode: "add" })
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
              <CustomSelectPicker placeholder={"Select state"} />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                placeholder={"Select District"}
                width={"100%"}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                placeholder={"Select Mandal"}
                width={"100%"}
              />
            </Grid>
            <Grid item width={"150px"}>
              <CustomSelectPicker
                placeholder={"Select Village"}
                width={"100%"}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={[]}>
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {tribesList.totalCount > 10 && (
                <Pagination
                  totalCount={tribesList.totalCount}
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

export default MithunTribes;
