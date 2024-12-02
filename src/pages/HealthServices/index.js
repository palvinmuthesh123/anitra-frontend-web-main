import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Switch,
  TableCell,
  TableRow,
  Input,
  Button,
  IconButton
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomModal from "../../components/Modal";
import { apiRequest } from "../../services/api-request";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import CustomDialog from "../../components/ConfirmationModal";
import { downloadFile } from "../../utilities/exportToCsv";
import { useNavigate, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import AWS from "aws-sdk";

const label = { inputProps: { "aria-label": "switch" } };
const dashboardHeader = [
  {
    id: 1,
    title: "ID",
  },
  {
    id: 2,
    title: "Image",
  },
  {
    id: 3,
    title: "Health Service Name",
  },
  // {
  //   id: 3,
  //   title: "Description",
  // },
  {
    id: 4,
    title: "Active",
  },
  {
    id: 5,
    title: "Actions",
  },
];

const HealthServices = (props) => {
  const { user = {} } = useAppContext();
  const [data, setData] = useState([])
  const navigate = useNavigate();
  const [healthServiceList, setHealthServiceList] = useState({
    data: [],
    totalCount: "",
  });
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const [currentHsDetails, setCurrentHsDetails] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add this line
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [hsCsv, seThsCsv] = useState({
    data: [],
  });

  const [updateHsStatus, setUpdateHsStatus] = useState({
    open: false,
    data: {},
  });

  const [deleteHs, setDeleteHs] = useState({
    data: {},
    open: false,
  });

  useEffect(() => {
    getHealthServices({ skip, searchText: "" });
  }, [skip]);

  const getHealthServices = ({ skip, searchText }) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        name: searchText,
      }),
    };
    const url =
      user?.role?.code === "admin" ? `master/hs/list` : `madmin/master/hs/list`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setData(res?.data);
        console.log(res?.data, "RRRRRRRRRRRRRRRRRR")
        const modifiedData = res?.data?.map((healthServiceList) => ({
          id: healthServiceList?.id,
          title: healthServiceList?.name,
          price: healthServiceList?.price,
          active: healthServiceList?.active,
          description: healthServiceList?.description,
          image: (
            <img
              src={
                healthServiceList?.image
                  ? `${healthServiceList?.image}`
                  : require("../../assets/fn.png")
              }
              width={50}
              height={50}
            />
          ),
          // actions: <ActionButtons />,
        }));
        setHealthServiceList({
          data: modifiedData,
          totalCount: res?.total_count,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };
  const onClickModalClose = (isSuccess) => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };
  const handleAddButtonClick = () => {
    setCurrentHsDetails({});
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (hsDetails) => {
    setCurrentHsDetails({});
    setIsEditModalOpen(true);
  };

  const handleActiveInactiveSwitch = (e, hsId) => {
    const hsIndex = healthServiceList?.findIndex((hs) => hs?.id === hsId);
    const cloneHsData = JSON.parse(JSON.stringify(healthServiceList));
    if (hsIndex > -1) {
      cloneHsData[hsIndex].active = e?.target?.checked;
      setHealthServiceList([...cloneHsData]);
      updateHSStatus(e?.target?.checked, hsId);
    }
  };

  const updateHSStatus = (checked, hsId, searchText) => {
    const payload = {
      active: checked,
    };
    apiRequest({
      url: `master/update-hs/${hsId}`, // Change here
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        getHealthServices();
        props.onClickModalClose(true);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const ActionButtons = (row) => {
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
              setDeleteHs({
                open: true,
                data: row,
              })
            }
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Edit"}
            handleButtonClick={() => {
              handleEditButtonClick(row);
              setCurrentHsDetails(row);
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
    return healthServiceList?.data?.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily="Poppins-Regular"
            color={Colors.headerColor}
            fontSize={12}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/health-services/${row?.id}/details`, {state: {details: data[index]}})
            }
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>{row.image}</TableCell>
        <TableCell>
          <Typography
            fontFamily="Poppins-Regular"
            color={Colors.textColor}
            fontSize={12}
          >
            {row.title}
          </Typography>
        </TableCell>
        {/* <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.description}
          </Typography>
        </TableCell> */}
        {/* <TableCell>
          <Typography
            fontFamily="Poppins-Regular"
            color={Colors.textColor}
            fontSize={12}>
            {row.price}
          </Typography>
        </TableCell> */}
        <TableCell key={row.id}>
          <Switch
            {...label}
            defaultChecked
            color={"error"}
            checked={row?.active === true ? true : false}
            onChange={(e) => {
              if (e?.target) {
                setUpdateHsStatus({
                  ...updateHsStatus,
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

  const Add = (props) => {
    const { user } = useAppContext();
    const [imgs, setImgs] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const { isEdit, onClickModalClose, currentHsDetails } =
      props;

    const onClickCancel = () => {
      onClickModalClose(false);
    };

    const schema = yup
      .object({
        name: yup.string().required("Health Service Name is required"),
        // teluguName: yup.string().required("Telugu Name is required"),
        // price: yup.string().required("Price is required"),
      })
      .required();

    const getEditUserDetails = (isEdit, currentHsDetails) => {
      if (!isEdit || !currentHsDetails) {
        return { name: "", teluguName: "", price: "" };
      } else {
        return {
          name: currentHsDetails.title || "",
          teluguName: currentHsDetails.description || "",
          price: currentHsDetails.price || "",
        };
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log(file, URL.createObjectURL(file), "JJJJJJJJJJJJJJJJJJ")
        uploadFileToS3(file)
        setSelectedImage(URL.createObjectURL(file));
      }
    };
  
    const uploadFileToS3 = async (file) => {
  
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AccessKeyId,
        secretAccessKey: process.env.REACT_APP_SecretAccessKey,
        region: process.env.REACT_APP_Region,
      });
  
      const s3 = new AWS.S3();
  
      const bucketName = process.env.REACT_APP_BucketName;
      const key = file.name;
  
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: "image/jpeg",
      };
  
      try {
        const data = await s3.upload(params).promise();
        console.log(data, "QQQQQQQQQQQQQQQQQQQQQQQ")
        setImgs(data.Location)
        // alert("File uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading file. Please try again.");
      }
    };
  
    const handleCancelImage = () => {
      setSelectedImage(null);
      setImgs('');
    };

    const { handleSubmit, control, getValues } = useForm({
      resolver: yupResolver(schema),
      defaultValues: getEditUserDetails(isEdit, currentHsDetails), // Use 'healthServiceList' directly here
    });

    const onSubmit = (data) => {
      if (isEdit && currentHsDetails?.id) {
        const formData = getValues();
        var payload = {
          name: formData?.name,
          description: "null",
          price: formData?.price,
        };
        if(imgs) {
          Object.assign(payload, {image: imgs});
        }
        console.log(payload, "PPPPPPPPPPPPP")
        apiRequest({
          url: `master/update-hs/${currentHsDetails?.id}`,
          data: payload,
          method: "PUT",
        })
          .then((res) => {
            if(res.success) {
              getHealthServices({ skip, searchText: "" });
            }
            props.onClickModalClose(true);
          })
          .catch((err) => {
            // alert(err?.message, "error");
          });
      } else {
        const payload = {
          name: data?.name,
          description: "null",
          image: imgs,
          price: data?.price,
        };

        const URL =
          user?.role?.code === "admin"
            ? "master/add-hs"
            : "madmin/master/add-hs";

        apiRequest({
          url: URL,
          data: payload,
          method: "POST",
        })
          .then((res) => {
            if (res?.success === true) {
              alert("Health Service added Successfully");
              getHealthServices({ skip, searchText: "" });
            }
            props.onClickModalClose();
            props.getHealthServices();
          })
          .catch((err) => {
            console.log(err);
            // alert(err?.response?.data?.message, "error");
          });
      }
    };

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            display={"flex"}
            alignItems={"baseline"}
            justifyContent={"center"}
            mt={3}
            gap={3}
            width={"100%"}
          >
            <Grid item width={"45%"}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter Health Service Name"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            {/* <Grid item width={"45%"}>
              <Controller
                name="teluguName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Description"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid> */}
            <Grid item width={"45%"}>
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Price"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item width={"45%"}>
              <Controller
                name="teluguName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box display="flex" flexDirection="column" gap={2}>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button variant="contained" component="span" style={{backgroundColor: "#B1040E"}}>
                        Upload Image
                      </Button>
                    </label>

                    {selectedImage ? (
                    <Box position="relative" display="inline-block" marginTop="10px">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ width: "200px" }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleCancelImage}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          backgroundColor: "white",
                        }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : currentHsDetails && currentHsDetails.image ? 
                  <Box style={{ width: "200px" }}>
                    {currentHsDetails.image}
                  </Box>
                  : null}
                  </Box>
                )}
              />
                
            </Grid>
            <Grid item width={"45%"}>
              
            </Grid>
          </Grid>

          <Grid
            container
            display={"flex"}
            alignItems={"flex-end"}
            justifyContent={"center"}
            mt={3}
            gap={3}
            width={"100%"}
          >
            {/* <Grid item width={"45%"}>
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"text"}
                    inputLabel={"Enter Price"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid> */}
            <Grid item width={"100%"}>
              <Box
                display={"flex"}
                alignItems={"end"}
                justifyContent={"flex-end"}
                gap={2}
              >
                <Box>
                  <CustomButton
                    title={`Cancel`}
                    handleButtonClick={props.onClickModalClose}
                    backgroundColor={Colors.white}
                    textColor={Colors.headerColor}
                    width={100}
                    height={37}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                    variant={"outlined"}
                  />
                </Box>
                <Box>
                  <CustomButton
                    title={`Save`}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={100}
                    height={37}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                    // padding={"14px 50px"}
                    type={"submit"}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </>
    );
  };

  const searchText = (e) => {
    const searchText = e.target.value;
    getHealthServices({ searchText });
  };

  const getHS = () => {
    getHealthServices({ skip, searchText: "" });
  };
  const updateHs = () => {
    apiRequest({
      url: `master/toggle-hs/${updateHsStatus?.data.id}`,
      method: "PUT",
    })
      .then((res) => {
        setUpdateHsStatus({
          open: false,
          data: {},
        });
        getHealthServices({ skip, searchText: "" });
      })
      .catch((err) => {});
  };

  const handleDeleteHs = () => {
    const URL =
      user?.role?.code === "admin"
        ? `master/delete-hs/${deleteHs?.data?.id}`
        : `madmin/master/delete-hs/${deleteHs?.data?.id}`;
    apiRequest({
      url: URL,
      method: "DELETE",
    })
      .then((res) => {
        console.log(res, "RRRRRRRRR")
        if(res.success) {
          setDeleteHs({
            open: false,
            data: {},
          });
          getHealthServices({ skip, searchText: "" });
        }
        getHealthServices({ searchString: "" });
      })
      .catch((err) => {
        console.log(err, "EEEEEEEEE")
      });
  };

  useEffect(() => {
    let headers = ["Id,Health Service Name,Status"];

    let hsList;
    if (Array.isArray(hsCsv.data) && hsCsv.data.length > 0) {
      hsList = hsCsv.data?.reduce((acc, hs, index) => {
        const { active, display_name, id } = hs;

        acc.push([id, display_name, active].join(","));
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...hsList].join("\n"),
        fileName: "Health Services List.csv",
        fileType: "text/csv",
      });
    }
  }, [hsCsv]);

  const exportToCsv = () => {
    const payload = {
      skip: skip,
      limit: 100000000,
    };
    const url =
      user?.role?.code === "admin" ? `master/hs/list` : `madmin/master/hs/list`;

    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        seThsCsv({
          data: res?.data,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      {/* Add Health Service Modal */}
      {isAddModalOpen && (
        <CustomDialog
          open={isAddModalOpen}
          width={"550px"}
          onClose={() => onClickModalClose(false)}
          title={"Add Health Service"}
        >
          <Add
            onClickModalClose={onClickModalClose}
            getHealthServices={getHS}
          />
        </CustomDialog>
      )}

      {/* Edit Health Service Modal */}

      <CustomModal
        openModal={isEditModalOpen}
        handleModalClose={() => onClickModalClose(false)}
        title={"Edit Health Service"}
      >
        <Add
          currentHsDetails={currentHsDetails}
          onClickModalClose={() => setIsEditModalOpen(false)}
          isEdit={Boolean(currentHsDetails?.id)}
        />
      </CustomModal>

      {updateHsStatus.open && (
        <CustomDialog
          title={"Status Confirmation"}
          width={"400px"}
          open={updateHsStatus.open}
          onClose={() => {
            setUpdateHsStatus({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to{" "}
            {updateHsStatus.data.active === true ? "In-Active" : "Active"} Health
            Service
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
                handleButtonClick={() => setUpdateHsStatus({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => updateHs(updateHsStatus.open)}
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

      {deleteHs.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteHs.open}
          onClose={() => {
            setDeleteHs({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete {deleteHs.data?.animalCategory}{" "}
            Health Service
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
                handleButtonClick={() => setDeleteHs({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => handleDeleteHs()}
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
            Health Services
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters {">"} Health Services
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"+ Add Health Service"}
            handleButtonClick={handleAddButtonClick} // Change onAddButtonPress to handleAddButtonClick
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={185}
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
                onChange={(e) => searchText(e)}
                placeholder={"Search"}
                padding={"12px 12px 12px 0px"}
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={healthServiceList}
            >
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {healthServiceList?.totalCount > 10 && (
                <Pagination
                  totalCount={Number(healthServiceList?.totalCount)}
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

export default HealthServices;
