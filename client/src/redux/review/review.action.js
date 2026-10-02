import axios from "axios";
import {
  reviewRequest,
  providerReviewRequest,
  reviewSuccess,
  reviewFail,
  addReviewSuccess,
  allReviewSuccess,
} from "./review.reducer";

const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

export const addReview = (data) => async (dispatch) => {
  try {
    dispatch(reviewRequest());
    const review = await axios({
      method: "POST",
      url: `${API_BASE}/api/v1/review`,
      data,
    });
    dispatch(addReviewSuccess(review.data));
  } catch (error) {
    return dispatch(reviewFail(error.response?.data?.message || error.message));
  }
};

export const getAllReview = () => async (dispatch) => {
  try {
    dispatch(reviewRequest());
    const review = await axios({
      method: "GET",
      url: `${API_BASE}/api/v1/review`,
    });
    dispatch(allReviewSuccess(review.data));
  } catch (error) {
    return dispatch(reviewFail());
  }
};

export const getProvidersReview = (_id) => async (dispatch) => {
  try {
    dispatch(providerReviewRequest());
    const review = await axios({
      method: "GET",
      url: `${API_BASE}/api/v1/review/${_id}`,
    });
    dispatch(reviewSuccess(review.data));
  } catch (error) {
    return dispatch(reviewFail());
  }
};