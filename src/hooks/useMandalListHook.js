import React, { useState } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

export const useMandalListHook = () => {
  const { user } = useAppContext();
  const [mandalList, setMandalList] = useState({
    data: [],
    loader: false,
  });

  const getMandalList = async (search) => {
    if (search && search?.length > 0) {
      setMandalList({ loader: true });
      const payload = {
        skip: 0,
        limit: 10,
        searchText: search,
      };
      const URL =
        user?.role?.code === "admin"
          ? `master/mandals`
          : `madmin/master/mandals`;
      try {
        const response = await apiRequest({
          url: URL,
          method: "POST",
          data: payload,
        });
        const modifiedList = response?.data?.map((item) => {
          if (user?.roe?.code === "admin") {
            const data = {
              title: `${item?.display_name}`,
              value: item?.id,
            };
            return data;
          }else{
            const data = {
              title: `${item?.Block}`,
              value: item?._id,
            };
            return data;
          }
        });
        setMandalList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { mandalList, getMandalList, setMandalList };
};
