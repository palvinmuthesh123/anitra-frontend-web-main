import React, { useState } from "react";
import { Box, FormControlLabel } from "@mui/material";

import { apiRequest } from "../../services/api-request";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./login.css";
import { useSnackbar } from "../../context/useSnackbar";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/Input";
import { useAppContext } from "../../context/AppContext";
import CustomButton from "../../components/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { Colors } from "../../constants/Colors";
import logoSvg from "../../../src/assets/logo.png";
import { styled } from "@mui/system"; // Import styled from @mui/system

const schema = yup
  .object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

// Define a custom styled component for the entire page
const StyledLoginCard = styled("div")(({ theme }) => ({
  width: "405px",
  height: "400px",
  /* UI Properties */
  background: "var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box",
  background: "#FFFFFF 0% 0% no-repeat padding-box",
  boxShadow: "8px 8px 59px #00000029",
  borderRadius: "33px",
  opacity: 1,
  padding: "20px",
}));

const Login = () => {
  const { openSnackbar } = useSnackbar();

  const { handleLoginSuccess } = useAppContext();

  const [selectedRole, setSelectedRole] = useState("admin");

  const navigate = useNavigate();

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => {
    const payload = {
      password: data.password,
      mobile: data.email,
    };
    const URL = selectedRole === "admin" ? `auth/login` : `mithun/login`;
    apiRequest({
      url: URL,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        if (res) {
          if (res.success) {
            const userWithRole =
              res.data.role === "MITHUN ADMIN"
                ? {
                    data: res.data.accessToken,
                    actualRole: res.data.role,
                    role: { code: selectedRole },
                  }
                : { ...res, role: { code: selectedRole } };
            handleLoginSuccess(userWithRole);
            localStorage.setItem("user", JSON.stringify(userWithRole));
            navigate("/dashboard");
          } else {
            alert("Error");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        openSnackbar(err?.response?.data?.message, "error");
      });
  };

  const handleChangeFarmer = (type) => {
    if (type === "admin") {
      setSelectedRole("admin");
    } else {
      setSelectedRole("mithunAdmin");
    }
  };

  return (
    <>
      <Box padding={"40px 40px 0px 40px"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <img src={logoSvg} alt="" />
          </Box>
          <Box>
            <img
              src={require("../../assets/newmanitra.png")}
              alt=""
              style={{ width: "150px" }}
            />
          </Box>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"85vh"}
        >
          <StyledLoginCard>
            <Box>
              <h2 className="heading">Sign In</h2>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"100%"}
              mb={2.5}
            >
              <FormControl>
                <RadioGroup
                  name="row-radio-buttons-group"
                  defaultValue={selectedRole}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <FormControlLabel
                      value={"admin"}
                      defaultValue={selectedRole}
                      control={<Radio />}
                      label="Anitra Admin"
                      onChange={() => handleChangeFarmer("admin")}
                    />
                    <FormControlLabel
                      value={"mithunAdmin"}
                      control={<Radio />}
                      label="Mithun Admin"
                      onChange={() => handleChangeFarmer("mithunAdmin")}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Box>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      {...field}
                      type={"text"}
                      inputLabel={"Enter Mobile Number"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      padding={"16px"}
                    />
                  )}
                />
              </Box>
              <Box mt={3}>
                <Controller
                  name="password"
                  type="password"
                  defaultValue={""}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomInput
                      type="password"
                      {...field}
                      inputLabel={"Enter Password"}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      padding={"16px"}
                    />
                  )}
                />
              </Box>
              {/* <Box mt={2}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Box>
                <FormGroup>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                      />
                    }
                    label={
                      <Typography
                        style={styles.cursor}
                        fontFamily={"Poppins-Regular"}
                        color={"#000000"}
                        fontSize={"12px"}>
                        Remember me
                      </Typography>
                    }
                    labelPlacement="end"
                  />
                </FormGroup>
              </Box>
              <Box
                style={styles.cursor}
                onClick={() => navigate("/forgot-password")}>
                <Typography
                  fontFamily={"Poppins-Regular"}
                  color={"#000000"}
                  fontSize={"12px"}>
                  Forgot Password ?
                </Typography>
              </Box>
            </Box>
          </Box> */}

              <Box mt={2}>
                <CustomButton
                  title={"Sign In"}
                  borderButton={false}
                  type={"submit"}
                  width={"100%"}
                  backgroundColor={Colors.buttonThemeColor}
                  textColor={Colors.white}
                />
              </Box>
            </form>
          </StyledLoginCard>
        </Box>
      </Box>
    </>
  );
};

export default Login;
