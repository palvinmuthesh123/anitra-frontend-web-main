import React from "react";
import { Grid, Divider, Link } from "@mui/material";
import { Colors } from "../../constants/Colors";

import { useNavigate } from "react-router-dom";

export const styles = {
  dividerStyle: { backgroundColor: Colors.headerColor, padding: 0.05 },
  tabLink: { textDecorationLine: "none", cursor: "pointer" },
  iconColor: { color: Colors.headerColor, fontSize: 18 },
};

export const CustomTab = (props) => {
  const { tab, userType, userId, setTab, prefixUrl } = props;
  const navigate = useNavigate();
  return (
    <Grid container gap={6} margin={props.margin ? props.margin : 2}>
      {props.data?.map((item) => {
        return (
          <Grid
            item
            key={item.id}
            onClick={() => {
              if (userId) {
                if (prefixUrl) {
                  navigate(
                    `/${prefixUrl}/${userType}/${userId}/details/${item?.id}`
                  );
                } else {
                  navigate(`/${userType}/${userId}/details/${item?.id}`);
                }
              } else {
                setTab(item);
              }
            }}
          >
            <Link
              fontFamily={"Poppins-Regular"}
              fontSize={15}
              color={tab.id === item.id ? Colors.headerColor : Colors.textColor}
              sx={styles.tabLink}
            >
              {item.title}
            </Link>
            {tab.id === item.id && <Divider sx={styles.dividerStyle} />}
          </Grid>
        );
      })}
    </Grid>
  );
};
