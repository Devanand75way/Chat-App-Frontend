import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
// import { User } from "../../types";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  loading: boolean;
  userId: number;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accesstoken") ?? "",
  refreshToken: localStorage.getItem("refreshtoken") ?? "",
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  loading: false,
  userId: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    resetToken: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
        return state;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const { data } = action.payload;
        console.log(data);
        localStorage.setItem("accessToken", data.accesstoken);
        localStorage.setItem("refreshToken", data.refreshtoken);
        localStorage.setItem("id", data.id.toString());
        state.accessToken = data.accesstoken;
        state.refreshToken = data.refreshtoken;
        state.isAuthenticated = true;
        state.userId = data.id;
        return state;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.isAuthenticated = false;
        return state;
      });
  },
});

export const { setTokens, resetToken , setLoading} = authSlice.actions;

export default authSlice.reducer;
