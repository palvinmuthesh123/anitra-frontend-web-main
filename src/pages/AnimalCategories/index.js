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
import AddEditCategory from "./add-edit-category";
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
    title: "Animal Category",
  },
  {
    id: 3,
    title: "Active",
  },
  {
    id: 6,
    title: "Actions",
  },
];

const AnimalCategories = () => {
  const [categories, setCategories] = useState([]);

  const [openCategoryModal, setOpenCategoryModal] = useState({
    open: false,
    data: [],
  });

  const [updateCategoryStatus, setUpdateCategoryStatus] = useState({
    open: false,
    data: {},
  });

  const [deleteCategory, setDeleteCategory] = useState({
    data: {},
    open: false,
  });

  const [categoriesCSV, setCategoriesCSV] = useState({
    data: [],
  });

  useEffect(() => {
    getCategories({ searchString: "" });
  }, []);

  const getCategories = ({ searchString }) => {
    apiRequest({
      url: `master/categories${searchString ? `?search=${searchString}` : ""} `,
      method: "GET",
    })
      .then((res) => {
        const modifiedData = res?.data?.map((animal) => ({
          id: animal?.id,
          animalCategory: animal?.display_name,
          active: animal?.active,
          actions: <ActionButtons />,
        }));
        setCategories(modifiedData);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const ActionButtons = ({ row }) => {
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
              setDeleteCategory({
                open: true,
                data: row,
              })
            }
          />
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"Edit"}
            width={52}
            fontSize={"12px"}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            height={22}
            handleButtonClick={() =>
              setOpenCategoryModal({
                open: true,
                data: row,
                type: "edit",
              })
            }
          />
        </Grid>
      </Grid>
    );
  };

  const TableDataUi = () => {
    return categories?.map((row, index) => {
      return (
        <>
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
                {index + 1}
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
                {row.animalCategory}
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
                    setUpdateCategoryStatus({
                      ...updateCategoryStatus,
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
        </>
      );
    });
  };

  const handleSearchAnimalCategories = (e) => {
    const searchString = e.target.value;

    getCategories({ searchString });
  };

  const updateCategory = () => {
    apiRequest({
      url: `master/toggle-category/${updateCategoryStatus?.data?.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateCategoryStatus({
          open: false,
          data: {},
        });
        getCategories({ searchString: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteCategory = () => {
    apiRequest({
      url: `delete/${updateCategoryStatus?.data?.id}`,
      method: "DELETE",
    })
      .then((res) => {
        deleteCategory({
          open: false,
          data: {},
        });
        getCategories({ searchString: "" });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    let headers = ["Id,Animal Category,Status"];

    let categoriesCsv;
    if (Array.isArray(categoriesCSV.data) && categoriesCSV.data.length > 0) {
      categoriesCsv = categoriesCSV.data?.reduce((acc, cat, index) => {
        const { active, display_name, id } = cat;

        acc.push([id, display_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...categoriesCsv].join("\n"),
        fileName: "Animal Categories List.csv",
        fileType: "text/csv",
      });
    }
  }, [categoriesCSV]);

  const exportToCsv = () => {
    apiRequest({
      url: `master/categories`,
      method: "GET",
    })
      .then((res) => {
        setCategoriesCSV({ data: res?.data });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      {updateCategoryStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateCategoryStatus.open}
          onClose={() => {
            setUpdateCategoryStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateCategoryStatus.data.active == true ? "In-Active" : "Active"}{" "}
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
                title={`No`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={() =>
                  setUpdateCategoryStatus({ open: false })
                }
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  updateCategory(updateCategoryStatus.open)
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
      {deleteCategory.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteCategory.open}
          onClose={() => {
            setDeleteCategory({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete{" "}
            {deleteCategory.data?.animalCategory} Category
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
                handleButtonClick={() => setDeleteCategory({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() =>
                  handleDeleteCategory(deleteCategory.open)
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

      <CustomDialog
        open={openCategoryModal.open}
        onClose={() => setOpenCategoryModal({ open: false })}
        width={"400px"}
        title={"Add Category"}
      >
        <AddEditCategory
          getCategories={() => getCategories({ searchString: "" })}
          closeModal={() => setOpenCategoryModal({ open: false })}
          currentCategory={openCategoryModal}
          isEdit={openCategoryModal.type === "add" ? false : true}
        />
      </CustomDialog>
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
            Animal Categories
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            {`Masters > Animal Categories`}
          </Typography>
        </Grid>
        <Grid item sx={{ cursor: "pointer" }}>
          <CustomButton
            title={"+ Add Category"}
            handleButtonClick={() =>
              setOpenCategoryModal({ open: true, type: "add" })
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
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item md={3}>
              <CustomInput
                placeholder={"Search"}
                onChange={(e) => handleSearchAnimalCategories(e)}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} a />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={categories}>
              <TableDataUi />
            </CustomTable>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default AnimalCategories;
