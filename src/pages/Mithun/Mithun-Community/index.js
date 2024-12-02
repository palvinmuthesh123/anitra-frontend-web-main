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
import CustomDialog from "../../../components/ConfirmationModal";
import AddEditMithunCommunity from "./add-edit-mithun-community";
import Pagination from "../../../components/Pagination";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Mithun Society",
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

const MithunCommunityTribe = () => {
  const { user } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [communityList, setCommunityList] = useState({
    data: [],
    totalCount: 0,
  });

  const [openCommunityModal, setOpenCommunityModal] = useState({
    open: false,
    data: [],
  });

  const limit = 10;
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getCommunityList({ skip, searchText: "" });
  }, [skip]);

  const getCommunityList = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        searchText: searchText,
      }),
    };
    apiRequest({
      url: `madmin/master/community/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setCommunityList({
          totalCount: res.total_count,
          data:
            user?.role?.code === "admin"
              ? res.data
              : res.data.map((tribe, index) => ({
                  id: index + 1,
                  societyName: tribe.SocietyName,
                  state: tribe.State,
                  communityID: tribe?._id,
                })),
        });
      })
      .catch((err) => {
        // setCommunityList({ data: mithunTribes });
      });
  };

  const ActionButtons = (props) => {
    return (
      <Grid container alignItems={"center"} gap={2}>
        {/* <Grid item>
          <CustomButton
            title={"Delete"}
            width={52}
            height={22}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
          />
        </Grid> */}
        <Grid item>
          <CustomButton
            title={"Edit"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
            width={52}
            height={22}
            handleButtonClick={() => {
              setOpenCommunityModal({
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

  const TableDataUi = (props) => {
    return communityList.data?.map((row) => (
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
            {row.societyName}
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
          <ActionButtons row={row} />
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
    getCommunityList({ searchText });
  };

  const CommunityLists = () => {
    getCommunityList({ skip, searchText: "" });
  };

  return (
    <Box>
      {openCommunityModal.open && (
        <CustomDialog
          open={openCommunityModal.open}
          width={"500px"}
          onClose={() => setOpenCommunityModal({ open: false })}
          title={"Add Mithun Society"}>
          <AddEditMithunCommunity
            onClose={() => setOpenCommunityModal({ open: false })}
            allCommunity={CommunityLists}
            isEdit={openCommunityModal?.mode === "edit"}
            currentCommunity={openCommunityModal}
          />
        </CustomDialog>
      )}
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}>
            Mithun Society
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}>
            Masters {">"} Mithun Society
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Mithun Society"}
            handleButtonClick={() =>
              setOpenCommunityModal({ open: true, mode: "add" })
            }
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            textFontSize={14}
            padding={"5px 7px"}
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
              {communityList.totalCount > 10 && (
                <Pagination
                  totalCount={communityList.totalCount}
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

export default MithunCommunityTribe;
