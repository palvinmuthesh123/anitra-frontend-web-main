import React, { useState } from "react";
import { apiRequest } from "../services/api-request";

export const useHamletListHook = (props) => {
  const [hamletList, setHamletList] = useState({
    data: [],
    loader: false,
  });

  const getHamletList = async (search) => {
    if (search && search?.length > 0) {
      setHamletList({ loader: true });
      const payload = {
        skip: 0,
        limit: 10,
        searchText: search,
      };
      try {
        const response = await apiRequest({
          url: `master/hamlets`,
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
        setHamletList({ data: modifiedList, loader: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { hamletList, getHamletList, setHamletList };
};
