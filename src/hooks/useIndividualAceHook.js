import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api-request";

const useIndividualAceHook = () => {
  const [aceList, setAceList] = useState({
    data: [],
    loader: false,
  });

  const getAceList = async (searchQuery) => {
    const url = `ace/list`;
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
        setAceList({
          data: modifiedMandalList ? modifiedMandalList : [],
          open: true,
        });
      } catch (error) {
        setAceList({
          data: [],
          open: false,
        });
      }
    }
  };

  return { aceList, setAceList, getAceList };
};

export default useIndividualAceHook;
