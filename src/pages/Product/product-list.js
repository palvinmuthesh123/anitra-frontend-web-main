import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsRequest } from "./productSlice";

const ProductList = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  return (
    <div>
      <h2>Products:</h2>
      <ul>
        {products?.data?.map((product) => (
          <li key={product.id}>{product.user_id}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
