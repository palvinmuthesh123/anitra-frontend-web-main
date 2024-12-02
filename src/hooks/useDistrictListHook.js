import React, { useState } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

export const useDistrictListHook = (props) => {
  const { user } = useAppContext();

  const [districtList, setDistrictList] = useState({
    data: [],
    loader: false,
  });

  const getDistrictList = async (search) => {
    if (search && search?.length > 0) {
      setDistrictList({ loader: true });
      const payload = {
        skip: 0,
        limit: 10,
        searchText: search,
      };

      const URL =
        user?.role?.code === "admin"
          ? `master/districts`
          : `madmin/master/districts`;
      try {
        const response = await apiRequest({
          url: URL,
          method: "POST",
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
              title: `${item?.District}`,
              value: item?._id,
            };
            return data;
          }
        });
        setDistrictList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { districtList, getDistrictList, setDistrictList };
};
