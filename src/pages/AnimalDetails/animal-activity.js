import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import CustomTable from "../../components/Table";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SelectPicker from "../../components/SelectPicker";
import { apiRequest } from "../../services/api-request";
import CustomInput from "../../components/Input";
import { useAppContext } from "../../context/AppContext";
import moment from "moment";
import "moment-timezone";
import { ANIMAL_ACTIVITY_STATUS } from "../../utilities/constants";
const AnimalActivity = (props) => {
  const { animalId } = props;
  const { user = {} } = useAppContext();
  const currentRole = user?.role?.code || null;

  const tableHeader = [
    {
      id: 1,
      title: "Date & Time",
    },
    {
      id: 2,
      title: "Activity",
    },
    ...(currentRole === "admin"
      ? [
          {
            id: 3,
            title: "Category",
          },
        ]
      : []),
    {
      id: 4,
      title: "Status",
    },
  ];

  const [animalTypes, setAnimalTypes] = useState({
    data: [],
    totalCount: "",
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    getTypes();
  }, []);

  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    if (animalId) {
      getAnimalActivity(animalId, filters);
    }
  }, [animalId, filters]);

  const getAnimalActivity = (animalId, filters) => {
    const payload = {
      animal_id: animalId,
      ...(filters.status && {
        status: filters.status,
      }),
    };
    apiRequest({
      url:
        currentRole === "mithunAdmin"
          ? `madmin/animal/activity`
          : `animal/activity`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((activity) => ({
          dateTime: activity?.created_on,
          createdBy: activity?.created_by,
          activityName: activity?.activity,
          category: activity?.category,
          status: activity?.status,
          documents: "Images[]",
        }));
        setActivityList(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const TableDataUi = () => {
    return activityList?.map((row) => {
      const createdDate = row?.dateTime;
      const utcDate = new Date(createdDate);
      const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");

      const istDateEndsAt = moment(istDateTimeEndsAt, "DD-MMM-YYYY");
      const istEndsTime = istDateEndsAt.format("HH:mm");

      return (
        <>
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={13}
              >
                {istDateEndsAt.format("DD MMM YYYY")}
              </Typography>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={13}
              >
                {istEndsTime}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={12}
              >
                {row.activityName}
              </Typography>
            </TableCell>
            {currentRole === "admin" && (
              <TableCell>
                <Typography
                  fontFamily={"Poppins-Regular"}
                  color={Colors.textColor}
                  fontSize={12}
                >
                  {row.category}
                </Typography>
              </TableCell>
            )}

            <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={13}
              >
                {row.status}
              </Typography>
            </TableCell>
            {/* <TableCell>
              <Typography
                fontFamily={"Poppins-Medium"}
                color={Colors.textColor}
                fontSize={13}>
                {row.documents}
              </Typography>
            </TableCell> */}
          </TableRow>
        </>
      );
    });
  };

  const getTypes = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    const url = `master/types`;

    apiRequest({
      url: url,
      method: "POST",
      data: payload,
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          value: animalType?.id,
          name: animalType?.name,
          displayName: animalType?.display_name,
          categoryName: animalType?.category_name,
          categoryId: animalType?.category_id,
          active: animalType?.active,
        }));
        setAnimalTypes({
          totalCount: res?.total_count,
          data: modifiedData,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleSelectStatus = (e) => {
    const selectString = e.target.value;
    setFilters((prev) => ({
      ...prev,
      status: selectString,
    }));
  };

  const handleClearClick = () => {
    setFilters({
      status:""
    });
  };

  return (
    <Box m={3}>
      <Grid
        container
        justifyContent={"flex-start"}
        width={"100%"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Grid item md={3}>
          <CustomInput
            placeholder={"Search"}
            leftIcon={
              <SearchOutlinedIcon style={{ color: Colors.textColor }} />
            }
          />
        </Grid>
        <Grid item md={3}>
          <SelectPicker
            options={animalTypes.data}
            type={"text"}
            placeholder={"Select Animal Type"}
          />
        </Grid>
        <Grid item md={3}>
          <SelectPicker
            options={ANIMAL_ACTIVITY_STATUS}
            placeholder={"Status"}
            onChange={handleSelectStatus}
            value={filters.status}
          />
        </Grid>
        <Grid item width={"8%"}>
          <Box
            onClick={() => handleClearClick()}
            fontFamily={"Poppins-Regular"}
            fontSize={"13px"}
            bgcolor={"#B1040E"}
            textAlign={"center"}
            borderRadius={"5px"}
            sx={{ cursor: "pointer" }}
            padding={"7px"}
            color={"#fff"}
          >
            Clear
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}>
        <CustomTable headerData={tableHeader} tableData={activityList}>
          <TableDataUi />
        </CustomTable>
      </Box>
    </Box>
  );
};

export default AnimalActivity;
