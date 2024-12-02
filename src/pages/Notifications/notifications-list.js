import React, { useState, useEffect } from "react";
import CustomTable from "../../components/Table";
import { Box, Grid, Typography, TableRow, TableCell } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomButton from "../../components/Button";
import Card from "../../components/Card";
import CustomDialog from "../../components/ConfirmationModal";
import AddEditNotification from "./add-edit-notification";
import { apiRequest } from "../../services/api-request";
import CustomInput from "../../components/Input";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";

const AdminNotificationsList = () => {
  
  const { user } = useAppContext();

  const [openNotificationModal, setOpenNotificationModal] = useState({
    open: false,
    data: [],
  });

  const [pushNotificationList, setPushNotificationList] = useState({
    data: [],
    totalCount: "",
  });

  const [filters, setFilters] = useState({
    searchText: "",
  });

  const limit = 10;

  const [skip, setSkip] = useState(0);

  const dashboardHeader = [
    {
      id: 1,
      title: "S.No",
    },
    {
      id: 2,
      title: "Notification Title",
    },
    {
      id: 3,
      title: "Notification Description",
    },
    {
      id: 4,
      title: "Send To",
    },
  ];

  useEffect(() => {
    notificationList();
  }, [filters, skip]);

  const notificationList = () => {
    const URL =
      user?.role?.code === "admin"
        ? `admin/push-notifs/list`
        : `madmin/push-notifs/list`;
    const payload = {
      skip: skip,
      limit: limit,
      ...(filters.searchText && {
        searchText: filters.searchText,
      }),
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: payload,
    })
      .then((res) => {
        console.log(res, "NNNNNNNNNNNNNNNNN")
        setPushNotificationList({
          data: res?.data,
          totalCount: res?.total_count,
        });
      })
      .catch(() => {});
  };

  const handleSearchText = (e) => {
    const searchText = e.target.value;
    setFilters((prev) => ({
      ...prev,
      searchText: searchText,
    }));
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };
  
  return (
    <>
      <CustomDialog
        open={openNotificationModal.open}
        onClose={() => setOpenNotificationModal({ open: false })}
        width={"600px"}
        title={"Create Notification"}
      >
        <AddEditNotification
          onClose={() => setOpenNotificationModal({ open: false })}
          notificationList={() => notificationList()}
        />
      </CustomDialog>

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
            Push Notifications List
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Notifications > Dashboard`}
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Create Notification"}
            handleButtonClick={() =>
              setOpenNotificationModal({ open: true, type: "add" })
            }
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            textFontSize={14}
            padding={"5px 10px"}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <CustomInput
                type={"text"}
                placeholder={"Search With Name"}
                onChange={handleSearchText}
                value={filters.searchText}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader}>
              {pushNotificationList?.data?.map((notification, index) => {
                let userDetails;
                if (notification && notification?.req) {
                  try {
                    userDetails = JSON.parse(notification?.req);
                  } catch (error) {
                    console.error("Error parsing JSON:", error);
                  }
                } else {
                  console.error("Notification req is undefined or null.");
                }

                return (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Typography
                        fontFamily={"Poppins-Regular"}
                        color={Colors.textColor}
                        fontSize={12}
                      >
                        {skip + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontFamily={"Poppins-Regular"}
                        color={Colors.textColor}
                        fontSize={12}
                      >
                        {notification?.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontFamily={"Poppins-Regular"}
                        color={Colors.textColor}
                        fontSize={12}
                      >
                        {notification?.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontFamily={"Poppins-Regular"}
                        color={Colors.textColor}
                        fontSize={12}
                      >
                        {typeof notification?.user_id === 'string' ? 1 : Array.isArray(notification?.user_id) ? notification?.user_id.length : "NA"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {pushNotificationList.totalCount > 10 && (
                <Pagination
                  totalCount={pushNotificationList.totalCount}
                  skip={skip}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default AdminNotificationsList;
