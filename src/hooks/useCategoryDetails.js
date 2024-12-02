import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api-request";
import { useAppContext } from "../context/AppContext";

const useCategoryDetails = () => {
  const [categories, setCategories] = useState([]);

  const { user = {} } = useAppContext();

  useEffect(() => {
    if(user?.role?.code === "admin"){
      const getCategories = async () => {
        try {
          const payload = {};
          const res = await apiRequest({
            url: `master/categories`,
            data: payload,
            method: "GET",
          });
  
          const modifiedData = res?.data?.map((animal) => ({
            name: animal?.display_name,
            value: animal?.id,
          }));
          setCategories(modifiedData);
        } catch (err) {
          alert(err);
        }
      };
      getCategories();
    }
  }, [])

  return categories;
};

export default useCategoryDetails;
