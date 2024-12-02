import React, { useState } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

export const useVillageListHook = (props) => {
  const { user } = useAppContext();

  const [villageList, setVillageList] = useState({
    data: [],
    loader: false,
  });

  const getVillageList = async (search) => {
    if (search && search?.length > 0) {
      setVillageList({ loader: true });
      const payload = {
        skip: 0,
        limit: 10,
        searchText: search,
      };

      const URL =
        user?.role?.code === "admin"
          ? `master/villages`
          : `madmin/master/villages`;
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
          }else{
            const data = {
              title: `${item?.Village}`,
              value: item?._id,
            };
            return data;
          }
        });
        setVillageList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { villageList, getVillageList, setVillageList };
};
