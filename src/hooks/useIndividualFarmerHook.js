import React, { useState } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

const useIndividualFarmerHook = () => {
  const { user } = useAppContext();

  const [farmerList, setFarmerList] = useState({
    data: [],
    loader: false,
  });

  const getFarmerList = async (searchQuery) => {
    const URL =
      user?.role?.code === "admin" ? `farmer/list` : `madmin/farmer/list`;

    const payload = {
      skip: 0,
      searchText: searchQuery,
      limit: 10,
      search_fields: ["name", "mobile", "user_id"],
    };

    if (searchQuery && searchQuery?.length > 0) {
      try {
        const response = await apiRequest({
          url: URL,
          method: "POST",
          data: payload,
        });
        const modifiedMandalList = response?.data?.map((farmer) => ({
          title: farmer?.name,
          value: farmer?.user_id,
        }));
        setFarmerList({
          data: modifiedMandalList ? modifiedMandalList : [],
          open: true,
        });
      } catch (error) {
        setFarmerList({
          data: [],
          open: false,
        });
      }
    }
  };

  return { farmerList, setFarmerList, getFarmerList };
};

export default useIndividualFarmerHook;
