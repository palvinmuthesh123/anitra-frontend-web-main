import React, { useEffect, useState, useCallback } from "react";
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
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CustomModal from "../../components/Modal";
import { apiRequest } from "../../services/api-request";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import CustomDialog from "../../components/ConfirmationModal";
import FileUploader from "../../components/FileUploader/file-uploder";
import { useNavigate, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import AWS from "aws-sdk";
import SelectPicker from "../../components/SelectPicker";

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
    title: "Product Name",
  },
  {
    id: 4,
    title: "Description",
  },
  {
    id: 5,
    title: "Category",
  },
  {
    id: 6,
    title: "Active",
  },
  {
    id: 7,
    title: "Actions",
  },
];

const cate = [
  {
    name: "Feed",
    value: "FEED",
  },
  {
    name: "Feed Supplements",
    value: "FEED SUPPLEMENTS",
  },
  {
    name: "Medicine",
    value: "MEDICINES",
  },
  {
    name: "Others",
    value: "OTHERS",
  },
]

const FeedNutrition = (props) => {
  const { user = {} } = useAppContext();
  const navigate = useNavigate();
  const [desc, setDesc] = useState();
  
  const [data, setData] = useState([])
  const [deleteFeed, setDeleteFeed] = useState({
    data: {},
    open: false,
  });
  const [feedNutritionList, setFeedNutritionList] = useState({
    data: [],
    totalCount: "",
  });
  const [currentFeedDetails, setCurrentFeedDetails] = useState({});
  const [cat, setCat] = useState('');
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add this line
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getFeedNutrition("", skip);
  }, [skip]);

  const getFeedNutrition = (searchText, skip) => {
    const payload = {
      skip: skip,
      limit: limit,
      ...(searchText && {
        name: searchText,
      }),
    };

    const url =
      user?.role?.code === "admin"
        ? `master/feed/list`
        : `madmin/master/feed/list`;
    apiRequest({
      url,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        setData(res?.data);
        const modifiedData = res?.data?.map((feedNutritionList) => (
          {
          id: feedNutritionList?.id,
          name: feedNutritionList?.name,
          description: feedNutritionList?.description.replace(/\n/g, '<br>'),
          price: feedNutritionList?.price,
          image: (
            <img
              src={
                feedNutritionList?.image
                  ? `${feedNutritionList?.image}`
                  : require("../../assets/fn.png")
              }
              width={50}
              height={50}
            />
          ),
          priority: feedNutritionList?.priority,
          category: feedNutritionList?.category || '',
        }));
        setFeedNutritionList({
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
    if (isSuccess) {
      // If the modal was closed successfully after adding/editing, refresh the health service list
      getFeedNutrition();
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleAddButtonClick = () => {
    setCurrentFeedDetails({});
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (hsDetails) => {
    setCurrentFeedDetails({});
    setIsEditModalOpen(true);
  };

  const handleActiveInactiveSwitch = (e, hsId) => {
    const hsIndex = feedNutritionList?.findIndex((hs) => hs?.id === hsId);
    const cloneHsData = JSON.parse(JSON.stringify(feedNutritionList));
    if (hsIndex > -1) {
      cloneHsData[hsIndex].active = e?.target?.checked;
      setFeedNutritionList([...cloneHsData]);
      updateHSStatus(e?.target?.checked, hsId);
    }
  };

  const updateHSStatus = (checked, hsId) => {
    const payload = {
      active: checked,
    };
    apiRequest({
      url: `master/update-feed/${hsId}`, // Change here
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        getFeedNutrition();
        props.onClickModalClose(true);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const deleteFD = () => {
    var hsId = deleteFeed.data.id
    apiRequest({
      url: `master/delete-feed/${hsId}`,
      method: "DELETE",
    })
      .then((res) => {
        if(res.success) {
          setDeleteFeed({
            open: false,
            data: {},
          });
          getFeedNutrition("", skip);
        }
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
            handleButtonClick={() => {
              setDeleteFeed({
                open: true,
                data: row,
              });
            }}
            backgroundColor={"#E1E1E1"}
            textColor={"#111A45"}
            fontSize={"12px"}
            width={52}
            height={22}
          />
        </Grid>
        <Grid item>
          <CustomButton
            title={"Edit"}
            handleButtonClick={() => {
              handleEditButtonClick(row);
              setCurrentFeedDetails(row);
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
    return feedNutritionList?.data?.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={12}
            sx={{ textDecorationLine: "underline", cursor: "pointer" }}
            onClick={() =>
              navigate(`/feed-nutrition/${row?.id}/details`, {state: {details: data[index]}})
            }
          >
            {row.id}
          </Typography>
        </TableCell>
        <TableCell>{row.image}</TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.name}
          </Typography>
        </TableCell>
        <TableCell>
          {/* <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {" "}
            {row.description}
          </Typography> */}
          <div dangerouslySetInnerHTML={{ __html: row.description }} />
        </TableCell>
        
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}>
            {row?.category || " "}
          </Typography>
        </TableCell>

        <TableCell>
          <Switch {...label} defaultChecked color={"error"} />
        </TableCell>
        <TableCell>{ActionButtons(row)}</TableCell>
      </TableRow>
    ));
  };

  const Add = (props) => {
    const { isEdit, onClickModalClose, currentFeedDetails } = props;
    const [imgs, setImgs] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(()=>{
      console.log(currentFeedDetails, "CCCCCCCCCCCCCCCCCc")
    },[])

    const onClickCancel = () => {
      onClickModalClose(false);
    };

    const schema = yup
      .object({
        name: yup.string().required("Enter Product Name is required"),
        companyName: yup.string().required("Enter Company Name is required"),
        // price: yup.string().required("Price per Unit is required"),
      })
      .required();

    const getEditUserDetails = (isEdit, currentFeedDetails) => {
      if (!isEdit || !currentFeedDetails) {
        return { name: "", companyName: "", price: "", priority: 0, cate: '' };
      } else {
        return {
          name: currentFeedDetails.name || "",
          companyName: currentFeedDetails.description || "",
          price: currentFeedDetails.price || "",
          priority: currentFeedDetails.priority || 0,
          cate: currentFeedDetails.category || ''
        };
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      console.log(event, event.target, event.target.files, event.target.files[0], file, "EEEEEEEEEEEEEEEEEEEE");
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
      defaultValues: getEditUserDetails(isEdit, currentFeedDetails), // Use 'feedNutritionList' directly here
    });

    const onSubmit = (data) => {
      console.log(data)
      if (isEdit && currentFeedDetails?.id) {
        const formData = getValues();
        var payload = {
          name: formData?.name,
          description: formData?.companyName,
          category: formData?.cate,
          price: formData?.price,
          priority: formData?.priority
        };
        if(imgs) {
          Object.assign(payload, {image: imgs});
        }
        console.log(payload, "PPPPPPPPPPPPP")
        apiRequest({
          url: `master/update-feed/${currentFeedDetails?.id}`,
          data: payload,
          method: "PUT",
        })
          .then((res) => {
            props.onClickModalClose(true);
          })
          .catch((err) => {
            // alert(err?.message, "error");
          });
      } else {
        const payload = {
          name: data?.name,
          description: data?.companyName,
          category: data?.cate,
          image: imgs,
          price: data?.price,
        };
        const URL =
          user?.role?.code === "admin"
            ? "master/add-feed"
            : "madmin/master/add-feed";
        apiRequest({
          url: URL,
          data: payload,
          method: "POST",
        })
          .then((res) => {
            props.onClickModalClose(true);
            if (res?.success === true) {
              alert("Added Successfully");
              getFeedNutrition("", skip);
            }
            // props.getFeedNutrition();
          })
          .catch((err) => {
            console.log(err);
            // alert(err?.response?.data?.message, "error");
          });
      }
    };

    const handleChange = useCallback((event) => {
      setDesc(event.target.value);
    }, []);

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            display={"flex"}
            alignItems={"flex-start"}
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
                    inputLabel={"Enter Product Name"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item width={"45%"}>
              <Controller
                name="companyName"
                control={control}
                defaultValue={desc}
                render={({ field, fieldState: { error } }) => 
                  {
                    console.log(field, "FFFFFFFFFFFF")
                    // setDesc(field.value)
                    return (
                      <textarea 
                        {...field}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   setDesc(e.target.value);
                        // }}
                        placeholder="Enter description here..." 
                        rows={5} 
                        cols={30} 
                      />
                    )
                  }
                }
              />
            </Grid>
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
                  ) : currentFeedDetails && currentFeedDetails.image ? 
                  <Box style={{ width: "200px" }}>
                    {currentFeedDetails.image}
                  </Box>
                  : null}
                  </Box>
                )}
              />
            </Grid>
            {(!isEdit || !currentFeedDetails) ? <></> :
            <><Grid item width={"45%"}>
              <Controller
                name="priority"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    type={"number"}
                    inputLabel={"Sequence"}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid><Grid item width={"45%"}></Grid></>
            }
          </Grid>

          <Grid
            container
            display={"flex"}
            alignItems={"flex-start"}
            justifyContent={"center"}
            mt={3}
            gap={3}
            width={"100%"}
          >
            <Grid item width={"45%"}>
              <FileUploader />
            </Grid>
            
          </Grid>

          <Grid
            container
            display={"flex"}
            alignItems={"flex-start"}
            justifyContent={"center"}
            // mt={3}
            // gap={3}
            width={"100%"}
          >
            <Grid item width={"45%"} style={{marginLeft: '-23px'}}>
                  <Box>
                    <Controller
                      name="cate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <SelectPicker
                          options={cate}
                          {...field}
                          // defaultOption={"Select User Type"}
                          labelText={""}
                          // onChange={(val)=>{console.log(val.target.value);setCat(val.target.value)}}
                          // value={cat}
                          type={"text"}
                          placeholder={"Select Category"}
                          error={!!error}
                          helperText={error ? error.message : ""}
                        />
                      )}
                    />
                  </Box>
            </Grid>
            <Grid item width={"45%"}>

            </Grid>
          </Grid>

          <Grid
            container
            display={"flex"}
            alignItems={"baseline"}
            justifyContent={"flex-end"}
            mt={3}
            gap={3}
            width={"100%"}
          >
            <Grid item>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                gap={2}
              >
                <Box>
                  <CustomButton
                    title={`Cancel`}
                    variant={"outlined"}
                    handleButtonClick={props.onClickModalClose}
                    backgroundColor={Colors.white}
                    textColor={Colors.headerColor}
                    width={100}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
                  />
                </Box>
                <Box>
                  <CustomButton
                    title={`Save`}
                    backgroundColor={Colors.headerColor}
                    textColor={Colors.white}
                    width={100}
                    height={34}
                    borderColor={Colors.headerColor}
                    textFontSize={14}
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
    getFeedNutrition(searchText);
  };

  return (
    <Box>
      {/* Add Health Service Modal */}
      <CustomDialog
        open={isAddModalOpen}
        width={"500px"}
        onClose={() => onClickModalClose(false)}
        title={"Add Store"}
      >
        <Add
          onClickModalClose={onClickModalClose}
          getFeedNutrition={getFeedNutrition}
        />
      </CustomDialog>

      {/* Edit Health Service Modal */}

      <CustomModal
        openModal={isEditModalOpen}
        handleModalClose={() => onClickModalClose(false)}
        title={"Edit Store"}
      >
        <Add
          currentFeedDetails={currentFeedDetails}
          onClickModalClose={onClickModalClose}
          isEdit={Boolean(currentFeedDetails?.id)}
        />
      </CustomModal>

      {deleteFeed.open && (
        <CustomDialog
          title={"Delete Confirmation"}
          width={"400px"}
          open={deleteFeed.open}
          onClose={() => {
            setDeleteFeed({
              open: false,
              data: {},
            });
          }}
        >
          <Typography>
            Are you sure you want to Delete this Store ?
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
                handleButtonClick={() => setDeleteFeed({ open: false })}
              />
            </Grid>
            <Grid item>
              <CustomButton
                title={`Yes`}
                handleButtonClick={() => deleteFD()}
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

      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Store
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Masters {`>`} Store
          </Typography>
        </Grid>
        <Grid item>
          <CustomButton
            title={"+ Add Store"}
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
                leftIcon={
                  <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                }
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <CustomTable
              headerData={dashboardHeader}
              tableData={feedNutritionList}
            >
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {feedNutritionList?.totalCount > 10 && (
                <Pagination
                  totalCount={Number(feedNutritionList?.totalCount)}
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

export default FeedNutrition;
