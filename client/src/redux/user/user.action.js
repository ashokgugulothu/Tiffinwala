import axios from "axios";
import { userRequest, userSuccess, userFail, userLogout } from "./user.reducer";

const API_BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

export const login = (user) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const config = { headers: { "Content-Type": "application/json" } };
    const userData = await axios({
      method: "POST",
      url: `${API_BASE}/api/v1/user/login`,
      data: user,
      config,
    });
    
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.data.userToken}`;
    localStorage.setItem(
      "userToken",
      JSON.stringify({ userToken: userData.data.userToken })
    );
    return dispatch(userSuccess(userData.data));
  } catch (error) {
    return dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const signUp = (user) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const config = { headers: { "Content-Type": "application/json" } };
    const userData = await axios({
      method: "POST",
      url: `${API_BASE}/api/v1/user/signUp`,
      data: user,
      config,
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.data.userToken}`;
    localStorage.setItem(
      "userToken",
      JSON.stringify({ userToken: userData.data.userToken })
    );
    return dispatch(userSuccess(userData.data));
  } catch (error) {
    return dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    localStorage.removeItem("userToken");
    return dispatch(userLogout());
  } catch (error) {
    return dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const getUserDetails = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    const userData = await axios({
      method: "GET",
      url: `${API_BASE}/api/v1/user/me`,
    });
    return dispatch(userSuccess(userData.data.user));
  } catch (error) {
    return dispatch(userFail(error?.response?.data?.message || error.message));
  }
};