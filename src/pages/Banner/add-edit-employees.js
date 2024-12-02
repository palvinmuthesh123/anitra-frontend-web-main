import React, { useState, useEffect } from "react";
import { Box, Grid, Button, IconButton } from "@mui/material";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Colors } from "../../constants/Colors";
import { apiRequest } from "../../services/api-request";
import SelectPicker from "../../components/SelectPicker";
import CancelIcon from "@mui/icons-material/Cancel";
import AWS from "aws-sdk";
import { useAppContext } from "../../context/AppContext";

const AddEditUser = (props) => {
  const [statesList, setStatesList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [usertype, setUserType] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgs, setImgs] = useState('')
  const [data, setData] = useState([
    {
      name: "Super Admin",
      value: "SUPER_ADMIN",
    },
    {
      name: "State Admin",
      value: "STATE_ADMIN",
    },
    {
      name: "District Admin",
      value: "DISTRICT_ADMIN",
    },
    {
      name: "Supervisor",
      value: "SUPERVISOR",
    }
  ])
  const { user } = useAppContext();

  const { currentState = {} } = props;

  const schema = yup
    .object({
      image: yup.string().required("Mobile number is required"),
    })
    .required();

  useEffect(()=> {
    // getStates();
    // getDistricts();
  },[])

  const getStates = () => {
    // const URL = user?.role?.code === "admin" ? `master/states` : `madmin/master/states`;
    // const method = user?.role?.code === "admin" ? "GET" : "POST";

    const URL = `master/states`
    const method = "GET"
  
    console.log(URL,method)

    apiRequest({
      url: URL,
      method: method,
    })
    .then((res) => {
      console.log(res, res.data.length, "OOOOOOOOOOOOOOOOOOOOO");
  
      // const statesList = res.data.map((state, index) => ({
      //   name: user?.role?.code === "admin" ? state.display_name : state.State,
      //   value: user?.role?.code === "admin" ? index : `${state.State}-${index}`,
      // }));

      const getStatesList = res?.data?.map((state) => {
      console.log(state, "OOOOONNNNN.................")
      ({
        name: state?.name,
        value: state?.id,
      })
    });

    var arr = []

    for(var i = 0; i < res?.data?.length; i++) {
      // arr.push({
      //   active: res?.data?[i].active,
      //   code: res?.data?[i].code,
      //   display_name: res?.data?[i].display_name,
      //   id: res?.data?[i].id,
      //   local_name: res?.data?[i].local_name,
      //   name: res?.data?[i].name
      // })
    }
  
      console.log(getStatesList, "LIST...............");
  
      setStatesList(getStatesList);
    })
    .catch((err) => {
      alert(err?.response?.data?.message, "error");
    });
  };

  const getDistricts = (stateName) => {
    const URL =
      user?.role?.code === "admin"
        ? `master/districts`
        : `madmin/master/districts`;
    const payload = {
      state_id: Number(stateName),
      limit: 5000,
    };
    const mithunPayload = {
      state_name: stateName,
      limit: 5000,
    };
    apiRequest({
      url: URL,
      method: "POST",
      data: user?.role?.code === "admin" ? payload : mithunPayload,
    })
      .then((res) => {
        if (user?.role?.code === "admin") {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.name,
            value: district?.id,
          }));
          setDistrictList(getDistricts);
        } else {
          const getDistricts = res?.data?.map((district) => ({
            name: district?.District,
            value: district?._id,
          }));
          setDistrictList(getDistricts);
        }
      })
      .catch((err) => {
        alert(err?.response?.data?.message, "error");
      });
  };

  const getEditUserDetails = (isEdit, currentState) => {
    console.log(isEdit, currentState, "HHHHHHHHHHHHHHH")
    if (!isEdit) {
      return {
        farmerName: "",
        mobile: "",
        email: ""
      };
    } else {
      return {
        farmerName: currentState?.name,
        mobile: currentState?.mobile,
        email: currentState?.email,
      };
    }
  };

  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getEditUserDetails(props?.isEdit, currentState),
  });

  const [communityList, setCommunityList] = useState({
    data: [],
  });

  const onSubmit = (data) => {
    data.preventDefault();
    const formData = new FormData(data.target);

    // if(Object.keys(currentState).length === 0) {

      let payload = {
        image: imgs,
      };

      let url = 'master/add-banners'

      apiRequest({
        url: url,
        data: payload,
        method: "POST",
      })
        .then((res) => {
          console.log(res, "RRRRRRRRRRRRRRRRRR");
          if (res?.success === false) {
            alert(res?.message);
          }
          if (res?.success === true) {
            alert(res?.message);
          }
          props.getUsersByType();
          props.onCancel();
      })
        .catch((err) => {
          console.log(err);
          alert(err?.response?.data?.message, "error");
      })
    // }
    // else {

    //   let payload = {
    //     user_id: currentState.user_id,
    //     mobile: formData.get("mobile"),
    //     name: formData.get("farmerName"),
    //     email: formData.get("email"),
    //   };

    //   apiRequest({
    //     url: `user/updateCompanyUser`,
    //     data: payload,
    //     method: "PUT",
    //   })
    //     .then((res) => {
    //       console.log(res, "RRRRRRRRRRRRRRRRRR");
    //       if (res?.success === false) {
    //         alert(res?.message);
    //       }
    //       if (res?.success === true) {
    //         alert(res?.message);
    //       }
    //       props.getUsersByType();
    //       props.onCancel();
    //   })
    //     .catch((err) => {
    //       console.log(err);
    //       alert(err?.response?.data?.message, "error");
    //   })

    // }

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
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImgs('');
  };

  return (
    <>
      <Box sx={{ width: "100%", padding: "20px 0px 0px 0px" }}>
        <form onSubmit={onSubmit} autoComplete="off">
          <Grid
            container
            alignItems={"baseline"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
           <Grid item xs={12}>
              <Box>
                <Controller
                  name="image"
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
                    ) : null}
                    </Box>
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            alignItems={"end"}
            justifyContent={"flex-end"}
            mt={2}
            gap={2}
          >
            <Grid item>
              <CustomButton
                title={`Cancel`}
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={props?.onCancel}
                variant={"outlined"}
                width={130}
                height={34}
              />
            </Grid>
            <Grid item>
              <CustomButton
                variant={"contained"}
                title={`Submit`}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                borderColor={Colors.headerColor}
                textFontSize={14}
                type={"submit"}
                width={130}
                height={34}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AddEditUser;
