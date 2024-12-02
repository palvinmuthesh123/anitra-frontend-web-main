import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { apiRequest } from "../../services/api-request";
import * as yup from "yup";
import { useAppContext } from "../../context/AppContext";
import moment from "moment";
import "moment-timezone";
const TransactionHistory = (props) => {
  const { animalId } = props;

  const { user = {} } = useAppContext();
  const currentRole = user?.role?.code || null;

  //   const tableHeader = [
  //     {
  //       id: 1,
  //       title: "Date & Time",
  //     },
  //     {
  //       id: 2,
  //       title: "Activity",
  //     },
  //     ...(currentRole === "admin"
  //       ? [
  //           {
  //             id: 3,
  //             title: "Category",
  //           },
  //         ]
  //       : []),
  //     {
  //       id: 4,
  //       title: "Status",
  //     },
  //     {
  //       id: 5,
  //       title: "Documents",
  //     },
  //   ];

  const [animalTypes, setAnimalTypes] = useState({
    data: [],
    totalCount: "",
  });

  const schema = yup
    .object({
      animalType: yup.string().required("Animal Type is required"),
      animalBreed: yup.string().required("Animal Breed is required"),
      ageInMonths: yup.string().required("Age is required"),
      purchaseFrom: yup.string().required("Purchase From is required"),
    })
    .required();

  const getEditUserDetails = (isEdit, userAnimalDetails) => {
    const createdDate = userAnimalDetails?.created_on;
    const utcDate = new Date(createdDate);
    const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");

    const istDateEndsAt = moment(istDateTimeEndsAt, "YYYY-MM-DD]");

    const updatedDate = userAnimalDetails?.updated_on;
    const utcUpdatedDate = new Date(updatedDate);
    const istUpdatedDateTimeEndsAt = moment
      .utc(utcUpdatedDate)
      .tz("Asia/Kolkata");

    const istUpdatedDateEndsAt = moment(istUpdatedDateTimeEndsAt, "YYYY-MM-DD");

    const verifiedDate = userAnimalDetails?.verification_details?.verified_on;
    const utcverifiedDate = new Date(verifiedDate);
    const istverifiedDateTimeEndsAt = moment
      .utc(utcverifiedDate)
      .tz("Asia/Kolkata");

    const istVerifiedDateEndsAt = moment(
      istverifiedDateTimeEndsAt,
      "YYYY-MM-DD]"
    );

    if (!isEdit) {
      return {
        animalId: userAnimalDetails?.id,
        animalTag: userAnimalDetails?.tag_no,
        animalType: userAnimalDetails?.type?.id,
        animalBreed: userAnimalDetails?.breed?.id,
        ageInMonths: userAnimalDetails?.details?.age_in_months,
        purchaseFrom: userAnimalDetails?.purchase_details?.purchased_from,
        createdAt: istDateEndsAt,
        updatedAt: istUpdatedDateEndsAt,
        verifiedAt: istVerifiedDateEndsAt,
      };
    } else {
      return {
        animalId: userAnimalDetails?.id,
        animalTag: userAnimalDetails?.tag_no,
        animalType: userAnimalDetails?.type?.id,
        animalBreed: userAnimalDetails?.breed?.id,
        ageInMonths: userAnimalDetails?.details?.age_in_months,
        purchaseFrom: userAnimalDetails?.purchase_details?.purchased_from,
        createdAt: "22 Sept 2022",
        updatedAt: "22 Sept 2022",
        verifiedAt: "25 Sept 2022",
      };
    }
  };

  //   const { handleSubmit, control, , watch, setValue, getValues } =
  //     useForm({
  //       resolver: yupResolver(schema),
  //       defaultValues: getEditUserDetails(props?.isEdit, userAnimalDetails),
  //     });

  useEffect(() => {
    getTypes();
  }, []);

  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    if (animalId) {
      getAnimalActivity(animalId);
    }
  }, [animalId]);

  const getAnimalActivity = (animalId) => {
    apiRequest({
      url:
        currentRole === "mithunAdmin"
          ? `madmin/animal/activity`
          : `animal/activity`,
      data: {
        animal_id: animalId,
      },
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

  //   const TableDataUi = () => {
  //     return activityList?.map((row) => {
  //       const createdDate = row?.dateTime;
  //       const utcDate = new Date(createdDate);
  //       const istDateTimeEndsAt = moment.utc(utcDate).tz("Asia/Kolkata");

  //       const istDateEndsAt = moment(istDateTimeEndsAt, "DD-MMM-YYYY");
  //       const istEndsTime = istDateEndsAt.format("HH:mm");

  //       return (
  //         <>
  //           <TableRow
  //             key={row.id}
  //             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  //           >
  //             <TableCell>
  //               <Typography
  //                 fontFamily={"Poppins-Medium"}
  //                 color={Colors.textColor}
  //                 fontSize={13}
  //               >
  //                 {istDateEndsAt.format("DD MMM YYYY")}
  //               </Typography>
  //               <Typography
  //                 fontFamily={"Poppins-Medium"}
  //                 color={Colors.textColor}
  //                 fontSize={13}
  //               >
  //                 {istEndsTime}
  //               </Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography
  //                 fontFamily={"Poppins-Medium"}
  //                 color={Colors.textColor}
  //                 fontSize={12}
  //               >
  //                 {row.activityName}
  //               </Typography>
  //             </TableCell>
  //             {currentRole === "admin" && (
  //               <TableCell>
  //                 <Typography
  //                   fontFamily={"Poppins-Regular"}
  //                   color={Colors.textColor}
  //                   fontSize={12}
  //                 >
  //                   {row.category}
  //                 </Typography>
  //               </TableCell>
  //             )}

  //             <TableCell>
  //               <Typography
  //                 fontFamily={"Poppins-Medium"}
  //                 color={Colors.textColor}
  //                 fontSize={13}
  //               >
  //                 {row.status}
  //               </Typography>
  //             </TableCell>
  //             <TableCell>
  //               <Typography
  //                 fontFamily={"Poppins-Medium"}
  //                 color={Colors.textColor}
  //                 fontSize={13}
  //               >
  //                 {row.documents}
  //               </Typography>
  //             </TableCell>
  //           </TableRow>
  //         </>
  //       );
  //     });
  //   };

  const getTypes = () => {
    const payload = {
      skip: 0,
      limit: 100,
    };
    const url = `master/types`;

    apiRequest({
      url: url,
      method: "POST",
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

  return (
    <Box m={3}>
      <Grid
        container
        justifyContent={"flex-start"}
        width={"100%"}
        alignItems={"center"}
        gap={"20px"}
      >
        {/* <Grid item md={3}>
                    <CustomInput
                        placeholder={"Search"}
                        leftIcon={
                            <SearchOutlinedIcon style={{ color: Colors.textColor }} />
                        }
                    />
                </Grid>
                <Grid item md={3}>
                    <Box>
                        <Controller
                            name="animalType"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <SelectPicker
                                    options={animalTypes.data}
                                    {...field}
                                    type={"text"}
                                    placeholder={"Select Animal Type"}
                                    error={!!error}
                                    helperText={error ? error.message : ""}
                                />
                            )}
                        />
                    </Box>
                </Grid>
                <Grid item md={3}>
                    <Box>
                        <Controller
                            name="animalType"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <SelectPicker
                                    options={[
                                        { name: "UPLOADED", value: "option1" },
                                        { name: "REGISTERED", value: "option2" },
                                        // Add more options here if needed
                                    ]}
                                    {...field}
                                    type={"text"}
                                    placeholder={"Status"}
                                    error={!!error}
                                    helperText={error ? error.message : ""}
                                />
                            )}
                        />
                    </Box>
                </Grid> */}
        <Box mt={2}>
          <Grid width={"100%"}>
            <Grid item width={"100%"}>
              <Typography
                fontFamily={"Poppins-Medium"}
                textAlign={"center"}
                // color={Colors.headerColor}
                fontSize={16}
              >
                No Transactions Found
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {/* <Box mt={2}>
                <CustomTable headerData={tableHeader} tableData={activityList}>
                    <TableDataUi />
                </CustomTable>
            </Box> */}
    </Box>
  );
};

export default TransactionHistory;
