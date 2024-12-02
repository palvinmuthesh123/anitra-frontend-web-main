// index.js

import { combineReducers } from "redux";

// Create the Redux store with the combined reducers and Saga middleware
import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "redux-saga";
import axios from "axios";
// import { watchProductSagas } from "./productSaga";
import { all } from "redux-saga/effects"; // Import the 'all' function

import productReducer from "./pages/Product/productSlice";
import { watchProductSagas } from "./pages/Product";
import { BACKEND_API_URL } from "./utilities/constants";

// Combine the reducers
const rootReducer = combineReducers({
  product: productReducer,
});

// Create the Axios instance
axios.defaults.baseURL = BACKEND_API_URL; // Replace with your API base URL

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Get the user token from the localStorage or any other source

    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    const userToken = user?.data;

    // function postHeaders() {
    //   return {
    //     "Content-Type": "application/json",
    //   };
    // }

    // Add the Authorization header with the Bearer token
    config.headers.Authorization = `Bearer ${userToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(function* rootSaga() {
  yield all([watchProductSagas()]);
});

export default store;
