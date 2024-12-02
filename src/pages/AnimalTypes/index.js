import React, { useEffect, useState } from "react";
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
import AddEditAnimalType from "./add-edit-type";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import { useAppContext } from "../../context/AppContext";
import { downloadFile } from "../../utilities/exportToCsv";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Animal Type",
  },
  // {
  //   id: 3,
  //   title: "Animal Category",
  // },
  {
    id: 3,
    title: "Active",
  },
  {
    id: 4,
    title: "Actions",
  },
];

const AnimalTypes = () => {
  const [openTypeModal, setOpenTypeModal] = useState(false);

  const [animalTypes, setAnimalTypes] = useState([]);
  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [currentTypeDetails, setCurrentTypeDetails] = useState({});

  const [confirmDelete, setConfirmDelete] = useState({
    delete: false,
    data: {},
  });

  const [updateAnimalTypeStatus, setUpdateAnimalTypeStatus] = useState({
    open: false,
    data: {},
  });

  const [deleteType, setDeleteType] = useState({
    data: {},
    open: false,
  });

  const [animalTypesCSV, setAnimalTypesCSV] = useState({
    data: [],
  });

  const { user } = useAppContext();

  useEffect(() => {
    getTypes({ skip, searchText: "" });
  }, [skip]);

  const getTypes = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        searchText: searchText,
      }),
    };
    const url =
      user?.role?.code === "admin" ? `master/types` : `madmin/master/types`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animalType) => ({
          id: animalType?.id,
          name: animalType?.name,
          displayName: animalType?.display_name,
          categoryName: animalType?.category_name,
          categoryId: animalType?.category_id,
          active: animalType?.active,
          actions: <ActionButtons />,
        }));
        setAnimalTypes({
          totalCount: res?.total_count,
          data:
            user?.role?.code === "admin"
              ? modifiedData
              : res.data.map((aType, index) => ({
                  id: index + 1,
                  displayName: aType.display_name,
                  name: aType.Tribe,
                })),
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handlePageChange = (page) => {
    const newSkip = (page - 1) * limit;
    setSkip(newSkip);
  };

  const handleDeleteAnimalBreed = (row) => {
    apiRequest({
      url: `master/delete-type/${confirmDelete.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        alert("Success");
        getTypes({ skip, searchText: "" });
        setConfirmDelete({ delete: false });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const ActionButtons = (row) => {
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
              setDeleteType({
                open: true,
                data: row,
              })
            }
          />
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"Edit"}
            handleButtonClick={() => {
              setCurrentTypeDetails(row);
              setOpenTypeModal(true);
            }}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
            width={52}
            height={22}
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return animalTypes?.data?.map((row) => (
      <>
        <CustomDialog
          width={"500px"}
          title={"Delete Animal Bread?"}
          open={confirmDelete.delete}
          onClose={() => setConfirmDelete({ delete: false })}
        >
          Are You Sure you want to Delete?
          <Box display={"flex"} justifyContent={"end"} gap={"10px"} mt={"20px"}>
            <Box width={"20%"}>
              <CustomButton
                handleButtonClick={() => setConfirmDelete({ delete: false })}
                border={"1px solid #000000"}
                color={"#000000"}
                title={"No"}
                bgColor={"#F7F7F7"}
                borderRadius={"5px"}
              />
            </Box>
            <Box width={"20%"}>
              <CustomButton
                handleButtonClick={() => handleDeleteAnimalBreed(row)}
                type={"submit"}
                title={"Yes"}
                borderRadius={"5px"}
              />
            </Box>
          </Box>
        </CustomDialog>
        <TableRow
          key={row?.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row?.id}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.displayName}
            </Typography>
          </TableCell>
          {/* <TableCell>
            <Typography
              fontFamily={"Poppins-Regular"}
              color={Colors.textColor}
              fontSize={12}
            >
              {row.categoryName}
            </Typography>
          </TableCell> */}
          <TableCell>
            <Switch
              {...label}
              defaultChecked
              color={"error"}
              onChange={(e) => {
                if (e?.target) {
                  setUpdateAnimalTypeStatus({
                    ...updateAnimalTypeStatus,
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
          <TableCell>{ActionButtons(row)}</TableCell>
        </TableRow>
      </>
    ));
  };

  const onClickModalClose = (isTypeFetchRequired) => {
    setOpenTypeModal(false);
    setCurrentTypeDetails({});
    if (isTypeFetchRequired) {
      getTypes({});
    }
  };

  const handleAddButtonClick = () => {
    setCurrentTypeDetails({});
    setOpenTypeModal(true);
  };

  const searchText = (e) => {
    const searchText = e.target.value;
    getTypes({ searchText });
  };

  const updateBreed = () => {
    apiRequest({
      url: `master/toggle-factor/${updateAnimalTypeStatus?.data?.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateAnimalTypeStatus({
          open: false,
          data: {},
        });
        getTypes({ skip, searchString: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteType = () => {
    apiRequest({
      url: `delete/${updateAnimalTypeStatus?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteType({
          open: false,
          data: {},
        });
        getTypes({ searchString: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,Animal Type,Status"];

    let animalTypes;
    if (Array.isArray(animalTypesCSV.data) && animalTypesCSV.data.length > 0) {
      animalTypes = animalTypesCSV.data?.reduce((acc, animal, index) => {
        const { active, display_name, id } = animal;

        acc.push([id, display_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...animalTypes].join("\n"),
        fileName: "Animal Types.csv",
        fileType: "text/csv",
      });
    }
  }, [animalTypesCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
      user?.role?.code === "admin" ? `master/types` : `madmin/master/types`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setAnimalTypesCSV({
          data: res?.data,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      {updateAnimalTypeStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateAnimalTypeStatus.open}
          onClose={() => {
            setUpdateAnimalTypeStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateAnimalTypeStatus.data.active == true
              ? "In-Active"
              : "Active"}{" "}
            Category
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
                title={`Cancel`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={() =>
                  setUpdateAnimalTypeStatus({ open: false })
                }
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Save`}
                handleButtonClick={() =>
                  updateBreed(updateAnimalTypeStatus.open)
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

      {deleteType.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteType.open}
          onClose={() => {
            setDeleteType({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteType.data?.animalCategory}{" "}
            Animal Type
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
                handleButtonClick={() => setDeleteType({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteType(deleteType.open)}
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
            Animal Types
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Masters > Animal Types`}
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Type"}
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
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item md={3}>
              <CustomInput
                padding={"12px 12px 12px 0px"}
                onChange={(e) => searchText(e)}
                placeholder={"Search"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={[]}>
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {animalTypes?.totalCount > 10 && (
                <Pagination
                  totalCount={Number(animalTypes?.totalCount)}
                  skip={skip}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              )}
            </Box>
          </Box>
        </Card>
      </Box>
      <CustomDialog
        open={openTypeModal}
        width={"450px"}
        onClose={onClickModalClose}
        title={currentTypeDetails?.id ? "Edit Type" : "Add Type"}
      >
        <AddEditAnimalType
          currentTypeDetails={currentTypeDetails}
          onClickModalClose={() => setOpenTypeModal(false)}
          isEdit={Boolean(currentTypeDetails?.id)}
          getTypes={() => getTypes({ skip, searchText: "" })}
        />
      </CustomDialog>
    </Box>
  );
};

export default AnimalTypes;
