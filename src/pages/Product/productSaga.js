// productSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";
import {
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductsRequest,
} from "./productSlice";

function* fetchProductsSaga() {
  try {
    const response = yield call(axios.post, "/animal/list");
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error.message));
  }
}

export function* watchProductSagas() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
}
