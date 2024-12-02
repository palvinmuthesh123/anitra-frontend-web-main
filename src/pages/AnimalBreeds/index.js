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
import AddEditBreed from "./add-edit-breed";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import { downloadFile } from "../../utilities/exportToCsv";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "SN.o",
  },
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Breed Name",
  },
  {
    id: 3,
    title: "Animal Category",
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

const AnimalBreeds = () => {
  const [animalBreeds, setAnimalBreeds] = useState({
    data: [],
    totalCount: "",
  });
  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [currentBreedDetailsModal, setCurrentBreedDetailsModal] = useState({
    data: [],
    open: false,
  });

  const [updateAnimalBreed, setUpdateAnimalBreed] = useState({
    open: false,
    data: {},
  });
  const [deleteBreed, setDeleteBreed] = useState({
    data: {},
    open: false,
  });

  const [breedDetailsCSV, setBreedDetailsCSV] = useState({
    data: [],
  });

  useEffect(() => {
    getBreeds({ skip, searchText: "" });
  }, [skip]);

  const getBreeds = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        searchText: searchText,
      }),
    };
    apiRequest({
      url: `master/breeds`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((categories) => ({
          id: categories?.id,
          name: categories?.name,
          breedName: categories?.display_name,
          localName: categories?.local_name,
          categoryId: categories?.category_id,
          categoryName: categories?.category_name,
          active: categories?.active,
          actions: <ActionButtons />,
        }));
        setAnimalBreeds({ data: modifiedData, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
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
              setDeleteBreed({
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
              setCurrentBreedDetailsModal({
                open: true,
                type: "edit",
                data: row,
              });
            }}
            width={52}
            height={22}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return animalBreeds.data?.map((row, index) => (
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
            {skip + index + 1}
          </Typography>
        </TableCell>
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
            {row.breedName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row.categoryName}
          </Typography>
        </TableCell>
        <TableCell>
          <Switch
            {...label}
            defaultChecked
            color={"error"}
            onChange={(e) => {
              if (e?.target) {
                setUpdateAnimalBreed({
                  ...updateAnimalBreed,
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
    ));
  };

  const searchText = (e) => {
    const searchText = e.target.value;
    getBreeds({ searchText });
  };

  const updateBreed = () => {
    apiRequest({
      url: `master/toggle-factor/${updateAnimalBreed?.data?.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateAnimalBreed({
          open: false,
          data: {},
        });
        getBreeds({ searchString: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteBreed = () => {
    apiRequest({
      url: `delete/${updateAnimalBreed?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteBreed({
          open: false,
          data: {},
        });
        getBreeds({ searchString: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,Breed Name,Animal Category,Status"];

    let breeds;
    if (
      Array.isArray(breedDetailsCSV.data) &&
      breedDetailsCSV.data.length > 0
    ) {
      breeds = breedDetailsCSV.data?.reduce((acc, breed, index) => {
        const { active, id, category_name, display_name } = breed;

        acc.push([id, display_name, category_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...breeds].join("\n"),
        fileName: "Breeds List.csv",
        fileType: "text/csv",
      });
    }
  }, [breedDetailsCSV]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 10000000,
    };
    apiRequest({
      url: `master/breeds`,
      method: "POST",
      data: payload,
    })
      .then((res) => {
        setBreedDetailsCSV({ data: res?.data });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      {updateAnimalBreed.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateAnimalBreed.open}
          onClose={() => {
            setUpdateAnimalBreed({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateAnimalBreed.data.active === true ? "In-Active" : "Active"}{" "}
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
                handleButtonClick={() => setUpdateAnimalBreed({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Save`}
                handleButtonClick={() => updateBreed(updateAnimalBreed.open)}
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

      {deleteBreed.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteBreed.open}
          onClose={() => {
            setDeleteBreed({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteBreed.data?.animalCategory}{" "}
            Animal Breed
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
                handleButtonClick={() => setDeleteBreed({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteBreed(deleteBreed.open)}
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
          width={130}
          height={34}
          textFontSize={14}
        />
      </Grid>
      <Box mt={2}>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <Grid item>
            <Typography
              fontFamily={"Poppins-Medium"}
              fontSize={20}
              color={Colors.textColor}
            >
              Animal Breeds
            </Typography>
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={13}
              color={Colors.textColor}
            >
              Masters Animal Breeds
            </Typography>
          </Grid>
          <Grid item sx={{ cursor: "pointer" }}>
            <CustomButton
              title={"+ Add Breed"}
              handleButtonClick={() =>
                setCurrentBreedDetailsModal({
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
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item md={3}>
                <CustomInput
                  onChange={(e) => searchText(e)}
                  placeholder={"Search"}
                  leftIcon={
                    <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                  }
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <CustomTable
                headerData={dashboardHeader}
                tableData={animalBreeds}
              >
                <TableDataUi />
              </CustomTable>
              <Box mt={2} display={"flex"} justifyContent={"right"}>
                {animalBreeds?.totalCount > 10 && (
                  <Pagination
                    totalCount={Number(animalBreeds?.totalCount)}
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
          open={currentBreedDetailsModal.open}
          onClose={() => setCurrentBreedDetailsModal({ open: false })}
          width={"400px"}
          title={
            currentBreedDetailsModal.type === "edit"
              ? "Edit Breed"
              : "Add Breed"
          }
        >
          <AddEditBreed
            currentBreedDetails={currentBreedDetailsModal.data}
            onClickModalClose={() =>
              setCurrentBreedDetailsModal({ open: false })
            }
            isEdit={currentBreedDetailsModal.type === "edit" ? true : false}
            getBreeds={() => getBreeds({ searchText: "" })}
          />
        </CustomDialog>
      </Box>
    </>
  );
};

export default AnimalBreeds;
