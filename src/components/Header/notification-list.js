import React, { useState, useEffect } from "react";
import styles from "./notification.module.css";
import notificationsSvg from "../../assets/notification white.svg";
import Divider from "@mui/material/Divider";
import { Box, Typography } from "@mui/material";
import { apiRequest } from "../../services/api-request";
import { io } from "socket.io-client";
import { UTCformatDate } from "../../utilities/date-utility";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Notifications = (props) => {
  const [notificationList, setNotificationList] = useState([]);

  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const [limit, setLimit] = useState(10);

  const [unreadCount, setUnreadCount] = useState(0);

  const { user } = useAppContext();

  useEffect(() => {
    const userToken = user?.data;
    const socket = io("wss://api.anitra.co.in/", {
      withCredentials: true,
      extraHeaders: {
        authorization: `Bearer ${userToken}`,
      },
    });

    socket.on("admin_msg", (message) => {
      setNotificationList((prevNotifications) => [
        message,
        ...prevNotifications,
      ]);
      if (!message.read) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getAllNotification = () => {
    const URL =
      user?.role?.code === "admin"
        ? "user/notification/list"
        : "mithun/notification/list";
    apiRequest({
      url: URL,
      method: "POST",
      data: { limit },
    })
      .then((res) => {
        setNotificationList(res?.data);

        const count = res?.data?.filter(
          (notification) => !notification?.read
        )?.length;
        setUnreadCount(count);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getAllNotification();
  }, [limit]);

  const isNotificationRead = (notification) => {
    const URL =
      user?.role?.code === "admin"
        ? `user/toggle-notification/${notification?.notification_id}`
        : `mithun/toggle-notification/${notification?.notification_id}`;
    apiRequest({
      url: URL,
      method: "PUT",
    })
      .then((res) => {
        getAllNotification();
        setOpenNotificationModal(false);
      })
      .catch((err) => {
        alert(err);
      });
    if (user?.role?.code === "admin") {
      if (notification?.type === "BUY") {
        navigate("/request/buy");
        setOpenNotificationModal(false);
      } else if (notification?.type === "SELL") {
        navigate("/request/sell");
        setOpenNotificationModal(false);
      } else if (notification?.type === "NUTRITION") {
        navigate("/request/feed-nutrition");
        setOpenNotificationModal(false);
      }
    } else {
      if (notification?.type === "BUY") {
        navigate("/request/buy");
        setOpenNotificationModal(false);
      } else if (notification?.type === "SELL") {
        navigate("/request/sell");
        setOpenNotificationModal(false);
      } else if (notification?.type === "NUTRITION") {
        navigate("/master/feed-nutrition");
        setOpenNotificationModal(false);
      }
    }
  };

  const handleViewMoreClick = () => {
    const newLimit = limit + 5;
    setLimit(newLimit);
  };

  useEffect(() => {
    if (location.pathname) {
      setOpenNotificationModal(false);
    }
  }, [location]);

  return (
    <>
      <Box position={"relative"} zIndex={1}>
        <Box
          position={"relative"}
          sx={{
            cursor: "pointer",
          }}
          mr={"20px"}
          zIndex={1}
          className="noClose"
          onClick={() => setOpenNotificationModal(!openNotificationModal)}
        >
          <img
            src={notificationsSvg}
            alt=""
            width={"33px"}
            style={{ objectFit: "contain" }}
          />
          <Box
            className={styles.containerBox}
            position={"absolute"}
            display={"flex"}
            justifyContent={"center"}
            backgroundColor={"#fff"}
            borderRadius={"50%"}
            width={"15px"}
            height={"15px"}
            alignItems={"center"}
            top={"0px"}
            left={"20px"}
            fontSize={"12px"}
          >
            {unreadCount ? unreadCount : 0}
          </Box>
        </Box>
        {openNotificationModal && (
          <div>
            <div>
              <Box mt={"20px"} className={styles.content}>
                <Box
                  width={"380px"}
                  boxShadow={"rgba(170, 180, 190, 0.3) 0px 4px 20px"}
                  borderRadius={"5px"}
                  height={"auto"}
                  sx={{ backgroundColor: "#fff" }}
                  classNam={styles.notificationContainer}
                >
                  <Typography
                    sx={{
                      padding: "15px 0px 0px 15px",
                    }}
                    fontFamily={"Poppins-Regular"}
                    className={styles.heading}
                  >
                    Notifications
                  </Typography>
                  <Divider textAlign="right" className={styles.divider}>
                    All
                  </Divider>
                  <Box
                    height={"auto"}
                    minHeight={"100px"}
                    maxHeight={"400px"}
                    sx={{
                      overflowY: "scroll",
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#ddd",
                      },
                    }}
                  >
                    {notificationList?.length ? (
                      notificationList?.map((notification) => {
                        return (
                          <Box
                            padding={"0px 15px 0px 15px"}
                            key={notification?._id}
                          >
                            <Box
                              padding={"0px 10px 5px 5px"}
                              backgroundColor={
                                notification?.read === true
                                  ? "#fff"
                                  : "#378fe933"
                              }
                              key={notification?._id}
                              mt={"13px"}
                              onClick={() => {
                                isNotificationRead(notification);
                              }}
                              sx={{ cursor: "pointer" }}
                              borderRadius={"10px"}
                            >
                              <Box
                                display={"flex"}
                                gap={"10px"}
                                alignItems={"baseline"}
                                justifyContent={"space-between"}
                              >
                                <Box
                                  display={"flex"}
                                  gap={"8px"}
                                  alignItems={"baseline"}
                                >
                                  <Box
                                    sx={{
                                      backgroundColor:
                                        notification?.read === false
                                          ? "green !important"
                                          : "grey !important",
                                    }}
                                    width={"12px"}
                                    height={"8px"}
                                    borderRadius={"50%"}
                                  ></Box>
                                  <Box>
                                    <p
                                      className={styles.notification}
                                      style={{
                                        fontFamily: "Poppins-Regular",
                                      }}
                                    >
                                      {notification?.title}
                                    </p>
                                    <p
                                      className={styles.notificationSubHeading}
                                      style={{
                                        fontFamily: "Poppins-Regular",
                                      }}
                                    >
                                      {notification?.description}
                                    </p>

                                    <Typography
                                      className={styles.notificationSubHeading}
                                      style={{
                                        fontFamily: "Poppins-Regular",
                                        display: "flex",
                                      }}
                                    >
                                      {`${notification?.payload?.partner_details?.state_name}, ${notification?.payload?.partner_details?.district_name}, ${notification?.payload?.partner_details?.mandal_name}, ${notification?.payload?.partner_details?.village_name}, ${notification?.payload?.partner_details?.hamlet_name}`}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box>
                                  <p
                                    className={styles.notificationTime}
                                    style={{
                                      fontFamily: "Poppins-Regular",
                                    }}
                                  >
                                    {UTCformatDate(notification?.created_on)}
                                  </p>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Box
                        padding={"40px 0px"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography
                          fontFamily={"Poppins-Regular"}
                          color={"#000"}
                          fontSize={"16px"}
                        >
                          No Notifications Available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    display={"flex"}
                    mt={"12px"}
                    justifyContent={"center"}
                    sx={{
                      padding: "0px 0px 15px 15px",
                    }}
                    className="viewMoreNoClose"
                    onClick={() => handleViewMoreClick()}
                  >
                    <Typography
                      sx={{ cursor: "pointer" }}
                      fontFamily={"Poppins-Regular"}
                      fontSize={"16px"}
                      color={"rgb(0, 0, 0)"}
                    >
                      {"View More"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default Notifications;
