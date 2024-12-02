import React, { useState } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

export const useStateListHook = (props) => {
  
  const { user } = useAppContext();

  const [stateList, setStateList] = useState({
    data: [],
    loader: false,
  });

  const getStatesList = async (search) => {
    if (search && search?.length > 0) {
      setStateList({ loader: true });
      try {
        const URL =
          user?.role?.code === "admin"
            ? `master/states?skip=0&limit=${10}&search=${search}`
            : `madmin/master/states`;

        const payload = {
          skip: 0,
          limit: 10,
          searchText: search,
        };

        const response = await apiRequest({
          url: URL,
          method: user?.role?.code === "admin" ? "GET" : "POST",
          data: payload,
        });
        const modifiedList = response?.data?.map((item) => {
          if (user?.role?.code === "admin") {
            const data = {
              title: `${item?.display_name}`,
              value: item?.id,
            };
            return data;
          } else {
            const data = {
              title: `${item?.State}`,
              value: item?._id,
            };
            return data;
          }
        });
        setStateList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { stateList, getStatesList, setStateList };
};
