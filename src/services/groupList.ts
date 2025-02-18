import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
// import { RootState } from "../store/store"
import { ApiResponse, User } from "../types";
import { useAppSelector } from "../store/store";


const baseUrl = import.meta.env.VITE_SERVER_URL;
const getUserId = () => {
    const { userId } = useAppSelector((state) => state.auth);
    return userId;
};


export const groupList = createApi({
    reducerPath: 'groupListApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        // prepareHeaders: (headers, { getState }) => {
        //     const token = (getState() as RootState).auth.accessToken;
        //     if (token) {
        //         headers.set("Authorization", `Bearer ${token}`);
        //     }
        //     return headers;
        // },

    }),
        getGroupList: builder.query<ApiResponse<User[]> , void>({
            query: () => ({
               url: `/group/${getUserId()}`,
                method: 'GET',
            })
        }),
    
})



export const { useGetGroupListQuery } = groupList;