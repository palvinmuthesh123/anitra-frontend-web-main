import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api-request";

const useIndividualTraderHook = () => {
  const [traderList, setTradersList] = useState({
    data: [],
    loader: false,
  });

  const getTradersList = async (searchQuery) => {
    const url = `trader/list`;
    const payload = {
      skip: 0,
      searchText: searchQuery,
      limit: 10,
      sort_field: "_id",
      sort_order: "desc",
      search_fields: ["name", "mobile", "user_id"],
    };

    if (searchQuery && searchQuery?.length > 0) {
      try {
        const response = await apiRequest({
          url: url,
          method: "POST",
          data: payload,
        });
        const modifiedMandalList = response?.data?.map((farmer) => ({
          title: farmer?.name,
          value: farmer?.user_id,
        }));
        setTradersList({
          data: modifiedMandalList ? modifiedMandalList : [],
          open: true,
        });
      } catch (error) {
        setTradersList({
          data: [],
          open: false,
        });
      }
    }
  };

  return { traderList, setTradersList, getTradersList };
};

export default useIndividualTraderHook;
