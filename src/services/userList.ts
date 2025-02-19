import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store/store"
import { ApiResponse, User } from "../types";



const baseUrl = import.meta.env.VITE_SERVER_URL;

export const UserListApi = createApi({
    reducerPath: 'userListApi',
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
        getUserList: builder.query<ApiResponse<User[]>, void>({
            query: () => ({
                url: '/users/',
                method: 'GET',
            })
        }),

        DataExceptLoggedInuser: builder.query<ApiResponse<User[]>, number>({
            query: (id) => {
                console.log("userID:", id);
                return {
                    url: `/users/${id}`,
                    method: "GET",
                };
            },
        }),

    }),
})



export const { useGetUserListQuery, useDataExceptLoggedInuserQuery } = UserListApi;