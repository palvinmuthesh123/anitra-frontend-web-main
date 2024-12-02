import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideMenuNew from "../Sidebar/side-bar-new";
import Header from "../Header";
import { useAppContext } from "../../context/AppContext";

const AppLayout = () => {
  const {  handleLogoutSuccess } = useAppContext();
  return (
    <div>
      <Box width={"100%"} bgcolor={"#fff"} boxShadow={"0px 0px 16px #90909029"}>
        <Box position={"fixed"} width={"230px"}>
          <SideMenuNew  handleLogoutSuccess={handleLogoutSuccess}/>
        </Box>
        <Box ml={"230px"}>
          <Header />
          <Box padding={"20px"} bgcolor={"#F8F8F8"}>
            <Outlet  handleLogoutSuccess={handleLogoutSuccess}/>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
