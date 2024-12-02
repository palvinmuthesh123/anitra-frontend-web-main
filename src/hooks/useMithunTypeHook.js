import React, { useState } from "react";
import { apiRequest } from "../services/api-request";


export const useMithunTypeHook = () => {


  const [mithunTypeList, setMithunList] = useState({
    data: [],
    loader: false,
  });

  const getMithunType = async (search) => {
    if (search && search?.length > 0) {
      setMithunList({ loader: true });
      try {
        const URL = `madmin/master/types`;

        const payload = {
          skip: 0,
          limit: 10,
          searchText: search,
        };

        const response = await apiRequest({
          url: URL,
          method: "POST",
          data: payload,
        });
        const modifiedList = response?.data?.map((item) => {
          const data = {
            title: `${item?.display_name}`,
            value: item?.id,
          };
          return data;
        });
        setMithunList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { mithunTypeList, getMithunType, setMithunList };
};
