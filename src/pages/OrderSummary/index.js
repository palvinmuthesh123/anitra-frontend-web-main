import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import CustomModal from "../../components/Modal";
import { AvatarView } from "../../pages/UserView";
import { useNavigate, useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";

const label = { inputProps: { "aria-label": "switch" } };

const OrderSummary = () => {
  const { orderType } = useParams();
  const [isModalOpen, setModal] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => {
    setModal(true);
  };

  const ModalContent = () => {
    return (
      <Box width={500}>
        <Grid container justifyContent={"center"} alignItems={"center"} mt={3}>
          <Grid item>
            <Box
              width={70}
              height={70}
              borderRadius={35}
              backgroundColor={Colors.darkGreen}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CheckIcon sx={styles.iconStyle} />
            </Box>
          </Grid>
        </Grid>
        <Typography
          fontFamily={"Poppins-Medium"}
          color={Colors.textColor}
          fontSize={14}
          mt={4}
        >
          Order Id : 402536
        </Typography>
        <Typography
          fontFamily={"Poppins-Medium"}
          color={Colors.textColor}
          fontSize={14}
          mt={2}
        >
          Order Details : Cow | Gir | Milking Animal
        </Typography>
        <Typography
          fontFamily={"Poppins-Medium"}
          color={Colors.textColor}
          fontSize={14}
          mt={2}
        >
          Partner Name : Mundrathi Vivek
        </Typography>
        <Grid container justifyContent={"flex-end"}>
          <CustomButton
            title={`Submit`}
            handleButtonClick={() => {
              console.log("hii");
            }}
            backgroundColor={Colors.headerColor}
            textColor={Colors.white}
            width={130}
            height={34}
            borderColor={Colors.headerColor}
            textFontSize={14}
          />
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      <CustomModal
        openModal={isModalOpen}
        handleModalClose={() => {
          setModal(false);
        }}
        title={"Order Complete"}
      >
        <ModalContent />
      </CustomModal>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            {orderType === "buy" ? "Buy" : "Sell"} Process
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          >
            Orders  {orderType === "buy" ? "Buy" : "Sell"}  View
          </Typography>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Card>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <AvatarView
                name={"Mundrathi Vivek"}
                designation={"Farmer"}
                nameColor={Colors.textColor}
              />
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Order Id : 402536
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Order Details : Cow | Gir | Milking Animal
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Date & Time : 22 Aug 2022 | 09:23
              </Typography>
              <Typography
                fontFamily={"Poppins-Regular"}
                color={Colors.textColor}
                fontSize={13}
                m={1}
              >
                Additional Info : 46 Months | 250 Kg | 02
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={13}
            color={Colors.textColor}
          >
            Animal Info
          </Typography>
          <Box m={2}>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Animal Id : 402536
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Tag Id : 40253 6819 12
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Category : Cow
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              mt={2}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Type : Milking Animal
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Age : 46 Months
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Weight : 250 Kg's
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              mt={2}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Type : Milking Animal
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Teeth Count : 32
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Horn Distance : 310 Cm
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              mt={2}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  No Of Rings : 02
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Owner Name : Sujith S
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Partner : Farmer
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              mt={2}
            >
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Created Date : 22 Sept 2022
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Updated Date : 22 Sept 2022
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  color={Colors.textColor}
                  fontSize={14}
                  m={1}
                >
                  Verified Date : 22 Sept 2022
                </Typography>
              </Grid>
            </Grid>
            {orderType === "sell" && (
              <Box>
                <Typography
                  fontFamily={"Poppins-Medium"}
                  fontSize={13}
                  color={Colors.textColor}
                  mt={4}
                >
                  Buyer Info
                </Typography>
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"flex-start"}
                  mt={2}
                >
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Medium"}
                      color={Colors.textColor}
                      fontSize={14}
                      m={1}
                    >
                      Id : 402536
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Medium"}
                      color={Colors.textColor}
                      fontSize={14}
                      m={1}
                    >
                      Buyer Name : Sujith S
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      fontFamily={"Poppins-Medium"}
                      color={Colors.textColor}
                      fontSize={14}
                      m={1}
                    >
                      Partner : Farmer
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
      <Box mt={2}>
        <Card>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={13}
            color={Colors.textColor}
          >
            Price Info
          </Typography>
          <Grid container alignItems={"center"} gap={4} m={2}>
            <Grid item width={300}>
              <CustomInput
                placeholder={""}
                label={"Suggested Price (in Rupees)   "}
                value={"Rs 39,000"}
                disabled={true}
              />
            </Grid>
            <Grid item width={300}>
              <CustomInput
                placeholder={""}
                label={"Enter Price (in Rupees)"}
                value={""}
                disabled={false}
                bgColor={Colors.white}
              />
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box mt={2}>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            <Card>
              <Typography
                fontFamily={"Poppins-Medium"}
                fontSize={13}
                color={Colors.textColor}
              >
                Logistics
              </Typography>
              <Grid container alignItems={"center"} gap={4} m={2}>
                <Grid item width={300}>
                  <CustomInput
                    placeholder={""}
                    label={"Request Logistics"}
                    value={"Logistics Required"}
                    disabled={false}
                    bgColor={Colors.white}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item>
            <Grid
              container
              alignItems={"center"}
              justifyContent={"flex-end"}
              mt={2}
              gap={3}
            >
              <Grid item>
                <CustomButton
                  title={`Cancel`}
                  handleButtonClick={() => {
                    navigate("/buy");
                  }}
                  backgroundColor={Colors.white}
                  textColor={Colors.headerColor}
                  width={130}
                  height={34}
                  borderColor={Colors.headerColor}
                  textFontSize={14}
                />
              </Grid>
              <Grid item>
                <CustomButton
                  title={`Submit`}
                  handleButtonClick={nextStep}
                  backgroundColor={Colors.headerColor}
                  textColor={Colors.white}
                  width={130}
                  height={34}
                  borderColor={Colors.headerColor}
                  textFontSize={14}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderSummary;

const styles = {
  iconStyle: {
    color: Colors.white,
    fontSize: 30,
  },
};
