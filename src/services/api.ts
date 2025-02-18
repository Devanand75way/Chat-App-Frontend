import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { ApiResponse, User } from "../types";

const baseurl = import.meta.env.VITE_SERVER_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseurl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    register: builder.mutation<User, Partial<User>>({
      query: (body) => {
        return {
          url: "/users/",
          method: "POST",
          body,
        };
      },
    }),
    login: builder.mutation<
      ApiResponse<{ accesstoken: string; refreshtoken: string ; id: number}>,
      { email: string; password: string }
    >({
      query: (body) => {
        return {
          url: "/users/login",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = api;
