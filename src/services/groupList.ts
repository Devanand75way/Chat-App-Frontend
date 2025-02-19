import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, Group, User } from "../types";
import { RootState } from "../store/store"; // Import RootState

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const groupList = createApi({
    reducerPath: "groupListApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({

        createGroup: builder.mutation<ApiResponse<Group>, Group>({
            query: (body) => ({
              url: "/group/",
              method: "POST",
              body,
            }),
          }),
          
        getGroupList: builder.query<ApiResponse<User[]>, void>({
            query: () => {
                return {
                    url: `/group/`,
                    method: "GET",
                };
            },
        }),
        getGroupMessages: builder.query<ApiResponse<[]>,  number>({
                   query: (id) => ({
                       url: `/message/${id}`,
                       method: "GET",
                   }),
        }),
    }),
});

export const { useGetGroupListQuery , useGetGroupMessagesQuery , useCreateGroupMutation} = groupList;
