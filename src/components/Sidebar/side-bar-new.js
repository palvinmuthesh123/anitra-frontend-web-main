import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import "./sideMenuStyles.css";
import { useAppContext } from "../../context/AppContext";
import activeDashboardSvg from "../../../src/assets/sidebar/activeDashboard.svg";
import inActiveDashboardSvg from "../../../src/assets/sidebar/inactiveDashboard.svg";
import activeMithunSvg from "../../../src/assets/sidebar/activeMithun.svg";
import inActiveMithunSvg from "../../../src/assets/sidebar/inActiveMithun.svg";
import inActiveFarmerSvg from "../../../src/assets/sidebar/InactiveFarmer.svg";
import activeFarmerSvg from "../../../src/assets/sidebar/activeFarmer.svg";
import activeStateSvg from "../../../src/assets/sidebar/activeState.svg";
import inActiveStateSvg from "../../../src/assets/sidebar/inactiveState.svg";
import activeDistrictSvg from "../../../src/assets/sidebar/activedistrict.svg";
import inActiveDistrictSvg from "../../../src/assets/sidebar/inactivedistrict.svg";
import inActiveMandalSvg from "../../../src/assets/sidebar/inactveMandal.svg";
import activeMandalSvg from "../../../src/assets/sidebar/actveMandal.svg";
import activeVillageSvg from "../../../src/assets/sidebar/activeVillage.svg";
import inActiveVillageSvg from "../../../src/assets/sidebar/inactiveVillage.svg";
import inActiveTribesSvg from "../../../src/assets/sidebar/inactveTribes.svg";
import activeTribesSvg from "../../../src/assets/sidebar/actveTribes.svg";
import activeMithunSocietySvg from "../../../src/assets/sidebar/activeMithunSociety.svg";
import InActiveMithunSocietySvg from "../../../src/assets/sidebar/inactiveMithunSociety.svg";
import InActiveHealthSvg from "../../../src/assets/sidebar/inactiveHealth.svg";
import activeHealthSvg from "../../../src/assets/sidebar/activeHealth.svg";
import InActiveFeedSvg from "../../../src/assets/sidebar/inactiveFeed.svg";
import ActiveFeedSvg from "../../../src/assets/sidebar/activeFeed.svg";
import ActiveAnimalSvg from "../../../src/assets/sidebar/ActiveAnimalType.svg";
import InActiveAnimalSvg from "../../../src/assets/sidebar/inactiveAnimalType.svg";
import notificationSvg from "../../assets/notification-bell.svg";

function hasChildren(node) {
  return (
    typeof node === "object" &&
    typeof node.children !== "undefined" &&
    node.children.length > 0
  );
}

const MenuItem = (props) => {
  const { item } = props;
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};

const SingleLevel = (props) => {
  const { pathname } = useLocation();
  const { item } = props;
  let itemProps = {};
  if (item.to) {
    itemProps = {
      component: NavLink,
      to: item.to,
    };
  }

  const isActive = pathname === item.activeTo;

  return (
    <Box
      {...itemProps}
      style={{ textDecoration: "none" }}
      display={"flex"}
      padding={"10px"}
      gap={"10px"}
      borderRadius={"6px"}
      alignItems={"center"}
    >
      <Box
        component="img"
        width={"22px"}
        height={"22px"}
        alt="Logo"
        src={
          pathname.includes(item.to)
            ? item.icon
            : isActive
            ? item.icon
            : item.inactiveIcon
        }
      />
      <Typography
        style={{ textDecoration: "none" }}
        fontFamily={"poppins"}
        fontSize={"15px"}
        color={
          item.to
            ? `${pathname.includes(item.to) || isActive ? "#B1040E" : "black"}`
            : `${item.inactiveIcon ? "#f7f7f7" : null}`
        }
      >
        {" "}
        {item.title}
      </Typography>
    </Box>
  );
};

const MultiLevel = (props) => {
  const { pathname } = useLocation();
  const { item } = props;
  const { children } = item;

  const allPaths = item?.children?.map((item) => item?.to);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (allPaths.some((path) => pathname.startsWith(path))) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [pathname]);

  let itemProps = {};
  if (item.to) {
    itemProps = {
      component: NavLink,
      to: item.to,
    };
  }

  const handleClick = (e) => {
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      <Box
        {...itemProps}
        button
        onClick={handleClick}
        style={{ textDecoration: "none" }}
        sx={{ cursor: "pointer" }}
        justifyContent={"space-between"}
        display={"flex"}
        gap={"10px"}
        padding={"10px"}
        borderRadius={"6px"}
        alignItems={"center"}
      >
        <Box display={"flex"} gap={"10px"}>
          <Typography fontSize={"15px"} fontFamily={"poppins"}>
            {item.title}
          </Typography>
        </Box>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Box>
        {expanded && (
          <>
            {children.map((child, key) => (
              <MenuItem key={key} item={child} />
            ))}
          </>
        )}
      </Box>
    </React.Fragment>
  );
};

const SideMenuNew = (props) => {
  const navigate = useNavigate();

  const { user } = useAppContext();

  const sideMenuList = [
    {
      title: "Dashboard",
      icon: require("../../assets/dashboard.png"),
      inactiveIcon: require("../../assets/dashboard.png"),
      to: "/dashboard",
    },
    {
      title: "Partners",
      icon: "",
      inactiveIcon: "",
      children: [
        {
          title: "Farmers",
          icon: require("../../assets/active-farmer.png"),
          inactiveIcon: require("../../assets/farmer_sidebar.png"),
          to: "/user/farmers",
        },
        {
          title: "Traders",
          icon: require("../../assets/active-trader.png"),
          inactiveIcon: require("../../assets/trader.png"),
          to: "/user/traders",
        },
        {
          title: "ACE",
          icon: require("../../assets/active-ace.png"),
          inactiveIcon: require("../../assets/ace.png"),
          to: "/user/ace",
        },
        {
          title: "Anitra Users",
          icon: require("../../assets/active-ace.png"),
          inactiveIcon: require("../../assets/ace.png"),
          to: "/anitra-users",
        },
        {
          title: "Veterinarian",
          icon: require("../../assets/active-ace.png"),
          inactiveIcon: require("../../assets/ace.png"),
          to: "/veterinarian",
        }
      ],
    },
    {
      title: "Animals",
      children: [
        {
          title: "Animals",
          icon: require("../../assets/farmer_sidebar.png"),
          inactiveIcon: require("../../assets/farmer_sidebar.png"),
          to: "/animals",
        },
      ],
    },
    {
      title: "Requests",
      children: [
        {
          id: 22,
          title: "Buy",
          icon: require("../../assets/shake.png"),
          inactiveIcon: require("../../assets/shake.png"),
          to: "/request/buy",
        },
        {
          id: 23,
          title: "Sell",
          icon: require("../../assets/shake.png"),
          inactiveIcon: require("../../assets/shake.png"),
          to: "/request/sell",
        },
        {
          id: 4,
          title: "Health Services",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/request/health-services",
        },
        {
          id: 5,
          title: "Feed & Nutrition",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/request/feed-nutrition",
        },
      ],
    },
    {
      title: "Push Notifications",
      icon: notificationSvg,
      inactiveIcon: notificationSvg,
      to: "/notifications",
    },
    {
      id: 6,
      title: "Masters",
      children: [
        {
          id: 7,
          title: "Animal Categories",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/animal-categories",
        },
        {
          id: 7,
          title: "Animal Breeds",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/animal-breeds",
        },
        {
          id: 7,
          title: "Animal Types",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/animal-types",
        },
        {
          id: 15,
          title: "Animal Prices",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/animal-prices",
        },
        {
          id: 8,
          title: "State",
          icon: require("../../assets/state.png"),
          inactiveIcon: require("../../assets/state.png"),
          to: "/master/states",
        },
        {
          id: 9,
          title: "District",
          icon: require("../../assets/district.png"),
          inactiveIcon: require("../../assets/district.png"),
          to: "/master/districts",
        },
        {
          id: 10,
          title: "Mandal",
          icon: require("../../assets/mandal.png"),
          inactiveIcon: require("../../assets/mandal.png"),
          to: "/master/mandals",
        },
        {
          id: 11,
          title: "Village",
          icon: require("../../assets/village.png"),
          inactiveIcon: require("../../assets/village.png"),
          to: "/master/villages",
        },
        {
          id: 11,
          title: "Hamlet",
          icon: require("../../assets/village.png"),
          inactiveIcon: require("../../assets/village.png"),
          to: "/master/hamlets",
        },

        {
          id: 13,
          title: "Health Services",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/health-services",
        },
        {
          id: 14,
          title: "Store",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/master/feed-nutrition",
        },
        {
          id: 15,
          title: "Ads",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/ads",
        },
        {
          id: 16,
          title: "Banners",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/banner",
        },
      ],
    },
    {
      // id: 7,
      title: "Muzzle Data",
      children: [
        {
          id: 2,
          title: "Company",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/muzzlecompany"
        },
        {
          id: 3,
          title: "Users",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/muzzleuser"
        },
        {
          id: 4,
          title: "Farmers",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/muzzlefarmer"
        },
        {
          id: 5,
          title: "Animals",
          icon: require("../../assets/dog.png"),
          inactiveIcon: require("../../assets/dog.png"),
          to: "/muzzleanimal"
        }
      ],
    },
  ];

  const mithunMenuList = [
    {
      title: "Dashboard",
      icon: activeDashboardSvg,
      inactiveIcon: inActiveDashboardSvg,
      to: "/dashboard",
      activeTo: "/dashboard",
    },
    {
      title: "Mithun's",
      icon: activeMithunSvg,
      inactiveIcon: inActiveMithunSvg,
      to: "/animals",
    },
    {
      title: "Farmers",
      icon: activeFarmerSvg,
      inactiveIcon: inActiveFarmerSvg,
      to: "/user/mithun-farmers",
    },
    // {
    //   title: "Buyers",
    //   icon: require("../../assets/shake.png"),
    //   inactiveIcon: require("../../assets/shake.png"),
    //   to: "/user/buyers",
    // },
    // {
    //   title: "ADC's",
    //   icon: require("../../assets/shake.png"),
    //   inactiveIcon: require("../../assets/shake.png"),
    //   to: "/user/adc",
    // },
    {
      title: "Push Notifications",
      icon: notificationSvg,
      inactiveIcon: notificationSvg,
      to: "/notifications",
    },
    {
      id: 6,
      title: "Masters",
      children: [
        {
          id: 8,
          title: "States",
          icon: activeStateSvg,
          inactiveIcon: inActiveStateSvg,
          to: "/master/states",
        },
        {
          id: 9,
          title: "Districts",
          icon: activeDistrictSvg,
          inactiveIcon: inActiveDistrictSvg,
          to: "/master/districts",
        },
        {
          id: 10,
          title: "Mandals",
          icon: activeMandalSvg,
          inactiveIcon: inActiveMandalSvg,
          to: "/master/mandals",
        },
        {
          id: 12,
          title: "Villages",
          icon: activeVillageSvg,
          inactiveIcon: inActiveVillageSvg,
          to: "/master/villages",
        },

        {
          id: 13,
          title: "Tribes",
          icon: activeTribesSvg,
          inactiveIcon: inActiveTribesSvg,
          to: "/master/tribes",
        },

        {
          id: 14,
          title: "Mithun Society",
          icon: activeMithunSocietySvg,
          inactiveIcon: InActiveMithunSocietySvg,
          to: "/master/mithun-society",
        },

        {
          id: 15,
          title: "Health Services",
          icon: activeHealthSvg,
          inactiveIcon: InActiveHealthSvg,
          to: "/master/health-services",
        },
        {
          id: 17,
          title: "Feed & Nutrition",
          icon: ActiveFeedSvg,
          inactiveIcon: InActiveFeedSvg,
          to: "/master/feed-nutrition",
        },
        {
          id: 16,
          title: "Animal Types",
          icon: ActiveAnimalSvg,
          inactiveIcon: InActiveAnimalSvg,
          to: "/master/animal-types",
        },
      ],
    },

    // {
    //   title: "Mithun",
    //   children: [
    //     {
    //       id: 51,
    //       title: "Dashboard",
    //       icon: require("../../assets/shake.png"),
    //       inactiveIcon: require("../../assets/shake.png"),
    //       to: "/mithun/dashboard",
    //     },
    //     {
    //       id: 52,
    //       title: "Farmers",
    //       icon: require("../../assets/shake.png"),
    //       inactiveIcon: require("../../assets/shake.png"),
    //       to: "/user/mithun-farmers",
    //     },
    //     {
    //       id: 53,
    //       title: "Animals",
    //       icon: require("../../assets/dog.png"),
    //       inactiveIcon: require("../../assets/dog.png"),
    //       to: "/mithun/animals",
    //     },
    //   ],
    // },
  ];

  const [userCode, setUseCode] = useState(null);

  const [filteredMenuList, setFilteredMenuList] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUseCode(userData);
  }, []);

  useEffect(() => {
    if (userCode?.role?.code === "mithunAdmin") {
      setFilteredMenuList(mithunMenuList);
    } else if (userCode?.role?.code === "admin") {
      setFilteredMenuList(sideMenuList);
    }
  }, [userCode]);

  return (
    <>
      <Box>
        <Box
          bgcolor={"#fff"}
          height={"100vh"}
          borderRadius={"0px 12px 12px 0px"}
          boxShadow={"0px 24px 48px #00183414"}
          padding={"15px 15px 0px 15px"}
          position={"relative"}
        >
          <Box textAlign={"left"} mr={"10px"}>
            <img
              alt="anitraLogo"
              src={
                user?.role?.code === "admin"
                  ? require("../../assets/Anitra-Logo (1).png")
                  : require("../../assets/newmanitra.png")
              }
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box
            mt={1}
            className="sideMenu"
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            {filteredMenuList.map((item, key) => (
              <MenuItem key={key} item={item} />
            ))}
          </Box>
          <Box position={"absolute"} bottom={"30px"} width={"100%"}>
            <Box
              display={"flex"}
              gap={"10px"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Box
                width={"70%"}
                display={"flex"}
                gap={"10px"}
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={"#B1040E"}
                padding={"10px"}
                borderRadius={"20px"}
                onClick={() => {
                  props.handleLogoutSuccess();
                  navigate("/login");
                }}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  fontFamily={"poppins"}
                  color={"#fff"}
                  fontSize={"15px"}
                >
                  Logout
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SideMenuNew;
